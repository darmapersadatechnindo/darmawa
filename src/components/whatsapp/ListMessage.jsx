import Utils from "../config/Utils"
import Icon from "../base/Icon";
import { faCheck, faRefresh, faFileAlt, faBan, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState,useRef } from "react";
import { saveMedia, getMedia } from "../config/indexedDBUtils";
import socket from "../config/Socket";

export default function ListMessage({ chatId, listMessage, sessionId }) {
    const [media, setMedia] = useState({})
    const chatEndRef = useRef(null);
    useEffect(() => {
        const fetchMedia = async () => {
            if (listMessage.length > 0) {
                // Iterasi dengan forEach atau for loop
                for (const chat of listMessage) {
                    if (chat.hasMedia) {
                        const blob = await getMedia(chat.id._serialized);
                        if (blob) {
                            const url = URL.createObjectURL(blob);

                            setMedia((prevMedia) => ({
                                ...prevMedia,
                                [chat.id._serialized]: url,
                            }));
                        } else {
                            socket.emit("downloadMedia", {
                                messageId: chat.id._serialized,
                                sessionId,
                            });
                        }
                    }
                }
            }
        };
        fetchMedia();
    }, [listMessage, sessionId]);
    const base64ToArrayBuffer = (base64) => {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    };
    useEffect(() => {
        const showMedia = async (response) => {
            if (response.event === "downloadMedia" && response.session === sessionId) {
                const { messageId, media } = response.data;
                const mediaArrayBuffer = base64ToArrayBuffer(media.data);
                const mediaBlob = new Blob([mediaArrayBuffer], { type: media.mimetype });
                await saveMedia(messageId, mediaBlob, media.mimetype);
                setTimeout(async () => {
                    const blob = await getMedia(response.data.messageId);
                    setMedia((prevMedia) => ({
                        ...prevMedia,
                        [response.data.messageId]: URL.createObjectURL(blob),
                    }));
                    if (chatEndRef.current) {
                        chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
                    }
                }, 1000);
            }
        };


        socket.on("downloadMedia", showMedia);
        console.log(listMessage)
        
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
        return () => {
            socket.off("downloadMedia", showMedia);
        };
        
    }, [listMessage])
    return (<div>
        {chatId && listMessage.length > 0 && listMessage.map((msg, index) => {
            const mediaUrl = media[msg.id._serialized];
            const isGroup = msg.id.remote.split("@")[1] === "g.us"
            return (
                <div className="flex flex-col space-y-1" key={index} ref={index === listMessage.length - 1 ? chatEndRef : null}>
                    <div className={`flex text-sm ${msg.fromMe ? "justify-end" : "justify-start"} mb-1`}>
                        <div className={`${msg.fromMe ? "bg-emerald-800" : "bg-gray-700"} text-white p-1 px-2 rounded-lg w-auto flex flex-col  max-w-[400px] `}>

                            <div>
                                {isGroup && <p className="text-emerald-400 mb-3 text-sm w-full">{msg.id.participant.user}</p>}
                                <div className="max-w-[400px]">
                                    {msg.type === "image" && (
                                        <div className="flex flex-col">
                                            {!mediaUrl ? (
                                                <div className={`flex flex-col justify-center ${msg.fromMe ? "bg-emerald-900" : "bg-gray-800"} p-2 mb-2 rounded-md`}>
                                                    <FontAwesomeIcon icon={faRefresh} className="animate-spin mb-2" />
                                                    <p className="italic">Download media</p>
                                                </div>
                                            ) : (
                                                <img
                                                    src={mediaUrl}
                                                    alt="Media"
                                                    className="w-full h-auto rounded-lg mb-2 cursor-pointer"
                                                    onClick={() => Utils.openMedia(mediaUrl)}
                                                />
                                            )}
                                            {msg._data.caption && (
                                                <span dangerouslySetInnerHTML={{ __html: Utils.formatChat(msg._data.caption, msg) }} />
                                            )}

                                        </div>
                                    )}
                                    {msg.type === "sticker" && (
                                        <div>
                                            {!mediaUrl ? (
                                                <div className={`flex flex-col justify-center  ${msg.fromMe ? "bg-emerald-900" : "bg-gray-800"} p-2 mb-2 rounded-md`}>
                                                    <FontAwesomeIcon icon={faRefresh} className="animate-spin mb-2" />
                                                    <p className="italic">Download media</p>
                                                </div>
                                            ) : (
                                                <img
                                                    src={mediaUrl}
                                                    alt="Media"
                                                    className="w-full h-32 rounded-lg mb-2 cursor-pointer"
                                                />
                                            )}

                                        </div>

                                    )}
                                    {msg.type === "video" && (
                                        <div>
                                            {!mediaUrl ? (
                                                <div className={`flex flex-col justify-center  ${msg.fromMe ? "bg-emerald-900" : "bg-gray-800"} p-2 mb-2 rounded-md`}>
                                                    <FontAwesomeIcon icon={faRefresh} className="animate-spin mb-2" />
                                                    <p className="italic">Download media</p>
                                                </div>
                                            ) : (
                                                <video
                                                    controls
                                                    src={mediaUrl}
                                                    className="w-full max-h-64 rounded-lg mb-2"
                                                    onClick={() => Utils.openMedia(mediaUrl)}
                                                />
                                            )}
                                        </div>

                                    )}
                                    {msg.type === "audio" && (
                                        <audio
                                            controls
                                            src={mediaUrl}
                                            className="w-full mb-2"
                                            onClick={() => Utils.openMedia(mediaUrl)}
                                        />
                                    )}
                                    {msg.type === "ptt" && (
                                        <div>
                                            <audio
                                                controls
                                                src={mediaUrl}
                                                className="max-w-[400px] mb-2"
                                                onClick={() => Utils.openMedia(mediaUrl)}
                                            />
                                            <p className="text-xs text-gray-400">{Utils.formatFileSize(msg._data.size)}</p>
                                        </div>
                                    )}
                                    {msg.type === "document" && (
                                        <div className="cursor-pointer " onClick={() => Utils.openMedia(mediaUrl)}>
                                            {msg.mimetype === "application/pdf" ? (
                                                <div className={`flex mb-2 items-center space-x-3 text-sm p-2  ${msg.fromMe ? "bg-emerald-900" : "bg-gray-800"} rounded-md`}>
                                                    <iframe
                                                        src={mediaUrl}
                                                        className="w-full h-50 rounded-lg"
                                                        title="Preview PDF"
                                                    ></iframe>
                                                </div>

                                            ) : (
                                                <div className={`flex mb-2 items-center space-x-3 text-sm p-2  ${msg.fromMe ? "bg-emerald-900" : "bg-gray-800"} rounded-md`}>
                                                    <FontAwesomeIcon icon={faFileAlt} className="text-2xl text-blue-500" />
                                                    <div>
                                                        <p className="text-sm">{msg._data.caption}</p>
                                                        <p className="text-xs text-gray-400">{Utils.formatFileSize(msg._data.size)}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                    )}
                                </div>
                            </div>
                            {msg.links.length > 0 && (
                                <div>
                                    <a href={msg._data.matchedText} target="_blank">
                                        <div className={`${msg.fromMe ? "bg-emerald-900" : "bg-gray-800"} text-sm rounded-lg mb-2 max-w-[400px]`}>
                                            {msg._data.thumbnail && <p className="text-xs">
                                                <div
                                                    className="w-full h-[200px] rounded-tl-lg rounded-tr-lg bg-cover bg-center"
                                                    style={{ backgroundImage: `url(data:image/jpeg;base64,${msg._data.thumbnail})` }}
                                                ></div>
                                            </p>}
                                            <div className="px-3 py-2">
                                                {msg.title ? <p className="text-md m-0">
                                                    {msg._data.title}
                                                </p> : <p className="text-sm m-0">
                                                    {msg._data.matchedText}
                                                </p>}
                                                {msg._data.description && <p className="text-[10px] text-gray-300 m-0">
                                                    {msg._data.description}
                                                </p>}
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            )}

                            {msg.type === "chat" && (
                                <div>
                                    <span dangerouslySetInnerHTML={{ __html: Utils.formatChat(msg.body, msg) }} />
                                </div>
                            )}

                            {msg.type === "revoked" && (
                                <div className="flex text-sm mb-2 items-center">
                                    <FontAwesomeIcon icon={faBan} className="text-red-600 me-2" />
                                    <p>Pesan ini telah dihapus</p>
                                </div>
                            )}
                            {msg.type === "call_log" && (
                                <div className={`${msg.fromMe ? "bg-emerald-900" : "bg-gray-800"} flex text-sm mb-2 rounded-lg p-3 max-w-[400px] items-center`}>
                                    <div className="w-9 h-9 bg-gray-500 me-3 rounded-full flex justify-center items-center">
                                        <FontAwesomeIcon icon={faPhone} className="text-white" />
                                    </div>
                                    <p>Log Panggilan</p>
                                </div>
                            )}
                            <div className={`flex items-center ${msg.fromMe ? "justify-end" : "justify-start"} mt-1`}>
                                <p className={`text-xs ${msg.fromMe ? "text-start" : "text-end w-full"} text-gray-300`}>
                                    {Utils.formatDate(msg.timestamp)}
                                </p>
                                {msg.fromMe && (
                                    <p className="text-xs ms-2">
                                        {msg.ack == 1 && <FontAwesomeIcon icon={faCheck} />}
                                        {msg.ack == 2 && <Icon.unRead />}
                                        {msg.ack == 3 && <Icon.Read />}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )
        })}
    </div>)
}