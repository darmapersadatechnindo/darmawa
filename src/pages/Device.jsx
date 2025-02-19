import { useEffect, useState } from "react";
import { useTitleContext } from "../components/config/TitleContext";
import AddDevice from "../pages/whatsapp/AddDevice";
import socket from "../components/config/Socket";
import Modal from '../components/base/Moda'
import { Link } from "react-router-dom";
export default function Device() {
    const { updateTitle, updateSubtitle } = useTitleContext();
    const [device, setDevice] = useState([]);
    const [started, setStarted] = useState({});
    useEffect(() => {
        updateTitle("WhatsApp");
        updateSubtitle("Device");
        socket.emit("getDevice")
    }, []);

    const startSession = (sessionId) => {
        setStarted((prev) => ({ ...prev, [sessionId]: true }));
        socket.emit("start", sessionId);

    };

    const restartSession = (sessionId) => {
        setStarted((prev) => ({ ...prev, [sessionId]: true }));
        socket.emit("restart", sessionId);
    };
    const handleDelete = (sessionId) => {
        socket.emit("delete", sessionId)
    }
    const [sinkron, setSinkron] = useState(false)
    const [open, setOpen] = useState(false)
    
    useEffect(() => {
        const handleWaClient = (response) => {
            console.log(response)
            if (response.event === "showDevice") {
                setDevice(response.data)
            } else if (response.event === "QRCODE") {
                setDevice((prevDevices) =>
                    prevDevices.map((dev) =>
                        dev.sessionId === response.session
                            ? { ...dev, status: "QRCODE", image: response.data }
                            : dev
                    )
                );
                setTimeout(() => {
                    socket.emit("status", response.session)
                }, 5000);
            } else if (response.event === "restart") {
                setDevice((prevDevices) =>
                    prevDevices.map((dev) =>
                        dev.sessionId === response.session
                            ? { ...dev, status: "Restart", image: null }
                            : dev
                    )
                );
            } else if (response.event === "status") {
                if (response.data.state === "CONNECTED") {
                    
                    setTimeout(() => {
                        socket.emit("updateInfo", response.session)
                    }, 1000);
                }
            } else if (response.event === "loading_screen") {
                socket.emit("status", response.session)
            } else if (response.event === "authenticated") {
                socket.emit("status", response.session)
            } else if (response.event === "ready") {
                socket.emit("status", response.session)
            } else if (response.event === "disconnected") {
                setTimeout(() => {
                    socket.emit("logoutDevice", response.session)
                }, 1000);
            }
            if (response.event === "sinkronisasi") {
                setOpen(false)
                setSinkron(false)
                socket.emit("getDevice")
            }
        }
        socket.on("waClient", handleWaClient)
        return () => {
            socket.off("waClient", handleWaClient)
        };
    }, []);
    useEffect(() => {
      
    }, [device])

    return (
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-5">
            <AddDevice />
            {device.length > 0 &&
                device.map((hp, index) => {
                    const isStarted = started[hp.sessionId] === true;
                    return (
                        <div key={index} className="w-full bg-white rounded-lg shadow-md p-5 flex flex-col">
                            <div className="flex border-b-2 border-gray-100 pb-3 items-center">
                                {hp.status === "QRCODE" ? (
                                    <div className="">
                                        <img src={hp.image} className="w-36 h-auto object-cover" />
                                    </div>
                                ) : (
                                    <div className="">
                                        {hp.status === "CONNECTED" ?
                                            <img src={hp.image} className="w-24 h-auto rounded-full object-cover" />
                                            :
                                            <img src={"https://i.gifer.com/origin/8b/8b4d5872105584fe9e2d445bea526eb5_w200.gif"} className="w-24 h-auto object-cover" />
                                        }
                                    </div>
                                )}
                                <div className="w-full ms-5">
                                    <p className="text-2xl">{hp.sessionId}</p>
                                    <p className="text-sm">{hp.status}</p>
                                </div>

                            </div>
                            <div className="flex flex-col mt-4 border-b-2 border-gray-100 pb-3">
                                <div className="flex justify-between">
                                    <p>Name</p>
                                    <p className="text-sm">{hp.name || "Not Connected"}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p>WID</p>
                                    <p className="text-sm">{hp.wid || "Not Connected"}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p>Platform</p>
                                    <p className="text-sm">{hp.platform || "Not Connected"}</p>
                                </div>
                            </div>
                            <div className="flex-1 flex items-center justify-between space-x-4">
                                {hp.status !== "CONNECTED" ? (
                                    <div className="w-full flex space-x-4">
                                        {isStarted || hp.status === "QRCODE" ? (
                                            <div className="w-full bg-green-500 cursor-pointer text-white text-center p-2 rounded-lg"
                                                onClick={() => restartSession(hp.sessionId)}>
                                                RE-START
                                            </div>
                                        ) : (
                                            <div className="w-full bg-green-500 cursor-pointer text-white text-center p-2 rounded-lg"
                                                onClick={() => startSession(hp.sessionId)}>
                                                START
                                            </div>
                                        )}
                                        <div
                                            className="w-full bg-red-500 cursor-pointer text-white text-center p-2 rounded-lg"
                                            onClick={() => handleDelete(hp.sessionId)}
                                        >
                                            DELETE
                                        </div>
                                       
                                    </div>
                                ) : (
                                    <div className="w-full flex space-x-4">
                                       
                                        <a href={`/wa/console/${hp.sessionId}`} target="_blank" className="w-full bg-blue-500 cursor-pointer text-white text-center p-2 rounded-lg">
                                            Console Device
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            <Modal isOpen={open} >
                <div className="flex flex-col justify-center items-center">
                    <img src={"https://i.gifer.com/origin/8b/8b4d5872105584fe9e2d445bea526eb5_w200.gif"} className="w-32 h-auto mb-6 object-cover" />
                    <p className="m-0 font-bold text-3xl text-blue-500">Mohon Tunggu...</p>
                    <p className="m-0 text-red-500">Sedang mensikronkan dengan Server WhatsApp</p>
                </div>
            </Modal>
        </div>
    );
}
