import { useTitleContext } from "../config/TitleContext"
import SupabaseClient from "../config/SupabaseClient";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBarsStaggered, faRefresh } from "@fortawesome/free-solid-svg-icons";
export default function Header({ toggleSidebar, isOpen }) {
    const { title, subtitle } = useTitleContext();
    const [user, settUser] = useState("")
    const [balance, setBalance] = useState("")
    const [loading, setLoading] = useState(false)
    
    return (
        <div className="flex bg-gray-50 items-center p-3 shadow-b-only shadow-md">
            <div className="flex-1 flex ms-0 justify-between items-center">
                <div className="flex space-x-2 text-gray-950">
                    <div className="hidden lg:flex space-x-2">
                        <p className="text-black font-bold">{title}</p>
                        <p>/</p>
                        <p className="text-gray-500 font-bold">{subtitle}</p>
                    </div>
                    <div className="flex items-center lg:hidden">
                        <img src="/WhatsApp.png" alt="Japri Pay Nusantara" className="h-8" />
                        <p className="ms-1 text-xl font-bold">Darma WhatsApp</p>
                    </div>

                </div>
                <div className="flex">
                    
                    <button
                        className="ms-5 lg:hidden"
                        onClick={toggleSidebar}
                    >
                        {!isOpen ? <FontAwesomeIcon icon={faBars} className="h-6" /> : <FontAwesomeIcon icon={faBarsStaggered} className="h-6" />}
                    </button>
                </div>

            </div>
        </div>
    )
}