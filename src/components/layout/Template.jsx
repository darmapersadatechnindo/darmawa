import React, { useState } from "react";
import Sidebar from "./Sidebar"
import Header from "./Header"
import { Routes, Route } from "react-router-dom";
import Dashboard from "../../pages/Dashboard";
import Device from "../../pages/Device.jsx";
import Pesan from "../../pages/Pesan.jsx";
import Profile from '../../pages/Profile.jsx'
import Logout from '../../pages/Logout.jsx'
export default function Template() {

    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };
    return (
        <div className="h-screen w-full bg-gray-100 text-gray-950 flex">
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col max-h-screen">
                <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
                <div className="flex-1 lg:p-5 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-900">
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/user" element={<Profile />} />
                        <Route path="/device" element={<Device />} />
                        <Route path="/chat" element={<Pesan />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="*" element={<div>Page Not Found</div>} />
                    </Routes>
                </div>
            </div>

        </div>
    )
}