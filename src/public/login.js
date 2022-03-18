import React, {useState} from 'react';

import {useDispatch, useSelector} from "react-redux";
import {login} from "../store/actions/authActions";
import {Navigate} from "react-router-dom";

const Login = () => {
    const [user, setUser] = useState({
        username: "",
        password: ""
    })
    // const [loading, setLoading] = useState(false);
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();
    if (auth.logged_in) {
        return <Navigate to={"/dashboard"}/>;
    }

    // const history = useHistory();

    const handleLogin = (e) => {
        e.preventDefault()
        dispatch(login(user))

        setUser({
            username: "",
            password: ""
        })
    };

    return (
        <>
            <div className="w-full max-w-md m-auto mt-12">
                <div className="">
                    <form
                        className="bg-white shadow-md hover:shadow-2xl transition-all rounded px-8 pt-6 pb-8 mb-4"
                        onSubmit={(e) => handleLogin(e)}
                    >
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                User ID
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="username"
                                value={user.username}
                                name={'username'}
                                type="text"
                                placeholder="User ID"
                                onChange={e => setUser({...user, username: e.target.value})}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                value={user.password}
                                type="password"
                                placeholder="************"
                                name={'password'}
                                onChange={e => setUser({...user, password: e.target.value})}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <input
                                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                                value="Sign In"
                            />
                            <a className="inline-block align-baseline font-bold text-sm text-orange-500 hover:text-orange-800"
                               href="#">
                                Forgot Password?
                            </a>
                        </div>
                    </form>
                    <p className="text-center text-gray-500 text-xs">
                        &copy;2020 AKINDELE, Beulah O. All rights reserved.
                    </p>
                </div>
            </div>
        </>
    )
}

export default Login