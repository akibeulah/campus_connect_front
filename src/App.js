import './App.css';
import {Outlet} from "react-router-dom";
import Header from "./components/header";
import {ToastContainer} from "react-toastify";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {loadUser} from "./store/actions/authActions";
import Footer from "./components/footer";

function App() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(loadUser())
    }, [dispatch])

    return (
        <>
            <ToastContainer/>
            <Header/>
            <Outlet/>
            <Footer/>
        </>
    );
}

export default App;
