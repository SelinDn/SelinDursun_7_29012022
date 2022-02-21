import React from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from "../../pages/Home/Home";
import Auth from "../../pages/Auth/Auth";
import Navbar from "../Navbar/Navbar";
import Profil from "../../pages/Profil/Profil";

function index() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path='/' exact element={<Auth/>} ></Route>
                <Route path='/home' exact element={<Home/>} ></Route>
                <Route path='/profil/:id' exact element={<Profil/>}></Route>
            </Routes>
        </Router>
    );
};

export default index;