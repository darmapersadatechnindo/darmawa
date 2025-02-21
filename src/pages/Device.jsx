import { useEffect, useState } from "react";
import { useTitleContext } from "../components/config/TitleContext";
import AddDevice from "../pages/whatsapp/AddDevice";
import socket from "../components/config/Socket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserEdit } from "@fortawesome/free-solid-svg-icons";
import Modal from '../components/base/Moda'
export default function Device() {
    const { updateTitle, updateSubtitle } = useTitleContext();
    const [device, setDevice] = useState([]);
    const [user, setUser] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isOpen, setIsOpen] = useState(false)
    const [userId, setUserId] = useState("")
    useEffect(() => {
        updateTitle("WhatsApp");
        updateSubtitle("Device");
        socket.emit("getDevice")
        socket.emit("showUser")
    }, []);

    const handleDelete = (sessionId) => {
        socket.emit("delete", sessionId)
    }
    useEffect(() => {
        const handleWaClient = (response) => {
            console.log(response)
            if (response.event === "showDevice") {
                setDevice(response.data)
            } else if (response.event === "createDevice") {
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
            } else if (response.event === "ready") {
                setDevice(response.data)
            } else if (response.event === "disconnected") {

            }

        }
        const showUsers = (response) => {
            setUser(response.data)
        }
        socket.on("waClient", handleWaClient)
        socket.on("user", showUsers)
        return () => {
            socket.off("waClient", handleWaClient)
        };
    }, []);
    useEffect(() => {

    }, [device])
    const EditAkses = (id) => {

        setIsOpen(true)
        setUserId(id)
    }
    const handleCheckboxChange = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((user) => user !== userId)
                : [...prev, userId]
        );
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit("setRole",{selectedUsers,deviceId:userId})
        setIsOpen(false)
    };
    return (
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-5">
            <AddDevice />
            {device.length > 0 &&
                device.map((hp, index) => {

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
                                {hp.setUser === 0 &&
                                    <div className="cursor-pointer" onClick={() => EditAkses(hp.id)}>
                                        <FontAwesomeIcon icon={faUserEdit} className="text-4xl text-gray-700" />
                                    </div>
                                }

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
                                            Open Chat
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            <Modal isOpen={isOpen} >
                <p className="text-center text-xl mb-5">Edit Akses Device {userId}</p>
                <form onSubmit={handleSubmit}>
                    <input type="hidden" value={userId} name="deviceId" />
                    <div className="flex flex-col">
                        <p className="mb-3">Silahkan tentukan akses device bisa dilihat atau dikelola oleh siapa saja</p>
                        {user.length > 0 && user.map((usr, index) => {
                            return (
                                <div key={index} className="flex mb-3">
                                    <input
                                        type="checkbox"
                                        name={"userId"}
                                        onChange={() => handleCheckboxChange(usr.userId)}
                                    />
                                    <p className="ms-2">{usr.username}</p>
                                </div>
                            )
                        })}
                        <div className="flex justify-between">
                            <button
                                type="submit"
                                className="w-full mt-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition duration-200"
                            >
                                Submit
                            </button>
                            <div className="w-full"></div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="w-full mt-2 p-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition duration-200"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
