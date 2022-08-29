import React, { useState } from "react";
import { useLogoutUserMutation } from "../services/appApi";
import { useSelector } from "react-redux"; 
import { BrowserRouter, Link } from "react-router-dom"; 
import "./Nav.css";

function Navigation() {
    const user = useSelector((state) => state.user);
    const [logoutUser] = useLogoutUserMutation();
    const [isActive, setActive] = useState()
    async function handleLogout(e) {
        e.preventDefault();
        await logoutUser(user);
        // redirect to home page
        window.location.replace("/");
        setActive(!isActive);
    }
    const toggleClass = () => {

    }


    return (

        <> 
        </>

    );
}

export default Navigation;
