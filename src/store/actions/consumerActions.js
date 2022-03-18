import {toast} from "react-toastify";
import axiosInstance from "../axiosInstance"

export const refreshTransactions = () => {
    return (dispatch) => {
        axiosInstance.get('/v1/pos/consumer_transaction_management/')
            .then(resp => {
                dispatch({
                    type: "REFRESH_TRANSACTIONS",
                    user_type: "consumer",
                    transactions: resp.data
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
