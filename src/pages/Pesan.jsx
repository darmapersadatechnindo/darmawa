import React, { useEffect, useState } from "react";
import { useTitleContext } from "../components/config/TitleContext";
import socket from "../components/config/Socket";
import LeftChat from '../pages/whatsapp/LeftChat';

export default function Pesan() {
    const { updateTitle, updateSubtitle } = useTitleContext();
    const [device, setDevice] = useState([]);
    const [sessionId, setSessionId] = useState("");
    const [selected, setSelected] = useState({});
    const [listChat, setListChat] = useState([]);

    useEffect(() => {
        updateTitle("WhatsApp");
        updateSubtitle("Realtime Chat");

        // Emit hanya sekali saat komponen di-mount
        socket.emit("getDevice");

        const waClient = (response)=>{
            if(response.event === "disconnected"){
                setTimeout(() => {
                    socket.emit("getDevice");
                }, 1000);
            }
            if (response.event === "showDevice") {
                setDevice(response.data);
            }
        }
        socket.on("waClient",waClient)
        return () => {
            socket.off("waClient",waClient)
        };
    }, []);

    const handleSelected = (name) => {
        if (sessionId === name) {
            setSessionId("");
            setSelected({});
            return;
        }
        setSessionId(name);
        setSelected({ [name]: true });

        // Emit untuk mendapatkan chat dari sessionId yang dipilih
        socket.emit("chats", name);
    };

    useEffect(() => {
        const updateChats = (response) => {
            if (response.event === "chats" && response.session === sessionId) {
                setListChat(response.data);
            }
        };

        // Tambahkan event listener untuk chat
        socket.on("waClient", updateChats);

        return () => {
            // Hapus event listener saat sessionId berubah atau komponen unmount
            socket.off("waClient", updateChats);
        };
    }, [sessionId]); // Hanya dipanggil saat sessionId berubah

    return (
        <div className="flex flex-col">
            <div className="grid lg:grid-cols-4 grid-cols-3 gap-5">
                {device.map((hp, index) => {
                    const isSelected = selected[hp.sessionId] === true;
                    return (
                        <div
                            key={index}
                            className={`flex ${isSelected ? "bg-green-200 border-2 border-green-500 text-green-600" : "bg-white"} 
                                w-full items-center p-2 rounded-lg cursor-pointer`}
                            onClick={() => handleSelected(hp.sessionId)}
                        >
                            <div className="me-4 flex flex-shrink-0">
                                <img src={hp.image} className="w-12 h-12 rounded-full object-cover" />
                            </div>
                            <div>
                                <p className="font-bold m-0">{hp.wid}</p>
                                <p className="m-0">{hp.name}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            {sessionId !== "" && <LeftChat sessionId={sessionId} listChat={listChat} />}
        </div>
    );
}
