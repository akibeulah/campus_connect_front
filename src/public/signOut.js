import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {signOut} from "../store/actions/authActions";
import {Navigate} from "react-router-dom";

const SignOut = (props) => {
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();
    useEffect(() => {dispatch(signOut())}, [])

    if (!auth.logged_in) {
        return <Navigate to={"/"}/>;
    }

    return (
        <>

        </>
    );
}

export default SignOut;