import { useEffect, useState } from "react";
import { useTitleContext } from "../components/config/TitleContext";
import AddDevice from "../pages/whatsapp/AddDevice";
import SupabaseClient from "../components/config/SupabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh, faSignOut } from "@fortawesome/free-solid-svg-icons";
import WhatsApp from "../components/config/WhatsApp";
import Socket from '../components/config/Socket'
export default function Device() {
    const { updateTitle, updateSubtitle } = useTitleContext();
    const [device, setDevice] = useState([]);
    const [qrcode, setQrcode] = useState({});
    const [profil, setProfil] = useState({});
    const [statusDevices, setStatusDevices] = useState({});
    const [autoRefresh, setAutoRefresh] = useState(true);

    // ✅ Ambil daftar device dari Supabase
    const getDevice = async () => {
        const owner = localStorage.getItem("username");
        const devices = await SupabaseClient.getWhere("device", "owner", owner);
        setDevice(devices);
    };


    useEffect(() => {
        updateTitle("WhatsApp");
        updateSubtitle("Device");
        getDevice();
    }, []);


    useEffect(() => {
        const fetchSessions = async () => {
            const statusUpdates = {};
            const qrUpdates = {};

            await Promise.all(
                device.map(async (hp) => {
                    const getStatus = await WhatsApp.getStatus(hp.full);
                    console.log(getStatus)
                    if (getStatus.status !== "CONNECTED") {
                        const startSession = await WhatsApp.startSession(hp.full);
                        statusUpdates[hp.name] = startSession.status;

                        if (startSession.status === "QRCODE") {
                            qrUpdates[hp.name] = { url: startSession.qrcode };
                        }
                        if (startSession.status === "CONNECTED") {
                            await getDeviceInfo(hp.name);
                        }
                    }else{
                        statusUpdates[hp.name] = "CONNECTED";
                        await getDeviceInfo(hp.name)
                    }

                })
            );

            setStatusDevices((prev) => ({ ...prev, ...statusUpdates }));
            setQrcode((prev) => ({ ...prev, ...qrUpdates }));
        };

        if (device.length > 0) {
            fetchSessions();
        }
    }, [device]);

    const logoutSession = async (sessionId, name) => {
        await WhatsApp.logout(sessionId);
        setProfil((prev) => ({ ...prev, [name]: {} }));
        await getDevice();
    };

    // ✅ Ambil informasi perangkat
    const getDeviceInfo = async (name) => {

        try {
            const hp = await SupabaseClient.getWhere("device", 'name', name)
            const sessionId = hp[0].full
            const hostDevice = await WhatsApp.hostDevice(sessionId);
            const wid = hostDevice.response.phoneNumber;
            const pushName = hostDevice.response.pushname
            const profilPic = await WhatsApp.profilPic(sessionId, wid);
            console.log(profilPic);
            const imgUrl = profilPic.response.eurl;
            setProfil((prev) => ({
                ...prev,
                [name]: {
                    name: pushName,
                    wid: wid,
                    phone: wid,
                    img: imgUrl || "https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png",
                },
            }));
            await SupabaseClient.Update("device", { pushName, wid, profilPic: imgUrl }, "name", name)
        } catch (error) {
            console.error("❌ Error fetching profile info:", error);
        }
    };
    useEffect(() => {
        Socket.on("qrCode", (data) => {
            console.log(`ioQrcode:`, data)
            device.map(async (hp) => {
                if (hp.name === data.session) {
                    setStatusDevices((prev) => ({
                        ...prev,
                        [hp.name]: "QRCODE",
                    }));
                    setQrcode((prev) => ({
                        ...prev,
                        [hp.name]: { url: data.data },
                    }));
                }
            })
        })
        Socket.on("status", (data) => {
            console.log(`iostatus:`, data)
            device.map(async (hp) => {
                if (hp.name === data.session) {
                    setStatusDevices((prev) => ({
                        ...prev,
                        [hp.name]: data.status,
                    }));
                    await SupabaseClient.Update("device", { status: data.status }, "name", data.session)
                    if (data.status === "CONNECTED" || data.status === "inChat") {
                        setStatusDevices((prev) => ({
                            ...prev,
                            [hp.name]: "CONNECTED",
                        }));
                        await SupabaseClient.Update("device", { status: "CONNECTED" }, "name", data.session)
                        await getDeviceInfo(data.session)
                    }
                    if (data.status === "qrReadError") {
                        const hp = await SupabaseClient.getWhere("device", 'name', data.session)
                        const sessionId = hp[0].full
                        await WhatsApp.startSession(sessionId)
                    }
                }
            })
        })
    }, [device])
    return (
        <div className="grid lg:grid-cols-5 grid-cols-2 gap-5">
            <AddDevice getDevice={getDevice} />
            {device.length > 0 &&
                device.map((hp, index) => {
                    const statusDevice = statusDevices[hp.name] || "LOADING";
                    const qrImg = qrcode[hp.name]?.url || "";
                    const profilePic = profil[hp.name]?.img || "";

                    return (
                        <div
                            key={index}
                            className="w-full bg-white rounded-lg shadow-md p-5 flex flex-col space-y-4 items-center justify-center"
                        >
                            <div className="flex flex-col w-full">
                                <p className="text-xl text-center font-bold m-0">{hp.name}</p>
                                <p className="m-0 text-center">{statusDevice}</p>
                            </div>
                            <div className="w-36 h-36 rounded-full bg-gray-100 flex justify-center items-center">
                                {statusDevice === "QRCODE" || statusDevice === "notLogged" || statusDevice === "qrcode" ? (
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
                                <div className="flex w-full space-x-3">
                                    <div className="w-full">
                                        <p className="text-start text-sm font-bold m-0">{profil[hp.name]?.name}</p>
                                        <p className="text-start text-xs m-0 text-gray-500">{profil[hp.name]?.wid}</p>
                                    </div>
                                    <div
                                        className="py-0.5 px-1 w-full rounded-lg flex justify-center items-center bg-red-500 text-white cursor-pointer"
                                        onClick={() => logoutSession(hp.full)}
                                    >
                                        <FontAwesomeIcon icon={faSignOut} className="me-2" /> Logout
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="w-full rounded-full text-center block p-2 bg-green-500 text-white cursor-pointer"
                                    onClick={() => refreshSession(hp.full)}
                                >
                                    <FontAwesomeIcon icon={faRefresh} className="me-2" /> Refresh
                                </div>
                            )}
                        </div>
                    );
                })}
        </div>
    );
}
