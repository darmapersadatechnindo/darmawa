import React, { useEffect, useState, useRef } from "react";

import { useTitleContext } from "../../components/config/TitleContext";
import SupabaseClient from "../../components/config/SupabaseClient";
import socket from "../../components/config/Socket";
import LeftChat from "./LeftChat";
import { Howl } from 'howler';

export default function Pesan() {
    const { updateTitle, updateSubtitle } = useTitleContext();
    const [device, setDevice] = useState([]);
    const [status, setStatus] = useState({});
    
    const [sessionId, setSessionId] = useState("")
    const [selected, setSelected] = useState({})
    const [listChat, setListChat] = useState([])
    
    const getDevice = async () => {
        const owner = localStorage.getItem("username")
        const devices = await SupabaseClient.getWhere("device","owner",owner);
        setDevice(devices);
    };
    useEffect(() => {
        if (device.length > 0) {
            device.forEach((hp) => {
                socket.emit("status", hp.name);
            });
        }
    }, [device]);

    useEffect(() => {
        updateTitle("WhatsApp");
        updateSubtitle("Realtime Chat");
        getDevice();
    }, []);
    useEffect(() => {
        const handleSocketEvent = async (data) => {
            
            if (data.event === "status") {
                
                setStatus((prevStatus) => ({
                    ...prevStatus,
                    [data.session]: data.data,
                }));
                if (data.data.state === "CONNECTED") {
                    socket.emit("info", data.session);
                }
            }
            if (data.event === "info") {
                setStatus((prevStatus) => ({
                    ...prevStatus,
                    [data.session]: { ...prevStatus[data.session], ...data.data },
                }));
            }
            
           
        };

        socket.on("waClient", handleSocketEvent);

        return () => {
            socket.off("waClient", handleSocketEvent);
        };
    }, []);
    
    const handleSelected = (name) => {
        setSessionId(name)
        socket.emit("chats", name )
        setSelected((prevStatus) => {
            const newSelected = {};
            newSelected[name] = true;
            return newSelected;
        });

    }
    useEffect(() => {
       
    }, [sessionId, listChat])
    return (
        <div className="flex flex-col">
            <div className="grid lg:grid-cols-5 grid-cols-2 gap-5">
                {device.map((hp, index) => {
                    const deviceStatus = status[hp.name];
                    
                    const isSelected = selected[hp.name] === true;
                    const isDisconnected = !deviceStatus || deviceStatus.state === null;
                    const profilePic = deviceStatus?.img || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";
                    if (!isDisconnected) {
                        return (
                            <div
                                key={index}
                                className={`flex ${isSelected ? "bg-green-200 border-2 border-green-500 text-green-600" : "bg-white"} w-full items-center p-2 rounded-lg cursor-pointer`}
                                onClick={() => handleSelected(hp.name)}
                            >
                                <div className="me-4">
                                    <img src={profilePic} className="w-12 h-12 rounded-full" />
                                </div>
                                <div className="">
                                    <p className="font-bold m-0">{deviceStatus?.wid}</p>
                                    <p className="m-0">{deviceStatus?.name}</p>
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
            {sessionId !== "" && <LeftChat sessionId={sessionId} />}
        </div>

    )
}