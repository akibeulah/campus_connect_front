import React, {Fragment, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
// import got from 'got';
import {
    fetchMessages,
    readMessages,
    refreshConsumerTransactions,
    refreshPOSHandover,
    refreshVendorTransactions,
    requestPOSHandover,
    reverseTransactionFromVendor
} from "../store/actions/consumerActions";
import {Dialog, Transition} from "@headlessui/react";
import {
    CheckCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    FingerPrintIcon,
    IdentificationIcon,
    MinusCircleIcon,
    SupportIcon,
    UserCircleIcon,
    XCircleIcon,
    XIcon
} from "@heroicons/react/solid";
import moment from "moment";
import Staff from "./staff/staff";
import Admin from "./admin/admin";
import Consumer from "./consumer/consumer";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import ReactSwitch from "react-switch";
import Flutterwave from "flutterwave-node-v3";
import {resetPassword, toggleTransactionAuth} from "../store/actions/authActions";
import {toast} from "react-toastify";
import Vendor from "./vendor/vendor";
import {ExclamationCircleIcon, ReceiptRefundIcon, TrendingUpIcon} from "@heroicons/react/outline";
import axios from "axios";

const Dashboard = () => {
    const dispatch = useDispatch()
    const auth = useSelector((state) => state.auth)
    const state = useSelector((state) => state)
    const [open, setOpen] = useState(false)
    const [modalData, setModalData] = useState({})
    const [modalType, setModalType] = useState(0)
    const cancelButtonRef = useRef(null)
    const [finPayload, setFinPayload] = useState({
        "card_number": "",
        "cvv": "",
        "expiry_month": "",
        "expiry_year": "",
        "currency": "NGN",
        "amount": "",
        "redirect_url": process.env.REACT_APP_API_URL + "/dashboard",
        "fullname": auth.user.last_name + " " + auth.user.first_name,
        "email": auth.user.email,
        "tx_ref": ""
    })
    const [pwdPayload, setPwdPayload] = useState({
        "current_password": "",
        "new_password": "",
        "new_password_2": ""
    })
    const flw = new Flutterwave(process.env.REACT_APP_FLW_PLK, process.env.REACT_APP_FLW_SCK);
    const [securityPage, setSecurityPage] = useState(0)
    const [loading, setLoading] = useState(false)
    const [dailyLimit, setDailyLimit] = useState(0)
    const [revTransData, setRevTransData] = useState({
        data: null,
        desc: ""
    })
    const [paymentTerminalRequestData, setPaymentTerminalRequestData] = useState({
        request_desc: "",
        request_type: ""
    })
    const [openMessage, setOpenMessage] = useState(null)

    useEffect(() => {
        const id_1 = setInterval(() => refreshTransactions(), 5000)
        return () => clearTimeout(id_1)
    }, [])

    useEffect(() => {
        if (modalType === 16) {
            dispatch(readMessages({sender: openMessage}))
            scrollChatToBottom()
        }
        // if (modalType === 15) dispatch()
    }, [modalType])

    useEffect(() => {
        if (loading) {
            toast.info("Loading...")
            setLoading(false)
        }
    }, [loading])

    const updatePayloadData = (n, v) => {
        if (n === "card_number") {
            setFinPayload({
                ...finPayload, [n]: v.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ')
            })
        } else {
            setFinPayload({
                ...finPayload, [n]: v
            })
        }
    }

    const updatePwdPayload = (n, v) => {
        setPwdPayload({...pwdPayload, [n]: v})
    }

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'NGN'
    });

    const sendHandoverForm = () => {
        setLoading(true)
        dispatch(requestPOSHandover(paymentTerminalRequestData))
    }

    const refreshTransactions = () => {
        if (auth.user.is_vendor) {
            dispatch(refreshVendorTransactions(state.consumer.transactions))
            dispatch(refreshPOSHandover(state.consumer.handover))
            dispatch(fetchMessages(state.consumer.messages))
        } else dispatch(refreshConsumerTransactions(state.consumer.transactions))
    }

    const scrollChatToBottom = () => {
        let chat = document.querySelector("#headlessui-dialog-5 > div > div.inline-block.align-bottom.bg-white.transition-all.duration-500.rounded-sm.text-left.overflow-hidden.shadow-xl.transform.sm\\:my-8.sm\\:align-middle.w-full.sm\\:max-w-xl > div.w-full.bg-gray-100.py-4.px-2.overflow-y-scroll.overflow-x-hidden")
        if (chat !== null) {
            chat.scrollBy(0, 10000000)
        }
    }

    if (!auth.logged_in) {
        return <Navigate to={"/login"}/>;
    }

    const setDataDefaults = () => {
        setSecurityPage(0)
        setFinPayload({
            "card_number": "",
            "cvv": "",
            "expiry_month": "",
            "expiry_year": "",
            "currency": "NGN",
            "amount": "",
            "redirect_url": process.env.REACT_APP_API_URL + "/dashboard",
            "fullname": auth.user.last_name + " " + auth.user.first_name,
            "email": auth.user.email,
            "tx_ref": ""
        })
        setPwdPayload({
            "current_password": "",
            "new_password": "",
            "new_password_2": ""
        })
    }

    const openModal = (data, type) => {
        setModalData(data)
        setModalType(type)
        setOpen(true)
    }

    const toggleAuth = (type) => {
        setLoading(true)
        dispatch(toggleTransactionAuth(type))
    }

    const processFinTransaction = async () => {
        try {
            axios.post("https://api.flutterwave.com/v3/payments", {
                    tx_ref: new Date() + '_' + auth.user.first_name.toUpperCase() + '_' + auth.user.last_name.toUpperCase(),
                    amount: finPayload.amount,
                    currency: "NGN",
                    redirect_url: "https://webhook.site/9d0b00ba-9a69-44fa-a43d-a82c33c36fdc",
                    customer: {
                        "fullname": auth.user.last_name + " " + auth.user.first_name,
                        "email": auth.user.email
                    },
                    customizations: {
                        title: "Campus Connect"
                    }
                },
                {
                    Authorization: `Bearer ${process.env.REACT_APP_FLW_SCK}`,
                    "Access-Control-Allow-Origin": "*",

                })
                .then(resp => document.href = resp.data.link)
        } catch (err) {
            console.log(err.code);
            console.log(err.response.body);
        }

        // try {
        //     const response = await got.post("https://api.flutterwave.com/v3/payments/", {
        //         headers: {
        //             Authorization: `Bearer ${process.env.REACT_APP_FLW_SCK}`
        //         },
        //         json: {
        //             tx_ref: new Date() + '_' + auth.user.first_name.toUpperCase() + '_' + auth.user.last_name.toUpperCase(),
        //             amount: finPayload.amount,
        //             currency: "NGN",
        //             redirect_url: "https://back-cc.herokuapp.com/v_topup/confirmation",
        //             customer: {
        //                 "fullname": auth.user.last_name + " " + auth.user.first_name,
        //                 "email": auth.user.email
        //             },
        //             customizations: {
        //                 title: "Campus Connect"
        //             }
        //         }
        //     }).json();
        // } catch (err) {
        //     console.log(err.code);
        //     console.log(err.response.body);
        // }
    }

    const processChgPwdTransaction = () => {
        if (pwdPayload.new_password === pwdPayload.new_password_2) {
            setLoading(true)
            dispatch(resetPassword({
                pwd: pwdPayload.current_password,
                new_pwd: pwdPayload.new_password_2
            }))
            setDataDefaults()
        } else {
            toast.error("Passwords do not match!", {position: "top-right"})
            updatePwdPayload("new_password_2", "")
            updatePwdPayload("new_password", "")
        }
    }

    const processDailyLimit = () => {
        // console.log(dailyLimit) TODO: Complete daily limit function
    }

    const reverseTransaction = () => {
        setLoading(true)
        dispatch(reverseTransactionFromVendor(revTransData.data, revTransData.desc))
    }

    return (<>
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef}
                    onClose={() => {
                        setOpen(false)
                        // setModalType(0)
                        setDataDefaults()
                    }}>
                <div
                    className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle transition-all duration-500 sm:h-screen"
                          aria-hidden="true">&#8203;</span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >

                        {modalType === 0 ? // Customer Payment Receipt Card
                            <div
                                className="inline-block align-bottom bg-white transition-all duration-500 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div
                                    className="bg-white p-3 rounded-xl shadow-xl flex items-center justify-between mt-4">
                                    <div className="flex flex-col">
                                        <div className="flex flex-row justify-between items-center">
                                            <h3 className="text-xl font-semibold">Authentication Type: </h3>
                                            <span className={'pl-4'}>
                                                {modalData.auth_type === "BIOMETRICS" ? <FingerPrintIcon
                                                    className={'h-8 w-8'}/> : modalData.auth_type === "RFID" ?
                                                    <IdentificationIcon className={'h-8 w-8'}/> :
                                                    <SupportIcon className={'h-8 w-8'}/>}
                                            </span>
                                            <span className={'pl-2 text-xl'}>
                                                {modalData.auth_type === "BIOMETRICS" ? 'Fingerprint' : modalData.auth_type === "RFID" ? 'ID Card' : 'System'}
                                            </span>
                                        </div>
                                        <div className={'pt-8'}>
                                            <p className="font-semibold text-2xl">{modalData.transaction_title}</p>
                                            <p className="font-semibold text-xs text-gray-400">{moment.utc(modalData.created_at).format('MMM Do YY, H:mm')}</p>
                                            <p className="font-semibold text-lg text-gray-800 pt-4">{modalData.transaction_desc}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div
                                            className={modalData.transaction_type === "IN" ? 'bg-green-200 rounded-md p-2 flex flex-row items-center' : 'bg-red-200 rounded-md p-2 flex flex-row items-center'}>
                                                <span
                                                    className={modalData.transaction_type === "IN" ? 'text-green-600 font-semibold pl-2' : 'pl-2 text-red-600 font-semibold'}>{modalData.transaction_type === "IN" ? 'Credit' : 'Debit'}</span>
                                            <span
                                                className={modalData.transaction_type === "IN" ? 'text-green-600 font-semibold pl-2' : 'pl-2 text-red-600 font-semibold'}> ₦{modalData.transaction_amount}</span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            : modalType === 1 ? // Customer Settings
                                <div
                                    className="inline-block align-bottom bg-white transition-all duration-500 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-3xl">
                                    <div className="w-full px-1 py-1 transition-all" style={{minHeight: '480px'}}>
                                        <Tabs
                                            disabledTabClassName=""
                                            selectedTabClassName="bg-white rounded-md text-orange-600"
                                        >
                                            <TabList
                                                className="flex flex-row w-full divide-gray-600 py-1 px-1 mb-1 rounded-md bg-gray-200">
                                                <Tab
                                                    className="text-center transition-all w-full mx-1 px-2 text-black cursor-pointer outline-0">Personal</Tab>
                                                <Tab
                                                    className="text-center transition-all w-full mx-1 px-2 text-black cursor-pointer outline-0">Security</Tab>
                                                <Tab
                                                    className="text-center transition-all w-full mx-1 px-2 text-black cursor-pointer outline-0">Behaviour</Tab>
                                            </TabList>

                                            <TabPanel>
                                                <div className="">
                                                    <div className="">
                                                        <UserCircleIcon
                                                            className="mx-auto text-orange-500 w-32 h-32 pt-2 pb-4"/>
                                                    </div>

                                                    <span className="flex flex-row py-4 pb-2 border-b">
                                                        <h6 className="inset-y-0 left-0 font-normal text-gray-500 py-1 w-full pl-2 text-sm">First Name</h6>
                                                        <h6
                                                            className="appearance-none w-full py-1 px-3 text-right text-orange-600 leading-tight  focus:outline-orange-400 transition-all ease-in-out duration-500">
                                                            {auth.user.first_name}
                                                        </h6>
                                                    </span>
                                                    <span className="flex flex-row py-4 pb-2 border-b">
                                                        <h6 className="inset-y-0 left-0 font-normal text-gray-500 py-1 w-full pl-2 text-sm">Last Name</h6>
                                                        <h6
                                                            className="appearance-none w-full py-1 px-3 text-right text-orange-600 leading-tight  focus:outline-orange-400 transition-all ease-in-out duration-500">
                                                            {auth.user.last_name}
                                                        </h6>
                                                    </span>
                                                    <span className="flex flex-row py-4 pb-2 border-b">
                                                        <h6 className="inset-y-0 left-0 font-normal text-gray-500 py-1 w-full pl-2 text-sm">Account Type</h6>
                                                        <h6
                                                            className="appearance-none w-full py-1 px-3 text-right text-orange-600 leading-tight  focus:outline-orange-400 transition-all ease-in-out duration-500">
                                                            {auth.user.is_staff ? "Staff" : auth.user.is_admin ? "Admin" : auth.user.is_vendor ? "Vendor" : "Student"}
                                                        </h6>
                                                    </span>
                                                </div>
                                            </TabPanel>
                                            <TabPanel>
                                                {securityPage === 0 ?
                                                    <div className="">
                                                        <div className="mb-4">
                                                            <div className="flex flex-row pt-4 pb-2 border-b">
                                                                <h6 className="inset-y-0 left-0 font-normal text-gray-500 pb-1 w-full pl-2 text-sm text-center">VERIFIED
                                                                    INFORMATION</h6>
                                                            </div>

                                                            <span className="flex flex-row py-4 pb-2 border-b">
                                                        <h6 className="inset-y-0 left-0 font-normal text-gray-500 py-1 pl-2 text-sm">ID</h6>
                                                        <h6
                                                            className="appearance-none w-full py-1 px-3 text-right text-orange-600 leading-tight  focus:outline-orange-400 transition-all ease-in-out duration-500">
                                                            {auth.user.user_id}
                                                        </h6>
                                                    </span>

                                                            <span className="flex flex-row py-4 pb-2 border-b">
                                                        <h6 className="inset-y-0 left-0 font-normal text-gray-500 py-1 w-full pl-2 text-sm">Email</h6>
                                                        <h6
                                                            className="appearance-none w-full py-1 px-3 text-right text-orange-600 leading-tight  focus:outline-orange-400 transition-all ease-in-out duration-500">
                                                            {auth.user.email}
                                                        </h6>
                                                    </span>

                                                            <span className="flex flex-row py-4 pb-2 border-b">
                                                        <h6 className="inset-y-0 left-0 font-normal text-gray-500 py-1 pl-2 text-sm">Institution</h6>
                                                        <h6
                                                            className="appearance-none w-full py-1 px-3 text-right text-orange-600 leading-tight  focus:outline-orange-400 transition-all ease-in-out duration-500">
                                                            {/*TODO: build institutions into API*/} Covenant University
                                                        </h6>
                                                    </span>
                                                        </div>

                                                        <div className="mb-4">
                                                            <div className="flex flex-row pt-4 pb-2 border-b">
                                                                <h6 className="inset-y-0 left-0 font-normal text-gray-500 py-1 w-full pl-2 text-sm text-center">PASSWORD
                                                                    & PIN</h6>
                                                            </div>

                                                            <span onClick={() => setSecurityPage(1)}
                                                                  className="flex flex-row pt-4 pb-1 border-b cursor-pointer hover:underline">
                                                            <h6 className="inset-y-0 left-0 font-normal text-gray-500 py-1 pl-2 w-full text-sm">Change Password</h6>
                                                            <h6
                                                                className="appearance-none px-3 ml-auto text-orange-600">
                                                                <ChevronRightIcon className={"w-6 h-6"}/>
                                                            </h6>
                                                        </span>

                                                            <span onClick={() => setSecurityPage(2)}
                                                                  className="flex flex-row pt-4 pb-1 border-b cursor-pointer hover:underline">
                                                        <h6 className="inset-y-0 left-0 font-normal text-gray-500 py-1 pl-2 w-full text-sm">Account Pin Settings</h6>
                                                        <h6
                                                            className="appearance-none px-3 ml-auto text-orange-600">
                                                            <ChevronRightIcon className={"w-6 h-6"}/>
                                                        </h6>
                                                    </span>
                                                        </div>
                                                    </div>
                                                    : securityPage === 1 ?
                                                        <div className="">
                                                            <div
                                                                className="text-sm hover:underline cursor-pointer text-gray-500 flex flex-row items-center pl-2"
                                                                onClick={() => setSecurityPage(0)}>
                                                                <ChevronLeftIcon className='h-3 w-4'/> back
                                                            </div>
                                                            <div className="mb-4">
                                                                <div className="flex flex-row pt-4 pb-2 border-b">
                                                                    <h6 className="inset-y-0 left-0 font-normal text-gray-500 pb-1 w-full pl-2 text-sm text-center">CURRENT
                                                                        PASSWORD</h6>
                                                                </div>

                                                                <div className="relative">
                                                                    <label htmlFor="cur_pwd"
                                                                           className="absolute top-0 font-normal text-black pl-3 pt-2 text-sm">Current
                                                                        Password</label>
                                                                    <input
                                                                        className="appearance-none border-b-2 w-full pt-8 pb-2 text-right rounded-t-sm px-3 text-gray-700 leading-tight outline-none focus:border-orange-400 transition-all ease-in-out duration-500"
                                                                        id="cur_pwd" name="current_password"
                                                                        value={pwdPayload.current_password}
                                                                        onChange={(e) => updatePwdPayload(e.target.name, e.target.value)}
                                                                        type="password" placeholder="********"/>
                                                                </div>
                                                            </div>

                                                            <div className="mb-4">
                                                                <div className="flex flex-row pt-4 pb-2 border-b">
                                                                    <h6 className="inset-y-0 left-0 font-normal text-gray-500 py-1 w-full pl-2 text-sm text-center">NEW
                                                                        PASSWORD</h6>
                                                                </div>

                                                                <div className="relative">
                                                                    <label htmlFor="new_pwd"
                                                                           className="absolute top-0 font-normal text-black pl-3 pt-2 text-sm">New
                                                                        Password</label>
                                                                    <input
                                                                        className="appearance-none border-b-2 w-full pt-8 pb-2 text-right rounded-t-sm px-3 text-gray-700 leading-tight outline-none focus:border-orange-400 transition-all ease-in-out duration-500"
                                                                        id="new_pwd" name="new_password"
                                                                        value={pwdPayload.new_password}
                                                                        onChange={(e) => updatePwdPayload(e.target.name, e.target.value)}
                                                                        type="password" placeholder="********"/>
                                                                </div>

                                                                <div className="relative">
                                                                    <label htmlFor="new_pwd_2"
                                                                           className="absolute top-0 font-normal text-black pl-3 pt-2 text-sm">Confirm
                                                                        Password</label>
                                                                    <input
                                                                        className="appearance-none border-b-2 w-full pt-8 pb-2 text-right rounded-t-sm px-3 text-gray-700 leading-tight outline-none focus:border-orange-400 transition-all ease-in-out duration-500"
                                                                        id="new_pwd_2" name="new_password_2"
                                                                        value={pwdPayload.new_password_2}
                                                                        onChange={(e) => updatePwdPayload(e.target.name, e.target.value)}
                                                                        type="password" placeholder="********"/>
                                                                </div>
                                                            </div>

                                                            <div className="relative pt-8 pb-4">
                                                                <button onClick={processChgPwdTransaction}
                                                                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-b-sm w-full text-sm">
                                                                    Process Change
                                                                </button>
                                                            </div>
                                                        </div>
                                                        : securityPage === 2 ?
                                                            <div className="">
                                                                <div
                                                                    className="text-sm hover:underline cursor-pointer text-gray-500 flex flex-row items-center pl-2"
                                                                    onClick={() => setSecurityPage(0)}>
                                                                    <ChevronLeftIcon className='h-3 w-4'/> back
                                                                </div>
                                                                <div className="mb-4">
                                                                    <div className="flex flex-row pt-4 pb-2 border-b">
                                                                        <h6 className="inset-y-0 left-0 font-normal text-gray-500 pb-1 w-full pl-2 text-sm text-center">CURRENT
                                                                            PIN</h6>
                                                                    </div>

                                                                    <div className="relative">
                                                                        <label htmlFor="cur_pin"
                                                                               className="absolute top-0 font-normal text-black pl-3 pt-2 text-sm">Current
                                                                            Pin</label>
                                                                        <input
                                                                            className="appearance-none border-b-2 w-full pt-8 pb-2 text-right rounded-t-sm px-3 text-gray-700 leading-tight outline-none focus:border-orange-400 transition-all ease-in-out duration-500"
                                                                            id="cur_pin" name="current_password"
                                                                            value={pwdPayload.current_password}
                                                                            onChange={(e) => updatePwdPayload(e.target.name, e.target.value)}
                                                                            type="password" placeholder="******"/>
                                                                    </div>
                                                                </div>

                                                                <div className="mb-4">
                                                                    <div className="flex flex-row pt-4 pb-2 border-b">
                                                                        <h6 className="inset-y-0 left-0 font-normal text-gray-500 py-1 w-full pl-2 text-sm text-center">NEW
                                                                            PIN</h6>
                                                                    </div>

                                                                    <div className="relative">
                                                                        <label htmlFor="new_pin"
                                                                               className="absolute top-0 font-normal text-black pl-3 pt-2 text-sm">New
                                                                            Pin</label>
                                                                        <input
                                                                            className="appearance-none border-b-2 w-full pt-8 pb-2 text-right rounded-t-sm px-3 text-gray-700 leading-tight outline-none focus:border-orange-400 transition-all ease-in-out duration-500"
                                                                            id="new_pin" name="new_password"
                                                                            value={pwdPayload.new_password}
                                                                            onChange={(e) => updatePwdPayload(e.target.name, e.target.value)}
                                                                            type="password" placeholder="******"/>
                                                                    </div>

                                                                    <div className="relative">
                                                                        <label htmlFor="new_pwd_2"
                                                                               className="absolute top-0 font-normal text-black pl-3 pt-2 text-sm">Confirm
                                                                            Pin</label>
                                                                        <input
                                                                            className="appearance-none border-b-2 w-full pt-8 pb-2 text-right rounded-t-sm px-3 text-gray-700 leading-tight outline-none focus:border-orange-400 transition-all ease-in-out duration-500"
                                                                            id="new_pin_2" name="new_password_2"
                                                                            value={pwdPayload.new_password_2}
                                                                            onChange={(e) => updatePwdPayload(e.target.name, e.target.value)}
                                                                            type="password" placeholder="******"/>
                                                                    </div>
                                                                </div>

                                                                <div className="relative pt-8 pb-4">
                                                                    <button onClick={processChgPwdTransaction}
                                                                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-b-sm w-full text-sm">
                                                                        Process Change
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            : null
                                                }
                                            </TabPanel>
                                            <TabPanel>
                                                <div className="mb-4">
                                                    <div className="flex flex-row pt-4 pb-2 border-b">
                                                        <h6 className="inset-y-0 left-0 font-normal text-gray-500 pb-1 w-full pl-2 text-sm text-center">ACCOUNT
                                                            LIMITS</h6>
                                                    </div>

                                                    <div className="flex flex-row py-4 pb-2 border-b">
                                                        <h6 className="inset-y-0 left-0 font-normal w-full text-gray-500 py-1 pl-2 text-sm">Limit
                                                            Transactions</h6>
                                                        <h6
                                                            className="appearance-none w-full py-1 px-3 text-right text-orange-600 leading-tight  focus:outline-orange-400 transition-all ease-in-out duration-500">
                                                            <ReactSwitch checked={auth.user.limit_charges}
                                                                         onChange={() => toggleAuth('limit_charges')}
                                                                         activeBoxShadow='0 0 2px 3px #FB923C'
                                                            />
                                                        </h6>
                                                    </div>

                                                    <div className="relative">
                                                        <label htmlFor="new_pwd_2"
                                                               className="absolute top-0 font-normal text-gray-500 pl-2 pt-2 text-sm">Daily
                                                            Limit</label>
                                                        {auth.user.limit_charges ?
                                                            <input
                                                                disabled
                                                                className="appearance-none border-b-2 w-full pt-8 pb-2 text-right rounded-t-sm px-3 text-gray-700 leading-tight outline-none focus:border-orange-400 transition-all ease-in-out duration-500"
                                                                id="new_pin_2" name="new_password_2"
                                                                value={dailyLimit}
                                                                onChange={(e) => setDailyLimit(parseFloat(e.target.value))}
                                                                type="number"
                                                                placeholder={auth.user.daily_transaction_limit}/>
                                                            :
                                                            <input
                                                                className="appearance-none border-b-2 w-full pt-8 pb-2 text-right rounded-t-sm px-3 text-gray-700 leading-tight outline-none focus:border-orange-400 transition-all ease-in-out duration-500"
                                                                id="new_pin_2" name="new_password_2"
                                                                value={dailyLimit}
                                                                onChange={(e) => setDailyLimit(parseFloat(e.target.value))}
                                                                type="number"
                                                                placeholder={auth.user.daily_transaction_limit}/>
                                                        }
                                                    </div>

                                                    <div className="flex flex-row py-4 pb-2 border-b">
                                                        <h6 className="inset-y-0 left-0 font-normal text-gray-500 py-1 w-full pl-2 text-sm">POS</h6>
                                                        <h6
                                                            className="appearance-none w-full py-1 px-3 text-right text-orange-600 leading-tight  focus:outline-orange-400 transition-all ease-in-out duration-500">
                                                            <ReactSwitch checked={auth.user.pos_enabled}
                                                                         onChange={() => toggleAuth('pos_enabled')}
                                                                         activeBoxShadow='0 0 2px 3px #FB923C'
                                                            />
                                                        </h6>
                                                    </div>

                                                    <div className="flex flex-row py-4 pb-2 border-b">
                                                        <h6 className="inset-y-0 left-0 font-normal text-gray-500 py-1 pl-2 text-sm">ATM</h6>
                                                        <h6
                                                            className="appearance-none w-full py-1 px-3 text-right text-orange-600 leading-tight  focus:outline-orange-400 transition-all ease-in-out duration-500">
                                                            <ReactSwitch checked={auth.user.atm_enabled}
                                                                         onChange={() => toggleAuth('atm_enabled')}
                                                                         activeBoxShadow='0 0 2px 3px #FB923C'
                                                            />
                                                        </h6>
                                                    </div>

                                                    <div
                                                        className={dailyLimit < 1 || dailyLimit === NaN ? "relative pt-8 pb-4 opacity-0 transition-all duration-300" : "relative pt-8 pb-4 opacity-100 transition-all duration-300"}>
                                                        <button onClick={processDailyLimit}
                                                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-b-sm w-full text-sm">
                                                            Process Change
                                                        </button>
                                                    </div>
                                                </div>
                                            </TabPanel>
                                        </Tabs>
                                    </div>
                                </div>
                                : modalType === 2 ? // Flutterwave Modal
                                    <div
                                        className="inline-block align-bottom bg-white transition-all duration-500 rounded-sm text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full sm:max-w-2xl">
                                        <div className="flex flex-col divide-y py-6">
                                            <div className="flex flex-col px-6 py-4">
                                                <div className="flex flex-col sm:flex-row justify-between items-center">
                                                    <div className="flex items-center flex-shrink-0 mr-10">
                                                    <span
                                                        className="font-semibold pb-3 sm:py-0 text-2xl text-orange-600 tracking-tight">Campus Connect</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="flex flex-row items-center">
                                                        <span
                                                            className="pt-8 pb-2 pr-2 font-semibold text-xs">NGN</span>
                                                            <span className="relative">
                                                        <label htmlFor="amount"
                                                               className="absolute top-0 font-normal text-black pl-3 pt-2 text-sm">Amount</label>
                                                    <input
                                                        className="appearance-none border w-full pt-8 pb-2 px-3 text-gray-700 leading-tight outline-1 outline-transparent focus:outline-orange-400 transition-all ease-in-out duration-500"
                                                        id="amount" name="amount"
                                                        onChange={(e) => updatePayloadData(e.target.name, e.target.value)}
                                                        type="text" placeholder="0.00"/>
                                                </span>
                                                        </div>
                                                        <h5 className='text-center text-sm text-gray-500 pt-1'>{auth.user.email}</h5>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col pt-6">
                                                <span className="relative">
                                                    <label htmlFor="card_number"
                                                           className="absolute top-0 font-normal text-black pl-3 pt-2 text-sm">Card Number</label>
                                                    <input
                                                        className="appearance-none border w-full pt-8 pb-2 rounded-t-sm px-3 text-gray-700 leading-tight outline-1 outline-transparent focus:outline-orange-400 transition-all ease-in-out duration-500"
                                                        id="card_number" name="card_number"
                                                        value={finPayload.card_number.trim()}
                                                        onChange={(e) => updatePayloadData(e.target.name, e.target.value)}
                                                        type="text" placeholder="0000 0000 0000 0000"/>
                                                </span>
                                                    <span className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                                                    <span className="flex flex-row">
                                                        <span className="relative">
                                                            <label htmlFor="exp_mth"
                                                                   className="absolute top-0 font-normal text-black pl-3 pt-2 text-sm">Expiry Month</label>
                                                                <input
                                                                    className="show appearance-none border rounded-bl-sm w-full pt-8 pb-2 px-3 text-gray-700 leading-tight outline-1 outline-transparent focus:outline-orange-400 transition-all ease-in-out duration-500"
                                                                    id="exp_mth" name="expiry_month"
                                                                    value={finPayload.expiry_month}
                                                                    onChange={(e) => updatePayloadData(e.target.name, e.target.value)}
                                                                    type="text" placeholder="MM" maxLength={2}/>
                                                        </span>
                                                        <span className="px-1 pt-8 pb-2 text-gray-500">/</span>
                                                        <span className="relative">
                                                            <label htmlFor="exp_yr"
                                                                   className="absolute top-0 font-normal text-black pl-3 pt-2 text-sm">Expiry Year</label>
                                                                <input
                                                                    className="show appearance-none border w-full pt-8 pb-2 px-3 text-gray-700 leading-tight outline-1 outline-transparent focus:outline-orange-400 transition-all ease-in-out duration-500"
                                                                    id="exp_yr" name="expiry_year"
                                                                    value={finPayload.expiry_year}
                                                                    onChange={(e) => updatePayloadData(e.target.name, e.target.value)}
                                                                    type="text" placeholder="YY" maxLength={2}/>
                                                        </span>
                                                    </span>
                                                    <span className="relative">
                                                        <label htmlFor="cvv"
                                                               className="absolute top-0 font-normal text-black pl-3 pt-2 text-sm">CVV</label>
                                                        <input
                                                            className="appearance-none border rounded-br-sm w-full pt-8 pb-2 px-3 text-gray-700 leading-tight outline-1 outline-transparent focus:outline-orange-400 transition-all ease-in-out duration-500"
                                                            id="cvv" name="cvv"
                                                            onChange={(e) => updatePayloadData(e.target.name, e.target.value)}
                                                            type="text" placeholder="123" maxLength={4}/>
                                                    </span>
                                                </span>
                                                </div>

                                                <div className="pt-8">
                                                    <button onClick={processFinTransaction}
                                                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-5 px-4 rounded-b-sm w-full">
                                                        Pay {formatter.format(finPayload.amount)}
                                                    </button>
                                                </div>
                                            </div>

                                            <div
                                                className="font-normal text-gray-500 flex cursor-pointer flex-row justify-center items-center pt-4 focus:bg-transparent"
                                                onClick={() => setOpen(false)}>
                                                <span><XIcon className="w-5 h-5"/></span>
                                                <span className="">Cancel Payment</span>
                                            </div>
                                        </div>
                                    </div>
                                    : modalType === 10 ? // Vendor Payment Receipt Card
                                        <div
                                            className="inline-block align-bottom bg-white transition-all duration-500 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                            <div
                                                className="bg-white p-3 rounded-xl shadow-xl flex items-center justify-between mt-4">
                                                <div className="flex flex-col">
                                                    <div className="flex flex-row items-center">
                                                        <h3 className="text-2xl font-semibold">Transaction
                                                            Type: </h3>
                                                        <span className={'pl-4'}>
                                                {
                                                    modalData.transaction_type === "OUT" ?
                                                        <TrendingUpIcon className={'h-8 w-8'}/>
                                                        : modalData.transaction_type === "IN" ?
                                                            <ReceiptRefundIcon className={'h-8 w-8'}/> :
                                                            <ExclamationCircleIcon className={'h-8 w-8'}/>
                                                }
                                            </span>
                                                        <span className={'pl-2 text-xl'}>
                                                {modalData.transaction_type === "OUT" ? 'INFLOW' : modalData.transaction_type === "IN" ? 'OUTFLOW' : 'System'}
                                            </span>
                                                    </div>
                                                    <div className={'pt-8'}>
                                                        <p className="font-semibold text-2xl">{modalData.transaction_title}</p>
                                                        <p className="font-semibold text-xs text-gray-400">{moment.utc(modalData.created_at).format('MMM Do YY, H:mm')}</p>
                                                        <p className="font-semibold text-lg text-gray-800 pt-4">{modalData.transaction_desc}</p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className={modalData.transaction_type === "OUT" ? 'bg-green-200 rounded-md p-2 flex flex-row items-center' : 'bg-red-200 rounded-md p-2 flex flex-row items-center'}>
                                                <span
                                                    className={modalData.transaction_type === "OUT" ? 'text-green-600 font-semibold pl-2' : 'pl-2 text-red-600 font-semibold'}>{modalData.transaction_type === "OUT" ? 'INFLOW' : 'OUTFLOW'}</span>
                                                        <span
                                                            className={modalData.transaction_type === "OUT" ? 'text-green-600 font-semibold pl-2' : 'pl-2 text-red-600 font-semibold'}> ₦{modalData.transaction_amount}</span>
                                                    </div>

                                                    {
                                                        modalData.transaction_type === "OUT" &&
                                                        <button onClick={() => {
                                                            setModalType(13)
                                                            setRevTransData({data: modalData.id, desc: ""})
                                                        }}
                                                                className={"my-2 w-full border py-1 border-red-500 bg-red-200 text-red-500 hover:bg-red-500 hover:text-red-700 transition-all rounded-md focused:outline-none"}>
                                                            <ReceiptRefundIcon className={'h-6 w-6 mx-auto'}/>
                                                        </button>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        : modalType === 12 ? // Vendor Payment Terminal Support
                                            <div
                                                className="inline-block align-bottom bg-white transition-all duration-500 rounded-sm text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full sm:max-w-2xl">
                                                <div className="flex flex-col divide-y py-6">
                                                    <div className="flex flex-col px-6 py-4">
                                                        <div
                                                            className="flex flex-col sm:flex-row justify-between items-center">
                                                            <div
                                                                className="flex items-center flex-shrink-0 mr-10">
                                                                <h4
                                                                    className="font-semibold pb-3 sm:py-0 text-2xl text-orange-600 tracking-tight">
                                                                    Request for Payment Terminal
                                                                </h4>
                                                            </div>
                                                            <select name="request_type" id="request_type"
                                                                    className={'focus:outline-none px-4 py-2 bg-transparent border border-transparent focus:border-orange-400 duration-500 rounded-md transition-all'}
                                                                    onChange={(e) => setPaymentTerminalRequestData({
                                                                        ...paymentTerminalRequestData,
                                                                        ['request_type']: e.target.value
                                                                    })}>
                                                                <option value=""
                                                                        className={"capitalize py-2 px-4"}>Select an
                                                                    Option
                                                                </option>
                                                                <option value="OBTAIN"
                                                                        className={"capitalize py-2 px-4"}>OBTAIN
                                                                </option>
                                                                <option value="RETURN"
                                                                        className={"capitalize py-2 px-4"}>RETURN
                                                                </option>
                                                                <option value="MAINTAIN"
                                                                        className={"capitalize py-2 px-4"}>MAINTAIN
                                                                </option>
                                                            </select>
                                                        </div>

                                                        <div className="flex flex-col pt-6">
                                                            <div className="relative">
                                                                <label htmlFor="request_desc"
                                                                       className="absolute top-0 font-normal text-black pl-3 pt-2 text-sm">Description
                                                                    (Why do you need a terminal?)</label>
                                                                <input
                                                                    className="appearance-none border w-full pt-8 pb-2 rounded-t-sm px-3 text-gray-700 leading-tight outline-1 outline-transparent focus:outline-orange-400 transition-all ease-in-out duration-500"
                                                                    id="request_desc" name="request_desc"
                                                                    value={paymentTerminalRequestData.request_desc}
                                                                    onChange={(e) => setPaymentTerminalRequestData({
                                                                        ...paymentTerminalRequestData,
                                                                        ['request_desc']: e.target.value
                                                                    })}
                                                                    type="text"
                                                                    placeholder="Increased business traffic"/>
                                                            </div>
                                                            <button onClick={sendHandoverForm}
                                                                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-5 px-4 rounded-b-sm w-full">
                                                                Apply Now
                                                            </button>
                                                            <div className="mt-2">
                                                                <table
                                                                    className="table-auto w-full border-separate border border-slate-500 text-xs">
                                                                    <thead>
                                                                    <tr className={'capitalize text-center'}>
                                                                        <th className={'border border-slate-600 px-1 py-1'}>Created
                                                                            At
                                                                        </th>
                                                                        <th className={'border border-slate-600 px-1 py-1'}>type</th>
                                                                        <th className={'border border-slate-600 px-1 py-1'}>desc</th>
                                                                        <th className={'border border-slate-600 px-1 py-1'}>Status</th>
                                                                        <th className={'border border-slate-600 px-1 py-1'}>Collected
                                                                            At
                                                                        </th>
                                                                        <th className={'border border-slate-600 px-1 py-1'}>Returned
                                                                            At
                                                                        </th>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                    {
                                                                        state.consumer.handover === undefined ? null : state.consumer.handover.map((i, k) =>
                                                                            <tr key={k}>
                                                                                <td className={'border border-slate-700'}>{i.request_made_at}</td>
                                                                                <td className={'border border-slate-700'}>{i.request_type}</td>
                                                                                <td className={'border border-slate-700'}>{i.request_desc}</td>
                                                                                <td className={'border-slate-700'}>{i.request_approval === "APPROVED" ?
                                                                                    <CheckCircleIcon
                                                                                        className={'h-6 mx-auto w-6 text-green-500'}/> : i.request_approval === "REJECTED" ?
                                                                                        <XCircleIcon
                                                                                            className={'h-6 mx-auto w-6 text-red-500'}/> :
                                                                                        <MinusCircleIcon
                                                                                            className={'h-6 mx-auto w-6 text-gray-500'}/>
                                                                                }</td>
                                                                                <td className={'border border-slate-700'}>{i.collected_at}</td>
                                                                                <td className={'border border-slate-700'}>{i.returned_at}</td>
                                                                            </tr>
                                                                        )
                                                                    }
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>


                                                </div>
                                            </div>
                                            : modalType === 13 ? // Vendor Payment Receipt Card
                                                <div
                                                    className="inline-block align-bottom bg-white transition-all duration-500 rounded-sm text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full sm:max-w-2xl">
                                                    <div className="flex flex-col divide-y py-6">
                                                        <div className="flex flex-col px-6 py-4">
                                                            <div
                                                                className="flex flex-col sm:flex-row justify-between items-center">
                                                                <div className="flex items-center flex-shrink-0 mr-10">
                                                                    <h4
                                                                        className="font-semibold pb-3 sm:py-0 text-2xl text-orange-600 tracking-tight">Transaction
                                                                        Reversal Form
                                                                    </h4>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col pt-6">
                                                                <div className="relative">
                                                                    <label htmlFor="req_rev"
                                                                           className="absolute top-0 font-normal text-black pl-3 pt-2 text-sm">
                                                                        Reason for Reversal
                                                                    </label>
                                                                    <input
                                                                        className="appearance-none border w-full pt-8 pb-2 rounded-t-sm px-3 text-gray-700 leading-tight outline-1 outline-transparent focus:outline-orange-400 transition-all ease-in-out duration-500"
                                                                        id="req_rev" name="req_rev"
                                                                        value={revTransData.desc}
                                                                        onChange={(e) => setRevTransData({
                                                                            ...revTransData,
                                                                            ['desc']: e.target.value
                                                                        })}
                                                                        type="text"
                                                                        placeholder="Goods where returned in an acceptable state..."/>
                                                                </div>
                                                            </div>

                                                            <div className="">
                                                                <button onClick={reverseTransaction}
                                                                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-5 px-4 rounded-b-sm w-full">
                                                                    Process Reversal
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                : modalType === 11 ? // Vendor Settings
                                                    <div
                                                        className="inline-block align-bottom bg-white transition-all duration-500 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-3xl">
                                                        <div className="w-full px-1 py-1 transition-all"
                                                             style={{minHeight: '480px'}}>
                                                            <Tabs
                                                                disabledTabClassName=""
                                                                selectedTabClassName="bg-white rounded-md text-orange-600"
                                                            >
                                                                <TabList
                                                                    className="flex flex-row w-full divide-gray-600 py-1 px-1 mb-1 rounded-md bg-gray-200">
                                                                    <Tab
                                                                        className="text-center transition-all w-full mx-1 px-2 text-black cursor-pointer outline-0">Personal</Tab>
                                                                    <Tab
                                                                        className="text-center transition-all w-full mx-1 px-2 text-black cursor-pointer outline-0">Security</Tab>
                                                                </TabList>

                                                                <TabPanel>
                                                                    <div className="">
                                                                        <div className="">
                                                                            <UserCircleIcon
                                                                                className="mx-auto text-orange-500 w-32 h-32 pt-2 pb-4"/>
                                                                        </div>

                                                                        <span
                                                                            className="flex flex-row py-4 pb-2 border-b">
                                                        <h6 className="inset-y-0 left-0 font-normal text-gray-500 py-1 w-full pl-2 text-sm">First Name</h6>
                                                        <h6
                                                            className="appearance-none w-full py-1 px-3 text-right text-orange-600 leading-tight  focus:outline-orange-400 transition-all ease-in-out duration-500">
                                                            {auth.user.first_name}
                                                        </h6>
                                                    </span>
                                                                        <span
                                                                            className="flex flex-row py-4 pb-2 border-b">
                                                        <h6 className="inset-y-0 left-0 font-normal text-gray-500 py-1 w-full pl-2 text-sm">Last Name</h6>
                                                        <h6
                                                            className="appearance-none w-full py-1 px-3 text-right text-orange-600 leading-tight  focus:outline-orange-400 transition-all ease-in-out duration-500">
                                                            {auth.user.last_name}
                                                        </h6>
                                                    </span>
                                                                        <span
                                                                            className="flex flex-row py-4 pb-2 border-b">
                                                        <h6 className="inset-y-0 left-0 font-normal text-gray-500 py-1 w-full pl-2 text-sm">Account Type</h6>
                                                        <h6
                                                            className="appearance-none w-full py-1 px-3 text-right text-orange-600 leading-tight  focus:outline-orange-400 transition-all ease-in-out duration-500">
                                                            {auth.user.is_staff ? "Staff" : auth.user.is_admin ? "Admin" : auth.user.is_vendor ? "Vendor" : "Student"}
                                                        </h6>
                                                    </span>
                                                                    </div>
                                                                </TabPanel>
                                                                <TabPanel>
                                                                    {securityPage === 0 ?
                                                                        <div className="">
                                                                            <div className="mb-4">
                                                                                <div
                                                                                    className="flex flex-row pt-4 pb-2 border-b">
                                                                                    <h6 className="inset-y-0 left-0 font-normal text-gray-500 pb-1 w-full pl-2 text-sm text-center">VERIFIED
                                                                                        INFORMATION</h6>
                                                                                </div>

                                                                                <span
                                                                                    className="flex flex-row py-4 pb-2 border-b">
                                                        <h6 className="inset-y-0 left-0 font-normal text-gray-500 py-1 pl-2 text-sm">ID</h6>
                                                        <h6
                                                            className="appearance-none w-full py-1 px-3 text-right text-orange-600 leading-tight  focus:outline-orange-400 transition-all ease-in-out duration-500">
                                                            {auth.user.user_id}
                                                        </h6>
                                                    </span>

                                                                                <span
                                                                                    className="flex flex-row py-4 pb-2 border-b">
                                                        <h6 className="inset-y-0 left-0 font-normal text-gray-500 py-1 w-full pl-2 text-sm">Email</h6>
                                                        <h6
                                                            className="appearance-none w-full py-1 px-3 text-right text-orange-600 leading-tight  focus:outline-orange-400 transition-all ease-in-out duration-500">
                                                            {auth.user.email}
                                                        </h6>
                                                    </span>

                                                                                <span
                                                                                    className="flex flex-row py-4 pb-2 border-b">
                                                        <h6 className="inset-y-0 left-0 font-normal text-gray-500 py-1 pl-2 text-sm">Institution</h6>
                                                        <h6
                                                            className="appearance-none w-full py-1 px-3 text-right text-orange-600 leading-tight  focus:outline-orange-400 transition-all ease-in-out duration-500">
                                                            {/*TODO: build institutions into API*/} Covenant University
                                                        </h6>
                                                    </span>
                                                                            </div>

                                                                            <div className="mb-4">
                                                                                <div
                                                                                    className="flex flex-row pt-4 pb-2 border-b">
                                                                                    <h6 className="inset-y-0 left-0 font-normal text-gray-500 py-1 w-full pl-2 text-sm text-center">PASSWORD
                                                                                        & PIN</h6>
                                                                                </div>

                                                                                <span onClick={() => setSecurityPage(1)}
                                                                                      className="flex flex-row pt-4 pb-1 border-b cursor-pointer hover:underline">
                                                            <h6 className="inset-y-0 left-0 font-normal text-gray-500 py-1 pl-2 w-full text-sm">Change Password</h6>
                                                            <h6
                                                                className="appearance-none px-3 ml-auto text-orange-600">
                                                                <ChevronRightIcon className={"w-6 h-6"}/>
                                                            </h6>
                                                        </span>

                                                                                <span onClick={() => setSecurityPage(2)}
                                                                                      className="flex flex-row pt-4 pb-1 border-b cursor-pointer hover:underline">
                                                        <h6 className="inset-y-0 left-0 font-normal text-gray-500 py-1 pl-2 w-full text-sm">Account Pin Settings</h6>
                                                        <h6
                                                            className="appearance-none px-3 ml-auto text-orange-600">
                                                            <ChevronRightIcon className={"w-6 h-6"}/>
                                                        </h6>
                                                    </span>
                                                                            </div>
                                                                        </div>
                                                                        : securityPage === 1 ?
                                                                            <div className="">
                                                                                <div
                                                                                    className="text-sm hover:underline cursor-pointer text-gray-500 flex flex-row items-center pl-2"
                                                                                    onClick={() => setSecurityPage(0)}>
                                                                                    <ChevronLeftIcon
                                                                                        className='h-3 w-4'/> back
                                                                                </div>
                                                                                <div className="mb-4">
                                                                                    <div
                                                                                        className="flex flex-row pt-4 pb-2 border-b">
                                                                                        <h6 className="inset-y-0 left-0 font-normal text-gray-500 pb-1 w-full pl-2 text-sm text-center">CURRENT
                                                                                            PASSWORD</h6>
                                                                                    </div>

                                                                                    <div className="relative">
                                                                                        <label htmlFor="cur_pwd"
                                                                                               className="absolute top-0 font-normal text-black pl-3 pt-2 text-sm">Current
                                                                                            Password</label>
                                                                                        <input
                                                                                            className="appearance-none border-b-2 w-full pt-8 pb-2 text-right rounded-t-sm px-3 text-gray-700 leading-tight outline-none focus:border-orange-400 transition-all ease-in-out duration-500"
                                                                                            id="cur_pwd"
                                                                                            name="current_password"
                                                                                            value={pwdPayload.current_password}
                                                                                            onChange={(e) => updatePwdPayload(e.target.name, e.target.value)}
                                                                                            type="password"
                                                                                            placeholder="********"/>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="mb-4">
                                                                                    <div
                                                                                        className="flex flex-row pt-4 pb-2 border-b">
                                                                                        <h6 className="inset-y-0 left-0 font-normal text-gray-500 py-1 w-full pl-2 text-sm text-center">NEW
                                                                                            PASSWORD</h6>
                                                                                    </div>

                                                                                    <div className="relative">
                                                                                        <label htmlFor="new_pwd"
                                                                                               className="absolute top-0 font-normal text-black pl-3 pt-2 text-sm">New
                                                                                            Password</label>
                                                                                        <input
                                                                                            className="appearance-none border-b-2 w-full pt-8 pb-2 text-right rounded-t-sm px-3 text-gray-700 leading-tight outline-none focus:border-orange-400 transition-all ease-in-out duration-500"
                                                                                            id="new_pwd"
                                                                                            name="new_password"
                                                                                            value={pwdPayload.new_password}
                                                                                            onChange={(e) => updatePwdPayload(e.target.name, e.target.value)}
                                                                                            type="password"
                                                                                            placeholder="********"/>
                                                                                    </div>

                                                                                    <div className="relative">
                                                                                        <label htmlFor="new_pwd_2"
                                                                                               className="absolute top-0 font-normal text-black pl-3 pt-2 text-sm">Confirm
                                                                                            Password</label>
                                                                                        <input
                                                                                            className="appearance-none border-b-2 w-full pt-8 pb-2 text-right rounded-t-sm px-3 text-gray-700 leading-tight outline-none focus:border-orange-400 transition-all ease-in-out duration-500"
                                                                                            id="new_pwd_2"
                                                                                            name="new_password_2"
                                                                                            value={pwdPayload.new_password_2}
                                                                                            onChange={(e) => updatePwdPayload(e.target.name, e.target.value)}
                                                                                            type="password"
                                                                                            placeholder="********"/>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="relative pt-8 pb-4">
                                                                                    <button
                                                                                        onClick={processChgPwdTransaction}
                                                                                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-b-sm w-full text-sm">
                                                                                        Process Change
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                            : securityPage === 2 ?
                                                                                <div className="">
                                                                                    <div
                                                                                        className="text-sm hover:underline cursor-pointer text-gray-500 flex flex-row items-center pl-2"
                                                                                        onClick={() => setSecurityPage(0)}>
                                                                                        <ChevronLeftIcon
                                                                                            className='h-3 w-4'/> back
                                                                                    </div>
                                                                                    <div className="mb-4">
                                                                                        <div
                                                                                            className="flex flex-row pt-4 pb-2 border-b">
                                                                                            <h6 className="inset-y-0 left-0 font-normal text-gray-500 pb-1 w-full pl-2 text-sm text-center">CURRENT
                                                                                                PIN</h6>
                                                                                        </div>

                                                                                        <div className="relative">
                                                                                            <label htmlFor="cur_pin"
                                                                                                   className="absolute top-0 font-normal text-black pl-3 pt-2 text-sm">Current
                                                                                                Pin</label>
                                                                                            <input
                                                                                                className="appearance-none border-b-2 w-full pt-8 pb-2 text-right rounded-t-sm px-3 text-gray-700 leading-tight outline-none focus:border-orange-400 transition-all ease-in-out duration-500"
                                                                                                id="cur_pin"
                                                                                                name="current_password"
                                                                                                value={pwdPayload.current_password}
                                                                                                onChange={(e) => updatePwdPayload(e.target.name, e.target.value)}
                                                                                                type="password"
                                                                                                placeholder="******"/>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="mb-4">
                                                                                        <div
                                                                                            className="flex flex-row pt-4 pb-2 border-b">
                                                                                            <h6 className="inset-y-0 left-0 font-normal text-gray-500 py-1 w-full pl-2 text-sm text-center">NEW
                                                                                                PIN</h6>
                                                                                        </div>

                                                                                        <div className="relative">
                                                                                            <label htmlFor="new_pin"
                                                                                                   className="absolute top-0 font-normal text-black pl-3 pt-2 text-sm">New
                                                                                                Pin</label>
                                                                                            <input
                                                                                                className="appearance-none border-b-2 w-full pt-8 pb-2 text-right rounded-t-sm px-3 text-gray-700 leading-tight outline-none focus:border-orange-400 transition-all ease-in-out duration-500"
                                                                                                id="new_pin"
                                                                                                name="new_password"
                                                                                                value={pwdPayload.new_password}
                                                                                                onChange={(e) => updatePwdPayload(e.target.name, e.target.value)}
                                                                                                type="password"
                                                                                                placeholder="******"/>
                                                                                        </div>

                                                                                        <div className="relative">
                                                                                            <label htmlFor="new_pwd_2"
                                                                                                   className="absolute top-0 font-normal text-black pl-3 pt-2 text-sm">Confirm
                                                                                                Pin</label>
                                                                                            <input
                                                                                                className="appearance-none border-b-2 w-full pt-8 pb-2 text-right rounded-t-sm px-3 text-gray-700 leading-tight outline-none focus:border-orange-400 transition-all ease-in-out duration-500"
                                                                                                id="new_pin_2"
                                                                                                name="new_password_2"
                                                                                                value={pwdPayload.new_password_2}
                                                                                                onChange={(e) => updatePwdPayload(e.target.name, e.target.value)}
                                                                                                type="password"
                                                                                                placeholder="******"/>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="relative pt-8 pb-4">
                                                                                        <button
                                                                                            onClick={processChgPwdTransaction}
                                                                                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-b-sm w-full text-sm">
                                                                                            Process Change
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                                : null
                                                                    }
                                                                </TabPanel>
                                                            </Tabs>
                                                        </div>
                                                    </div>
                                                    : modalType === 15 ? // Messages List
                                                        <div
                                                            className="inline-block align-bottom bg-white transition-all duration-500 rounded-sm text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full sm:max-w-xl">
                                                            <div className="flex flex-col divide-y py-6 px-6">
                                                                <table className="table-auto border-separate px-4">
                                                                    <thead>
                                                                    <tr className={'text-orange-500 px-4 py-8'}>
                                                                        <th>Messages</th>
                                                                        <th></th>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody
                                                                        className={"overflow-y-scroll overflow-x-hidden bg-gray-100 py-3"}
                                                                        style={{height: "80vh"}}>
                                                                    {
                                                                        state.consumer.messages.filter((v, i, s) => s.map(item => item.sender.username).indexOf(v.sender.username) === i).map((i, k) =>
                                                                            <tr key={k} onClick={() => {
                                                                                setModalType(16)
                                                                                setOpenMessage(i.sender.username)
                                                                            }}>
                                                                                <td className={'w-full flex flex-row items-center justify-between cursor-pointer px-4 py-4 m-0 border-t border-b border-t-slate-500 border-b-slate-500'}>
                                                                                    <span className={'w-3/4'}>
                                                                                        <span
                                                                                            className="font-extrabold">{i.sender.username}</span>
                                                                                        <br/>
                                                                                       <span
                                                                                           className="text-xs md:text-md"> {i.message_content.slice(0, 20) + "..."}</span>
                                                                                    </span>
                                                                                    <span
                                                                                        className={'w-1/4 text-right'}>
                                                                                            <span
                                                                                                className={'text-right text-xs'}>{moment.utc(i.created_at).format('HH:mm, MMM D')}</span>
                                                                                            <br/>
                                                                                        {state.consumer.messages.filter(i => i.read_at === null).length < 1 ? null :
                                                                                            <span
                                                                                                className={'rounded-full text-xs md:text-md bg-orange-500 text-white font-extrabold py-2 px-3'}>
                                                                                                {state.consumer.messages.filter(i => i.sender.username && i.read_at === null).length}
                                                                                            </span>
                                                                                        }
                                                                                        </span>
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    }
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        : modalType === 16 ? // Messages Room
                                                            <div
                                                                className="inline-block align-bottom bg-white transition-all duration-500 rounded-sm text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full sm:max-w-xl">
                                                                <div
                                                                    className="flex flex-row items-center hover:underline cursor-pointer"
                                                                    onClick={() => setModalType(15)}>
                                                                    <span>
                                                                        <ChevronLeftIcon
                                                                            className={'w-8 h-8 text-gray-600'}/></span>
                                                                    <span className="pl-1">Back</span>
                                                                </div>

                                                                <div
                                                                    className="w-full bg-gray-100 py-4 px-2 overflow-y-scroll overflow-x-hidden"
                                                                    style={{height: "80vh"}}>
                                                                    {
                                                                        state.consumer.messages.filter(j => j.sender.username === openMessage).map((i, k) =>
                                                                            <div key={k}
                                                                                 className={'rounded-t-xl rounded-br-xl bg-white p-2 mt-4 w-full sm:w-4/5'}>
                                                                                <div className="">
                                                                                    <div
                                                                                        dangerouslySetInnerHTML={{__html: i.message_content}}></div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                            : modalType === 17 ? // UNK
                                                                <div
                                                                    className="inline-block align-bottom bg-white transition-all duration-500 rounded-sm text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full sm:max-w-xl">
                                                                    <div
                                                                        className="flex flex-row items-center hover:underline cursor-pointer"
                                                                        onClick={() => setModalType(15)}>
                                                                    <span>
                                                                        <ChevronLeftIcon
                                                                            className={'w-8 h-8 text-gray-600'}/></span>
                                                                        <span className="pl-1">Back</span>
                                                                    </div>

                                                                    <div
                                                                        className="w-full bg-gray-100 py-4 px-2 overflow-y-scroll overflow-x-hidden flex flex-col justify-end"
                                                                        style={{height: "80vh"}}>
                                                                        {
                                                                            state.consumer.messages.filter(j => j.sender.username === openMessage).map((i, k) =>
                                                                                <div key={k}
                                                                                     className={'rounded-t-xl rounded-br-xl bg-white p-2 mt-4 w-full sm:w-4/5'}>
                                                                                    <div className="">
                                                                                        <div
                                                                                            dangerouslySetInnerHTML={{__html: i.message_content}}></div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>
                                                                : null
                        }

                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>

        {
            auth.is_staff ? <Staff/>
                : auth.is_admin ? <Admin/>
                    : auth.user.is_vendor ? <Vendor refreshTransactions={refreshTransactions} openModal={openModal}/>
                        : <Consumer refreshTransactions={refreshTransactions} openModal={openModal}/>}
    </>)
}

export default Dashboard