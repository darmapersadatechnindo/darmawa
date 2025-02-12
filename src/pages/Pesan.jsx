import React, { useEffect, useState, useRef } from "react";

import { useTitleContext } from "../components/config/TitleContext";
import SupabaseClient from "../components/config/SupabaseClient";
import socket from "../components/config/Socket";
import LeftChat from '../pages/whatsapp/LeftChat'
import { Howl } from 'howler';
import WhatsApp from "../components/config/WhatsApp";
export default function Pesan() {
    const { updateTitle, updateSubtitle } = useTitleContext();
    const [device, setDevice] = useState([]);
    const [status, setStatus] = useState({});

    const [sessionId, setSessionId] = useState("")
    const [selected, setSelected] = useState({})
    const [listChat, setListChat] = useState([])

    const getDevice = async () => {
        const owner = localStorage.getItem("username")
        const devices = await SupabaseClient.getDevice("device", "owner", owner, "status", "CONNECTED");
        setDevice(devices);
    };


    useEffect(() => {
        updateTitle("WhatsApp");
        updateSubtitle("Realtime Chat");
        getDevice();
    }, []);

    useEffect(() => {

    }, [device]);
    const handleSelected = async (name) => {

        if (sessionId === name) {
            setSessionId("");
            setSelected({});
            const result = await WhatsApp.listChat(name);
            setListChat(result)
            return;
        }

        setSessionId(name);
        setSelected({ [name]: true });
        const result = await WhatsApp.listChat(name);
        setListChat(result)
    };
    useEffect(() => {
        const updateChats = async () => {
            if (sessionId !== "") {
                const result = await WhatsApp.listChat(sessionId);
                setListChat(result)
            }
        }
        socket.on("anymessage", updateChats)
        socket.on("onmessage", updateChats)
        socket.on("onAck", updateChats)
        socket.on("onpresen", updateChats)
        socket.on("revokedmessage", updateChats)
        socket.on("UpdateLabel", updateChats)
        socket.on("status", updateChats)
    }, [sessionId])
    useEffect(() => {
        
    }, [sessionId, listChat])
    return (
        <div className="flex flex-col">
            <div className="grid lg:grid-cols-5 grid-cols-2 gap-5">
                {device.map((hp, index) => {
                    const isSelected = selected[hp.full] === true;
                    return (
                        <div
                            key={index}
                            className={`flex ${isSelected ? "bg-green-200 border-2 border-green-500 text-green-600" : "bg-white"} w-full items-center p-2 rounded-lg cursor-pointer`}
                            onClick={() => handleSelected(hp.full)}
                        >
                            <div className="me-4">
                                <img src={hp.profilPic} className="w-12 h-12 rounded-full object-cover" />
                            </div>
                            <div className="">
                                <p className="font-bold m-0">{hp.wid}</p>
                                <p className="m-0">{hp.pushName}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
            {sessionId !== "" && <LeftChat sessionId={sessionId} listChat={listChat} />}
        </div>

    )
}