import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import {BrowserRouter, Route, Routes} from "react-router-dom";
import { createStore, applyMiddleware, compose } from 'redux';
import {Provider} from "react-redux";
import thunk from 'redux-thunk';
import rootReducer from "./store/reducers/rootReducer";

import App from './App';
import Home from './public/home';
import Login from './public/login';
import SignOut from './public/signOut';

import 'react-toastify/dist/ReactToastify.css';
import Dashboard from "./user/dashboard";

const store = createStore(rootReducer, compose(applyMiddleware(thunk)))

ReactDOM.render(
    <React.StrictMode>
       <Provider store={store}>
           <BrowserRouter>
               <Routes>
                   <Route path="/" element={<App/>}>
                       <Route index element={<Home/>}/>
                       <Route path={"login"} element={<Login/>}/>
                       <Route path={"dashboard"} element={<Dashboard/>}/>
                       <Route path={"signout"} element={<SignOut />}/>
                   </Route>
               </Routes>
           </BrowserRouter>
       </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
