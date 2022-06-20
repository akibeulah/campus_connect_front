import React, {useState} from 'react';
import {
    CogIcon,
    CollectionIcon,
    ExclamationCircleIcon,
    InboxIcon,
    PlusCircleIcon,
    ReceiptRefundIcon,
    RefreshIcon,
    TrendingUpIcon
} from "@heroicons/react/outline";
import {useSelector} from "react-redux";
import moment from "moment";
import axiosInstance from "../../store/axiosInstance";
import {toast} from "react-toastify";
import {Chart as ChartJS, registerables} from 'chart.js';
import {Chart} from 'react-chartjs-2'

ChartJS.register(...registerables)

function Vendor(props) {
    const state = useSelector((state) => state)
    const [loading, setLoading] = useState(false)

    const getDataSets = (data) => {
        let res = []

        for (let i = 0; i < data.length; i++) {
            if (i === 0) res.push(data[0])
            else {
                res.push(res[res.length - 1] + data[i])
            }
        }

        return res
    }

    const reqRem = () => {
        axiosInstance.post('/v1/pos/vendor_transaction_management/request_remittance/')
            .then(resp => {
                toast.success(resp.data.message, {
                    position: toast.POSITION.TOP_RIGHT
                })
            })
            .catch(error => {
                // console.log(error.response?.data.detail)
                toast.error((error.response?.data.detail), {
                    position: toast.POSITION.TOP_RIGHT
                })
            })
    }

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'NGN'
    });

    return (
        <>
            <div className="container p-2 lg:px-2 lg:py-12 mx-auto">
                <h3 className="text-2xl lg:text-5xl font-semibold w-full pt-4 pb-8">Dashboard</h3>
                <div className="flex flex-col xl:flex-row">
                    <div className="px-2 basis-full lg:basis-4/6">
                        <div className="flex flex-row w-full py-6 overflow-x-scroll scrollbar">
                            <div
                                className='drop-shadow-xl flex flex-row overflow-hidden bg-gradient-to-r from-orange-700 to-orange-400 bg-opacity-40 mx-4 rounded-xl'
                                style={{height: "150px", width: "400px"}}>
                                <img
                                    src="data:image/png;base64,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"
                                    alt="Vendor Logo" style={{width: "150px"}}/>

                                <div className="flex flex-col text-white justify-around px-2.5 py-2 font-bold w-full">
                                    <h4 className="text:xl lg:text-2xl">{state.auth.user.username}</h4>
                                    <div className={'flex flex-row items-center justify-between'}>
                                        <div className="">
                                            <h2 className={'text-sm lg:text-md'}> Main Balance </h2>
                                            <p className='text:xl lg:text-2xl font-bold'>{formatter.format(state.consumer.transactions.length !== 0 && state.consumer.transactions.map(i => i.transaction_type === "OUT" ? parseFloat(i.transaction_amount) : (-1 * parseFloat(i.transaction_amount))).reduce((a, b) => a + b, 0))}</p>
                                        </div>
                                        <CollectionIcon onClick={reqRem}
                                                        className={'h-8 w-8 cursor-pointer transition-color'}/>
                                    </div>
                                </div>
                            </div>
                            <div
                                className='text-white drop-shadow-xl max-w-xs border text-orange-400 border-orange-400  transition-all hover:text-white hover:bg-orange-600 hover:border-white mx-2 px-5 duration-500 rounded-xl cursor-pointer'>
                                <div className="flex justify-between h-full items-center my-auto"
                                     onClick={() => props.openModal({}, 12)}>
                                    <PlusCircleIcon
                                        className={'h-20 w-20 transition-all duration-500 hover:scale-110 hover:text-orange-400'}/>
                                </div>
                            </div>
                            <div
                                className='text-white drop-shadow-xl max-w-xs border text-orange-400 border-orange-400  transition-all hover:text-white hover:bg-orange-600 hover:border-white mx-2 px-5 duration-500 rounded-xl cursor-pointer'>
                                <div className="flex justify-between h-full items-center my-auto"
                                     onClick={() => props.openModal({}, 11)}>
                                    <CogIcon
                                        className={'h-20 w-20 transition-all duration-500 hover:scale-110 hover:text-orange-400'}/>
                                </div>
                            </div>
                            <div
                                className='text-white drop-shadow-xl max-w-xs border text-orange-400 border-orange-400  transition-all hover:text-white hover:bg-orange-600 hover:border-white mx-2 px-5 duration-500 rounded-xl cursor-pointer'>
                                <div className="flex justify-between h-full items-center my-auto"
                                     onClick={() => props.openModal({}, 15)}>
                                    <div className="relative">
                                        <InboxIcon
                                            className={'h-20 w-20 transition-all duration-500 hover:scale-110 hover:text-orange-400'}/>
                                        {
                                            state.consumer.messages.filter(i => i.read_at === null).length < 1 ? null :
                                                <div
                                                    className="font-extrabold text-center">{state.consumer.messages.filter(i => i.read_at === null).length} Unread</div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="my-8 hidden md:block w-full overflow-x-scroll">
                            <Chart
                                type={'line'}
                                data={{
                                    labels: state.consumer.transactions.length !== 0 && state.consumer.transactions.map(i => moment.utc(i.created_at).format('MMM Do YY, H:mm')).reverse(),
                                    datasets: [{
                                        label: 'Transactions',
                                        backgroundColor: 'rgb(213,92,42)',
                                        borderColor: 'rgb(213,92,42)',
                                        data: state.consumer.transactions.length !== 0 && getDataSets(state.consumer.transactions.map(i => i.transaction_type === "OUT" ? parseFloat(i.transaction_amount) : (-1 * parseFloat(i.transaction_amount))).reverse())
                                    }]
                                }}

                            />
                        </div>
                    </div>
                    <div className="mx-2 my-12 lg:my-0 basis-full lg:basis-2/6">
                        <h3 className="text-xl font-semibold flex items-center flex-row">
                            <span className={'pr-2'}>Transactions</span>
                            <span onClick={props.refreshTransactions}
                                  className={'rotate-0 hover:rotate-180 transition-all cursor-pointer' + (loading && 'animate-spin')}>
                                <RefreshIcon className={'h-5 w-5'}/>
                            </span>
                        </h3>
                        <div className="overflow-y-scroll max-h-screen shadow-inner shadow-lg md:py-4 md:px-2">
                            {
                                state.consumer.transactions.length !== 0 && state.consumer.transactions.sort((a, b) => Date(a.created_at) - Date(b.created_at)).map((i, k) =>
                                    <div key={k} onClick={() => props.openModal(i, 10)}
                                         className="bg-white p-3 rounded-xl shadow-xl flex items-center justify-between mt-4">
                                        <div className="flex space-x-6 items-center">
                                            {
                                                i.transaction_type === "OUT" ?
                                                    <TrendingUpIcon className={'h-8 w-8'}/>
                                                    : i.transaction_type === "IN" ?
                                                        <ReceiptRefundIcon className={'h-8 w-8'}/>
                                                        :
                                                        <ExclamationCircleIcon className={'h-8 w-8'}/>
                                            }
                                            <div>
                                                <p className="font-semibold text-base">Purchase made
                                                    at {moment.utc(i.created_at).format('MMM Do YY, H:mm')}</p>
                                                <p className="font-semibold text-xs text-gray-400">{i.transaction_desc}</p>
                                            </div>
                                        </div>

                                        <div className="flex space-x-2 items-center">
                                            <div
                                                className={i.transaction_type === "OUT" ? 'bg-green-200 rounded-md p-2 flex items-center' : 'bg-red-200 rounded-md p-2 flex items-center'}>
                                                <p className={i.transaction_type === "OUT" ? 'text-green-600 font-semibold text-xs' : 'text-red-600 font-semibold text-xs'}>₦{i.transaction_amount}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Vendor;