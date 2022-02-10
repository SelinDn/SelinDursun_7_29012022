import React from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from "../../pages/Home";
import Auth from "../../pages/Auth/Auth";

function index() {
    return (
        <Router>
            <Routes>
                <Route path='/' exact element={<Auth/>} ></Route>
                <Route path='/home' exact element={<Home/>} ></Route>
            </Routes>
        </Router>
    );
};

export default index;