import React, { useState, useEffect } from "react";
import socket from "../../components/config/Socket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCheckDouble } from "@fortawesome/free-solid-svg-icons";
const ChatMessage = ({ listPesan, sessionId }) => {
   
    const showDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const isToday =
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();
        if (isToday) {
            return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: '2-digit' });
        }
    };
    
    const openImage = (base64String) => {
        const byteCharacters = atob(base64String.split(",")[1]);
        const byteNumbers = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const blob = new Blob([byteNumbers], { type: "image/jpeg" });

        // Buat URL dari Blob
        const blobUrl = URL.createObjectURL(blob);

        // Buka di tab baru
        window.open(blobUrl, "_blank");

        // Bersihkan URL setelah dibuka untuk menghindari memory leak
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    }
    
    return (
        <div className="chat-container">
            {listPesan.map((item, index) => (
                <div
                    key={index}
                    className={`flex ${item.fromMe ? "justify-end ms-32" : "justify-start me-32"} mb-3`}
                >
                    <div
                        className={`${item.fromMe ? "bg-green-100" : "bg-white"
                            } p-1 px-2 rounded-lg w-auto flex flex-col`}
                    >
                        {item.hasMedia && (
                            <>
                                {!item.media ? (
                                    <p className="text-gray-500 text-xs italic">
                                        Mengunduh media...
                                    </p>
                                ) : (
                                    <div>
                                        {item.type === "image" && (
                                            <img
                                                src={`data:${item.media.mimetype};base64,${item.media.data}`}
                                                alt="Media"
                                                className="max-w-64 h-auto rounded-lg mb-2 cursor-pointer"
                                                onClick={() => openImage(mediaData[item.id._serialized])}
                                            />
                                        )}
                                        {item.type === "sticker" && (
                                            <img
                                            src={`data:${item.media.mimetype};base64,${item.media.data}`}
                                                alt="Media"
                                                className="max-w-32 h-32 rounded-lg mb-2 cursor-pointer"
                                                onClick={() => openImage(mediaData[item.id._serialized])}
                                            />
                                        )}
                                        {item.type === "video" && (
                                            <video
                                                controls
                                                src={`data:${item.media.mimetype};base64,${item.media.data}`}
                                                className="max-w-full max-h-64 rounded-lg mb-2"
                                            />
                                        )}
                                        {item.type === "audio" && (
                                            <audio
                                                controls
                                                src={`data:${item.media.mimetype};base64,${item.media.data}`}
                                                className="w-full mb-2"
                                            />
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Tampilkan teks pesan */}
                        {item.links.length > 0 && item.links.map((items, index) => (
                            <a href={item._data.matchedText || items.link} key={index} target="_blank">
                                <div className="bg-gray-100 text-sm rounded-lg mb-2 max-w-72">
                                    {item._data.thumbnail && <p className="text-xs">
                                        <div
                                            className="w-full h-[110px] rounded-tl-lg rounded-tr-lg bg-cover bg-center"
                                            style={{ backgroundImage: `url(data:image/jpeg;base64,${item._data.thumbnail})` }}
                                        ></div>
                                    </p>}
                                    <div className="px-3 py-2">
                                        {item.title ? <p className="text-xs m-0">
                                            {item.title}
                                        </p> : <p className="text-xs m-0">
                                            {items.link}
                                        </p>}
                                        {item.description && <p className="text-[10px] text-gray-500 m-0">
                                            {item.description}
                                        </p>}
                                    </div>
                                </div>
                            </a>

                        ))}
                        <div className={`text-sm ${item.hasMedia && "max-w-64"} ${item.links.length > 0 && "max-w-72"}`}>
                            {item.body.split("\n").map((line, idx) => (
                                <React.Fragment key={idx}>
                                    {item.links.length > 0 && typeof line === "string" && line.includes(item._data.matchedText || item.body) ? (
                                        <a href={item._data.matchedText || item.body} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                            {item._data.matchedText || item.body}
                                        </a>
                                    ) : (
                                        <span>{line}</span> // Gunakan <span> agar tetap inline
                                    )}
                                    <br />
                                </React.Fragment>
                            ))}
                        </div>
                        {/* Tampilkan metadata pesan */}
                        {item.fromMe ? (
                            <div className="flex justify-between">
                                <p className="text-xs text-end text-gray-500 me-6">
                                    {showDate(item.timestamp)}
                                </p>
                                <p
                                    className={`text-xs text-start ${item.ack === 3 ? "text-blue-500" : "text-gray-500"
                                        }`}
                                >
                                    {item.ack === 1 && <FontAwesomeIcon icon={faCheck}/> }
                                    {item.ack === 2 && <FontAwesomeIcon icon={faCheckDouble}/> }
                                    {item.ack === 3 && <FontAwesomeIcon icon={faCheckDouble}/>}
                                </p>
                            </div>
                        ) : (
                            <p className="text-xs text-end text-gray-500">
                                {showDate(item.timestamp)}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChatMessage;
