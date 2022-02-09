import React from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from "../../pages/Home";

function index() {
    return (
        <Router>
            <Routes>
                <Route path='/' exact element={<Home/>} ></Route>
            </Routes>
        </Router>
    );
};

export default index;