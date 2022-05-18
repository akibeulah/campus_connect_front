import {toast} from "react-toastify";
import jwtDecode from "jwt-decode"

const initialState = {
    refresh: localStorage.getItem('refresh_token'),
    access: localStorage.getItem('access_token'),
    logged_in: false,
    user: {
        user_id: "",
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        is_staff: "",
        is_vendor: "",
        is_admin: "",
        biometric_auth: "",
        rfid_auth: "",
        biometrics_enabled: "",
        rfid_auth_enabled: "",
        consumer_transactions: [],
        vendor_transactions: [],
        limit_charges: "",
        daily_transaction_limit: "",
        pos_enabled: "",
        atm_enabled: ""
    }
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SIGN_IN":
            const user_sign_in = jwtDecode(action.token.refresh)

            toast.success(`Welcome ${user_sign_in.username.toUpperCase()}`, {
                position: toast.POSITION.TOP_RIGHT
            })


            localStorage.setItem('refresh_token', action.token.refresh)
            localStorage.setItem('access_token', action.token.access)

            return {
                ...initialState,
                refresh: action.token.refresh,
                access: action.token.access,
                logged_in: true,
                user: {
                    user_id: user_sign_in.user_id,
                    username: user_sign_in.username,
                    email: user_sign_in.email,
                    first_name: user_sign_in.first_name,
                    last_name: user_sign_in.last_name,
                    is_staff: user_sign_in.is_staff,
                    is_vendor: user_sign_in.is_vendor,
                    is_admin: user_sign_in.is_admin,
                    biometric_auth: user_sign_in.biometric_auth,
                    rfid_auth: user_sign_in.rfid_auth,
                    biometrics_enabled: user_sign_in.biometrics_enabled,
                    rfid_auth_enabled: user_sign_in.rfid_auth_enabled,
                    consumer_transactions: user_sign_in.consumer_transactions,
                    vendor_transactions: user_sign_in.vendor_transactions,
                    limit_charges: user_sign_in.limit_charges,
                    daily_transaction_limit: user_sign_in.daily_transaction_limit,
                    pos_enabled: user_sign_in.pos_enabled,
                    atm_enabled: user_sign_in.atm_enabled,
                }
            }
        case "USER_LOADED":
            const user_user_loaded = jwtDecode(action.token)

            return {
                ...initialState,
                logged_in: true,
                user: {
                    user_id: user_user_loaded.user_id,
                    username: user_user_loaded.username,
                    email: user_user_loaded.email,
                    first_name: user_user_loaded.first_name,
                    last_name: user_user_loaded.last_name,
                    is_staff: user_user_loaded.is_staff,
                    is_vendor: user_user_loaded.is_vendor,
                    is_admin: user_user_loaded.is_admin,
                    biometric_auth: user_user_loaded.biometric_auth,
                    rfid_auth: user_user_loaded.rfid_auth,
                    biometrics_enabled: user_user_loaded.biometrics_enabled,
                    rfid_auth_enabled: user_user_loaded.rfid_auth_enabled,
                    consumer_transactions: user_user_loaded.consumer_transactions,
                    vendor_transactions: user_user_loaded.vendor_transactions,
                    limit_charges: user_user_loaded.limit_charges,
                    daily_transaction_limit: user_user_loaded.daily_transaction_limit,
                    pos_enabled: user_user_loaded.pos_enabled,
                    atm_enabled:user_user_loaded.atm_enabled,
                }
            }
        case "SIGN_OUT":
            const user_sign_out = jwtDecode(action.token)
            const sign_out_config = action.sign_out_config

            if (sign_out_config === 0) {
                toast.success(`Goodbye ${user_sign_out.username.toUpperCase()}`, {
                    position: toast.POSITION.TOP_RIGHT
                })
            } else {
                toast.warning(`Session expired, please login again`, {
                    position: toast.POSITION.TOP_RIGHT
                })
            }

            localStorage.removeItem('refresh_token')
            localStorage.removeItem('access_token')

            return {
                refresh: "",
                access: "",
                user: {
                    user_id: "",
                    username: "",
                    email: "",
                    first_name: "",
                    last_name: "",
                    is_staff: "",
                    is_vendor: "",
                    is_admin: "",
                    biometric_auth: "",
                    rfid_auth: "",
                    biometrics_enabled: "",
                    rfid_auth_enabled: "",
                    consumer_transactions: "",
                    vendor_transactions: "",
                }
            }
        case "UPDATE_AUTH_PERMISSIONS":
            toast.success(action.auth_permissions.message, {
                position: toast.POSITION.TOP_RIGHT
            })
            return {
                ...state,
                user: {
                    ...state.user,
                    biometrics_enabled: action.auth_permissions.biometrics_enabled,
                    rfid_auth_enabled: action.auth_permissions.rfid_auth_enabled,
                    limit_charges: action.auth_permissions.limit_charges,
                    pos_enabled: action.auth_permissions.pos_enabled,
                    atm_enabled: action.auth_permissions.pos_enabled,

                }
            }

        case "RESET_PASSWORD":
            toast.success(action.response.message, {
                position: toast.POSITION.TOP_RIGHT
            })


        default:
            return state
    }
}

export default authReducer