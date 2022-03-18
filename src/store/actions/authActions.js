import axios from "axios";
import {toast} from "react-toastify";
import axiosInstance from "../axiosInstance";

export const createSingleUser = (formData) => {
    return (dispatch) => {
        axios
            .post(`${process.env.REACT_APP_API_URL}v1/user/create_user/`, formData)
            .then(resp => {
                dispatch({
                    type: "CREATE_SINGLE_USER",
                    response: resp.data
                })
            })
            .catch(error => console.log(error.response))
    }
}

export const login = (formData) => {
    return (dispatch) => {
        axios
            .post(`${process.env.REACT_APP_API_URL}token/`, formData)
            .then(resp => {
                dispatch({
                    type: "SIGN_IN",
                    token: resp.data
                })
            })
            .catch(error => {
                console.log(error.response.data.detail)
                toast.error((error.response?.data.detail), {
                    position: toast.POSITION.TOP_RIGHT
                })
            })
    }
}

export const loadUser = () => {
    return (dispatch, getState) => {
        const token = getState().auth.refresh

        if (token) {
            dispatch({
                type: "USER_LOADED",
                token: token
            })
        }
    }
}

export const signOut = () => {
    return (dispatch, getState) => {
        const token = getState().auth.refresh

        if (token) {
            dispatch({
                type: "SIGN_OUT",
                token: token,
                sign_out_config: 0
            })
        }
    }
}

export const sessionExpired = () => {
    return (dispatch, getState) => {
        const token = getState().auth.refresh

        if (token) {
            dispatch({
                type: "SIGN_OUT",
                token: token,
                sign_out_config: 1
            })
        }
    }
}

export const renewAccess = (access) => {
    return (dispatch, getState) => {
        console.log(access)
        dispatch({
            type: "RENEW_ACCESS",
            access: access
        })
    }
}

export const toggleTransactionAuth = (data) => {
    return (dispatch) => {
        axiosInstance.patch('/v1/user/consumer_account_management/update_enabled_auth/', {type: data})
            .then(resp => {
                dispatch({
                    type: "UPDATE_AUTH_PERMISSIONS",
                    auth_permissions: resp.data
                })
            })
    }
}