import React, {Fragment, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import {refreshTransactions} from "../store/actions/consumerActions";
import {Dialog, Transition} from "@headlessui/react";
import {
    FingerPrintIcon,
    IdentificationIcon,
    ShieldExclamationIcon,
    SupportIcon,
    UserIcon
} from "@heroicons/react/outline";
import moment from "moment";
import Staff from "./staff/staff";
import Admin from "./admin/admin";
import Vendor from "./vendor/vendor";
import Consumer from "./consumer/consumer";

const Dashboard = () => {
    const dispatch = useDispatch()
    const state = useSelector((state) => state)
    const auth = useSelector((state) => state.auth)
    const [open, setOpen] = useState(false)
    const [modalData, setModalData] = useState({})
    const [modalType, setModalType] = useState(0)
    const cancelButtonRef = useRef(null)

    useEffect(() => {
        dispatch(refreshTransactions())
    }, [dispatch])

    if (!auth.logged_in) {
        return <Navigate to={"/login"}/>;
    }

    const openModal = (data, type) => {
        setModalData(data)
        setModalType(type)
        setOpen(true)
    }

    const viewConsumerTrasaction = <></>

    return (
        <>
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef}
                        onClose={setOpen}>
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
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"
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

                            {modalType === 0 ?
                                <div
                                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                    <div
                                        className="bg-white p-3 rounded-xl shadow-xl flex items-center justify-between mt-4">
                                        <div className="flex flex-col">
                                            <div className="flex flex-row items-center">
                                                {modalType}
                                                <h3 className="text-2xl font-semibold">Authentication Type: </h3>
                                                <span className={'pl-4'}>
                                                {
                                                    modalData.auth_type === "BIOMETRICS" ?
                                                        <FingerPrintIcon className={'h-8 w-8'}/>
                                                        : modalData.auth_type === "RFID" ?
                                                        <IdentificationIcon className={'h-8 w-8'}/>
                                                        :
                                                        <SupportIcon className={'h-8 w-8'}/>
                                                }
                                            </span>
                                                <span className={'pl-2 text-xl'}>
                                                {
                                                    modalData.auth_type === "BIOMETRICS" ?
                                                        'Fingerprint'
                                                        : modalData.auth_type === "RFID" ?
                                                        'ID Card'
                                                        :
                                                        'System'
                                                }
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
                                :
                                <div
                                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl md:max-w-3xl sm:w-full">
                                    <div className="flex items-start">
                                        <ul className="nav nav-tabs flex flex-col flex-wrap list-none border-b-0 pl-0 mr-4 bg-orange-600 text-white">
                                            <li className="nav-item flex-grow text-center" role="presentation">
                                                <a href="#tabs-homeVertical" className="nav-link block font-medium text-xs leading-tight uppercase border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-2 hover:border-transparent hover:bg-gray-100 focus:border-transparent active">Home</a>
                                            </li>
                                            <li className="nav-item flex-grow text-center" role="presentation">
                                                <a href="#tabs-profileVertical" className="nav-link block font-medium text-xs leading-tight uppercase border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-2 hover:border-transparent hover:bg-gray-100 focus:border-transparent">Profile</a>
                                            </li>
                                        </ul>
                                        <div className="tab-content" id="tabs-tabContentVertical">
                                            <div className="tab-pane fade show active" id="tabs-homeVertical"
                                                 role="tabpanel"
                                                 aria-labelledby="tabs-home-tabVertical">
                                                Tab 1 content vertical
                                            </div>
                                            <div className="tab-pane fade" id="tabs-profileVertical" role="tabpanel"
                                                 aria-labelledby="tabs-profile-tabVertical">
                                                Tab 2 content vertical
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }

                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {
                auth.is_staff ? <Staff/> :
                auth.is_admin ? <Admin/> :
                // auth.user.is_vendor ? <Vendor /> :
                <Consumer openModal={openModal} />
            }
        </>
    )
}

export default Dashboard