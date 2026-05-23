import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from 'react-redux';
import Loader from "../components/Loader";
import Login from "./Login";

const Layout = () => {
    const { user, loading } = useSelector(state => state.auth);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader />
            </div>
        );
    }

    return (
        <div>
            {user ? (
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <Outlet />
                </div>
            ) : (
                <Login />
            )}
        </div>
    );
};

export default Layout