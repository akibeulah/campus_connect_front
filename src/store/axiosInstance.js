import axios from "axios"
import {toast} from "react-toastify";


const getHeaders = () => {
    return {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
        'Accept': "application/json"
    };
}

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: getHeaders()
})


const sessionExpired = () => {
    toast(`Session expired, please login again`, {
        position: toast.POSITION.TOP_RIGHT
    })

    localStorage.removeItem('refresh_token')
    localStorage.removeItem('access_token')
    if (document.location.pathname !== "/login") document.location.href = "/login"
}

axiosInstance.interceptors.response.use(response => response,
    async error => {
        const originalRequest = error.config

        if (error.response.status === 401 && originalRequest.url === 'token/refresh/') {
            sessionExpired()
        }
        // console.log(error.response.status)
        if (
            error.response.data.code === 'token_not_valid' &&
            error.response.status === 401 &&
            error.response.statusText === 'Unauthorized'
        ) {
            const refresh_token = localStorage.getItem('refresh_token')
            
            if (refresh_token !== "null" && refresh_token !== null) {
                const exp = JSON.parse(atob(refresh_token.split('.')[1])).exp
                // console.log('refresh token check')

                if (Date.now() > exp) {
                    // console.log('expired token check')

                    return axiosInstance.post('token/refresh/', {"refresh": localStorage.getItem('refresh_token')})
                        .then(resp => {
                            localStorage.setItem('access_token', resp.data.access)

                            axiosInstance.defaults.headers = getHeaders()
                            originalRequest.headers = getHeaders()

                            // console.log(originalRequest)
                            return axiosInstance(originalRequest)
                        })
                        .catch(err => console.log("error: " + err))
                } else sessionExpired()
            } else sessionExpired()

        } else return Promise.reject(error)
    }
)

export default axiosInstance
