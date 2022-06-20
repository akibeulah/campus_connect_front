import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    CogIcon,
    FingerPrintIcon,
    IdentificationIcon,
    PlusCircleIcon,
    RefreshIcon,
    SupportIcon
} from '@heroicons/react/outline'
import moment from "moment";
import {toggleTransactionAuth} from "../../store/actions/authActions";
import ReactSwitch from "react-switch";
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2'
ChartJS.register(...registerables);

const Consumer = (props) => {
    const state = useSelector((state) => state)
    const dispatch = useDispatch()
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

    const toggleAuth = (type) => {
        setLoading(true)
        dispatch(toggleTransactionAuth(type))
        setLoading(false)
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
                                className='text-white drop-shadow-xl max-w-xs bg-gradient-to-r from-orange-700 to-orange-400 p-4 mx-2 py-5 px-5 rounded-xl'
                                style={{width: "320px"}}>
                                <div className="flex justify-between">
                                    <div>
                                        <h2 className={'text-sm lg:text-md'}> Main Balance </h2>
                                        <p className='text:xl lg:text-xl font-bold'>{formatter.format(state.consumer.transactions.length !== 0 && state.consumer.transactions.map(i => i.transaction_type === "IN" ? parseFloat(i.transaction_amount) : (-1 * parseFloat(i.transaction_amount))).reduce((a, b) => a + b, 0))}</p>
                                    </div>
                                    <div className="flex items-center">
                                    <span className="px-1">
                                        <ReactSwitch
                                            checked={state.auth.user.rfid_auth_enabled}
                                            activeBoxShadow={false}
                                            checkedIcon={false}
                                            uncheckedIcon={false}
                                            handleDiameter={28}
                                            checkedHandleIcon={<IdentificationIcon
                                                className={'mx-auto pt-1 h-6 w-6 text-orange-500'}/>}
                                            uncheckedHandleIcon={<IdentificationIcon
                                                className={'mx-auto pt-1 h-6 w-6 text-orange-500'}/>}
                                            onChange={() => window.confirm(`This will turn ${state.auth.user.rfid_auth_enabled ? "off" : "on"} RFID authentication for transactions on this account, Are you sure?`) && toggleAuth('rfid')}/>
                                    </span>
                                        <span className="px-1">
                                            <ReactSwitch
                                                checked={state.auth.user.biometrics_enabled}
                                                activeBoxShadow={false}
                                                checkedIcon={false}
                                                uncheckedIcon={false}
                                                handleDiameter={28}
                                                checkedHandleIcon={<FingerPrintIcon
                                                    className={'mx-auto pt-1 h-6 w-6 text-orange-500'}/>}
                                                uncheckedHandleIcon={<FingerPrintIcon
                                                    className={'mx-auto pt-1 h-6 w-6 text-orange-500'}/>}
                                                onChange={() => window.confirm(`This will turn ${state.auth.user.rfid_auth_enabled ? "off" : "on"} biometrics authentication for transactions on this account, Are you sure?`) && toggleAuth('fingerprint')}/>
                                    </span>
                                    </div>
                                </div>
                                <div className='flex justify-between mt-5 w-48 w-full'>
                                    <div className={'w-full'}>
                                        <h3 className="text-xs"> Card Holder </h3>
                                        <div
                                            className="flex flex-row justify-between text-sm lg:text-base items-center w-full">
                                            <p className={'font-bold'}>
                                                <span className="uppercase pr-2">{state.auth.user.last_name},</span>
                                                <span className="capitalize">{state.auth.user.first_name}</span>
                                            </p>

                                            <CogIcon onClick={() => props.openModal({}, 1)}
                                                     className={'h-6 w-6 lg:h-8 lg:w-8 cursor-pointer'}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className='text-white drop-shadow-xl max-w-xs border border-orange-400 mx-2 px-5 rounded-xl cursor-pointer'>
                                <div className="flex justify-between h-full items-center my-auto"
                                     onClick={() => props.openModal({}, 2)}>
                                    <PlusCircleIcon className={'h-20 w-20 text-orange-400'}/>
                                </div>
                            </div>
                        </div>

                        <div className="my-8 hidden md:block w-full overflow-x-scroll">
                            <Chart
                                type={'line'}
                                data={{
                                    labels: state.consumer.transactions.length !== 0 && state.consumer.transactions.map(i => moment.utc(i.created_at).format('MMM Do YY, H:mm')).reverse(),
                                    datasets: [{
                                        label: 'Expenses Report',
                                        backgroundColor: 'rgb(213,92,42)',
                                        borderColor: 'rgb(213,92,42)',
                                        data: state.consumer.transactions.length !== 0 && getDataSets(state.consumer.transactions.map(i => i.transaction_type === "IN" ? parseFloat(i.transaction_amount) : (-1 * parseFloat(i.transaction_amount))).reverse())
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
                                    <div key={k} onClick={() => props.openModal(i, 0)}
                                         className="bg-white p-3 rounded-xl shadow-xl flex items-center justify-between mt-4">
                                        <div className="flex space-x-6 items-center">
                                            {
                                                i.auth_type === "BIOMETRICS" ?
                                                    <FingerPrintIcon className={'h-8 w-8'}/>
                                                    : i.auth_type === "RFID" ?
                                                        <IdentificationIcon className={'h-8 w-8'}/>
                                                        :
                                                        <SupportIcon className={'h-8 w-8'}/>
                                            }
                                            <div>
                                                <p className="font-semibold text-base">{i.transaction_title}</p>
                                                <p className="font-semibold text-xs text-gray-400">{i.transaction_desc}</p>
                                                <p className="font-semibold text-xs text-gray-400">{moment.utc(i.created_at).format('MMM Do YY, H:mm')}</p>
                                            </div>
                                        </div>

                                        <div className="flex space-x-2 items-center">
                                            <div
                                                className={i.transaction_type === "IN" ? 'bg-green-200 rounded-md p-2 flex items-center' : 'bg-red-200 rounded-md p-2 flex items-center'}>
                                                <p className={i.transaction_type === "IN" ? 'text-green-600 font-semibold text-xs' : 'text-red-600 font-semibold text-xs'}>₦{i.transaction_amount}</p>
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

export default Consumer;