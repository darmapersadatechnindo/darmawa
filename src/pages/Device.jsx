import { useEffect, useState } from "react";
import { useTitleContext } from "../components/config/TitleContext";
import AddDevice from "../pages/whatsapp/AddDevice";
import socket from "../components/config/Socket";

export default function Device() {
    const { updateTitle, updateSubtitle } = useTitleContext();
    const [device, setDevice] = useState([]);
    const [started, setStarted] = useState({});

    useEffect(() => {
        updateTitle("WhatsApp");
        updateSubtitle("Device");

        socket.emit("getDevice");

        const showDevices = (data) => {
            setDevice(data.data);
        };

        const updateDevice = () => {
            setTimeout(() => {
                socket.emit("getDevice");
            }, 500);
        };

        // Pasang event listener dengan cleanup
        socket.on("showDevice", showDevices);
        socket.on("QRCODE", showDevices);
        socket.on("waClient", updateDevice);

        return () => {
            // Hapus event listener saat komponen unmount
            socket.off("showDevice", showDevices);
            socket.off("QRCODE", showDevices);
            socket.off("waClient", updateDevice);
        };
    }, []); // Dependency array kosong -> hanya dijalankan saat mount

    const startSession = (sessionId) => {
        setStarted((prev) => ({ ...prev, [sessionId]: true }));
        socket.emit("start", sessionId);
    };

    const restartSession = (sessionId) => {
        setStarted((prev) => ({ ...prev, [sessionId]: true }));
        socket.emit("restart", sessionId);
    };
    const handleDelete = (sessionId)=>{
        socket.emit("delete",sessionId)
    }
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
                                    <div className="w-32 h-32 rounded-lg p-2 bg-gray-200 flex justify-center items-center">
                                        <img src={hp.image} className="w-full h-auto object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-gray-200 flex justify-center items-center">
                                        <img src={hp.image} className="w-full h-auto rounded-full object-cover" />
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
                                            onClick={()=>handleDelete(hp.sessionId)}
                                            >
                                            DELETE
                                        </div>
                                        <div className="w-full bg-blue-500 cursor-pointer text-white text-center p-2 rounded-lg">
                                            SET USER
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full flex space-x-4">
                                        <div 
                                            className="w-full bg-red-500 cursor-pointer text-white text-center p-2 rounded-lg"
                                            onClick={()=>handleDelete(hp.sessionId)}
                                            >
                                            DELETE
                                        </div>
                                        <div className="w-full bg-blue-500 cursor-pointer text-white text-center p-2 rounded-lg">
                                            SET USER
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}
