import {toast} from "react-toastify";
import axiosInstance from "../axiosInstance"

export const refreshConsumerTransactions = (prevState) => {
    return (dispatch) => {
        axiosInstance.get('/v1/pos/consumer_transaction_management/')
            .then(resp => {
                if (prevState !== resp.data) {
                    dispatch({
                        type: "REFRESH_TRANSACTIONS",
                        user_type: "consumer",
                        transactions: resp.data
                    })
                }
            })
            .catch(error => {
                // console.log(error.response?.data.detail)
                toast.error((error.response?.data.detail), {
                    position: toast.POSITION.TOP_RIGHT
                })
            })
    }
}

export const refreshVendorTransactions = (prevState) => {
    return (dispatch) => {
        axiosInstance.get('/v1/pos/vendor_transaction_management/')
            .then(resp => {
                if (prevState !== resp.data) {
                    console.log(prevState)
                    console.log(resp.data)
                    dispatch({
                        type: "REFRESH_TRANSACTIONS",
                        user_type: "vendor",
                        transactions: resp.data
                    })
                }
            })
            .catch(error => {
                // console.log(error.response?.data.detail)
                toast.error((error.response?.data.detail), {
                    position: toast.POSITION.TOP_RIGHT
                })
            })
    }
}

export const reverseTransactionFromVendor = (id, desc) => {
    return (dispatch) => {
        axiosInstance.post('/v1/pos/vendor_transaction_management/reverse_transaction_from_vendor/', {
            transaction_id: id,
            desc: desc
        })
            .then(resp => {
                toast.success(resp.data.message, {
                    position: toast.POSITION.TOP_RIGHT
                })
                dispatch({
                    type: "REFRESH_TRANSACTIONS",
                    user_type: "vendor",
                    transactions: resp.data.transactions
                })
            })
            .catch(error => {
                // console.log(error.response?.data.detail)
                toast.error((error.response?.data.detail), {
                    position: toast.POSITION.TOP_RIGHT
                })
            })
    }
}

export const refreshPOSHandover = (prevState) => {
    return (dispatch) => {
        axiosInstance.get('/v1/pos/pos_handover_request_management/')
            .then(resp => {
                if (resp.data !== prevState) {
                    dispatch({
                        type: "REFRESH_HANDOVER",
                        handover: resp.data
                    })
                }
            })
            .catch(error => {
                // console.log(error.response?.data.detail)
                toast.error((error.response?.data.detail), {
                    position: toast.POSITION.TOP_RIGHT
                })
            })
    }
}


export const requestPOSHandover = (data) => {
    return (dispatch) => {
        axiosInstance.post('/v1/pos/pos_handover_request_management/', data)
            .then(resp => {
                toast.success(resp.data.message, {
                    position: toast.POSITION.TOP_RIGHT
                })
                dispatch({
                    type: "REFRESH_HANDOVER",
                    handover: resp.data.handover
                })
            })
            .catch(error => {
                // console.log(error.response?.data.detail)
                toast.error((error.response?.data.detail), {
                    position: toast.POSITION.TOP_RIGHT
                })
            })
    }
}

export const fetchMessages = (prevState) => {
    return (dispatch) => {
        axiosInstance.get('/v1/communication/messages_api/')
            .then(resp => {
                // console.log(resp.data.map(i => i.read_at === null))
                if (prevState !== resp.data) {
                    dispatch({
                        type: "REFRESH_MESSAGES",
                        messages: resp.data.messages
                    })
                }
            })
            .catch(error => {
                // console.log(error.response?.data.detail)
                toast.error((error.response?.data.detail), {
                    position: toast.POSITION.TOP_RIGHT
                })
            })
    }
}

export const readMessages = (data) => {
    return (dispatch) => {
        axiosInstance.post('/v1/communication/messages_api/read_messages/', data)
            .then(resp => {
                // console.log(resp.data.map(i => i.read_at === null))
                dispatch({
                    type: "REFRESH_MESSAGES",
                    messages: resp.data.messages
                })
            })
            .catch(error => {
                // console.log(error.response?.data.detail)
                toast.error((error.response?.data.detail), {
                    position: toast.POSITION.TOP_RIGHT
                })
            })
    }
}