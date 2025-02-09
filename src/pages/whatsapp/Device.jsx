import { useEffect, useState } from "react";
import { useTitleContext } from "../../components/config/TitleContext";
import AddDevice from "./AddDevice";
import SupabaseClient from "../../components/config/SupabaseClient";
import socket from "../../components/config/Socket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Device() {
    const { updateTitle, updateSubtitle } = useTitleContext();
    const [device, setDevice] = useState([]);
    const [qrcode, setQrcode] = useState({});
    const [profil, setProfil] = useState({});

    // Fetch device list from Supabase
    const getDevice = async () => {
        const owner = localStorage.getItem("username")
        const devices = await SupabaseClient.getWhere("device","owner",owner);
        setDevice(devices);
    };

    // Load device list when component mounts
    useEffect(() => {
        updateTitle("WhatsApp");
        updateSubtitle("Device");
        getDevice();
    }, []);

    // Request status for each device
    useEffect(() => {
        if (device.length > 0) {
            device.forEach((hp) => {
                socket.emit("status", hp.name);
            });
        }
    }, [device]);

    // Handle socket events
    useEffect(() => {
        const handleSocketEvent = async (data) => {
           
            if (data.event === "status") {
                setProfil((prevProfil) => ({
                    ...prevProfil,
                    [data.session]: {
                        ...prevProfil[data.session],
                        status: data.data.state,
                    },
                }));
                if (data.data.state === "CONNECTED") {
                    socket.emit("info", data.session);
                }
            }
            if(data.event === "loading_screen"){
                setProfil((prevProfil) => ({
                    ...prevProfil,
                    [data.sessionId]: {
                        ...prevProfil[data.sessionId],
                        status: "INSTALASI",
                    },
                }));
            }
            if(data.event === "disconnected"){
                setTimeout(() => {
                    socket.emit("status", data.sessionId);
                }, 500);
            }
            if(data.event === "authenticated"){
                setTimeout(() => {
                    socket.emit("status", data.sessionId);
                }, 500);
            }
            if (data.event === "info") {
                
                setProfil((prevProfil) => ({
                    ...prevProfil,
                    [data.session]: {
                        ...prevProfil[data.session],
                        img: data.data.img,
                        name: data.data.name,
                        wid: data.data.wid,
                    },
                }));
            }

            if (data.event === "qr") {
                
                setProfil((prevProfil) => ({
                    ...prevProfil,
                    [data.sessionId]: {
                        ...prevProfil[data.sessionId],
                        status: "QRCODE",
                    },
                }));

                setQrcode((prevQrcode) => ({
                    ...prevQrcode,
                    [data.sessionId]: {
                        ...prevQrcode[data.sessionId],
                        url: data.data,
                    },
                }));
            }
            if(data.event === "delete"){
                await SupabaseClient.Delete("device","name",data.session)
                await getDevice();
            }
        };

        socket.on("waClient", handleSocketEvent);

        return () => {
            socket.off("waClient", handleSocketEvent);
        };
    }, []);
    const deleteSession = (sessionId)=>{
        socket.emit("delete",sessionId)
    }
    return (
        <div className="grid lg:grid-cols-5 grid-cols-2 gap-5">
            <AddDevice getDevice={getDevice} />
            {device.length > 0 &&
                device.map((hp, index) => {
                    const statusDevice = profil[hp.name]?.status || "LOADING";
                    const qrImg = qrcode[hp.name]?.url || "";
                    const profilePic = profil[hp.name]?.img || "";
                    return (
                        <div
                            key={index}
                            className="w-full bg-white rounded-lg shadow-md p-5 flex flex-col space-y-4 items-center justify-center"
                        >
                            <div className="flex flex-col w-full">
                                <p className="text-center text-xl font-bold m-0">{hp.name}</p>
                                <p className="text-center m-0">{statusDevice}</p>
                            </div>
                            <div className="w-36 h-36 rounded-full bg-gray-100 flex justify-center items-center">
                                {statusDevice === "QRCODE" ? (
                                    <img src={qrImg} className="w-34 h-34" alt="QR Code" />
                                ) : statusDevice === "CONNECTED" ? (
                                    <img src={profilePic} className="w-34 h-34 rounded-full" alt="Profile" />
                                ) : (
                                    <img
                                        src="https://i.pinimg.com/originals/2e/ce/ce/2ececec5431d0a1b7eae4e1acac7c59f.gif"
                                        className="w-34 h-34"
                                        alt="Loading"
                                    />
                                )}
                            </div>
                            {statusDevice === "CONNECTED" ? (
                                <div className="block">
                                    <p className="font-bold m-0">{profil[hp.name]?.name}</p>
                                    <p className="text-sm m-0 text-gray-500">{profil[hp.name]?.wid}</p>
                                </div>
                            ) : (
                                <div 
                                    className="w-full rounded-full text-center block p-1.5 bg-red-500 text-white text-sm cursor-pointer"
                                    onClick={()=>deleteSession(hp.name)}
                                    >
                                    <FontAwesomeIcon icon={faTrash} className="me-2"/> Delete
                                </div>
                            )}
                        </div>
                    );
                })}
        </div>
    );
}
