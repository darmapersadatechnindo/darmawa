import { faCheck, faFileAlt, faPaperclip, faPaperPlane, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import socket from "../../components/config/Socket";
import Icon from "../../components/base/Icon";
import Modal from '../../components/base/Moda'
export default function RightChat({ chatId, sessionId, isFirstLoad, setIsFirstLoad }) {
    const [name, setName] = useState("");
    const [img, setImg] = useState("");
    const [chats, setChats] = useState([]);
    const media = useRef(new Map());
    const chatEndRef = useRef(null);


    const formatDate = (timestamp) => {
        const now = new Date();
        const timestampDate = new Date(timestamp * 1000);
        const today = new Date(now.setHours(0, 0, 0, 0));
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const dd = timestampDate.getDate().toString().padStart(2, "0");
        const mm = (timestampDate.getMonth() + 1).toString().padStart(2, "0");
        const yy = timestampDate.getFullYear().toString().slice(-2);

        if (timestampDate.toDateString() === new Date().toDateString()) {
            return timestampDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });
        }
        if (timestampDate.toDateString() === yesterday.toDateString()) {
            return "Kemarin";
        }
        return `${dd}/${mm}/${yy}`;
    };

    useEffect(() => {
        socket.emit("getcontact", { chatId, sessionId });
    }, [chatId, sessionId]);

    useEffect(() => {
        const handleSocketEvent = (data) => {
            if (data.event === "getcontact") {
                const updatedChats = data.data.chats.map(chat => ({
                    ...chat,
                    mediaUrl: media.current.get(chat.id._serialized) || null
                }));
                setChats(updatedChats);
                setName(data.data.name || data.data.number);
                setImg(data.data.foto || "https://www.nicepng.com/png/detail/128-1280406_view-user-icon-png-user-circle-icon-png.png");

                updatedChats.forEach((chat) => {
                    if (chat.hasMedia && !media.current.has(chat.id._serialized)) {
                        socket.emit("getMessage", { messageId: chat.id._serialized, sessionId });
                        media.current.set(chat.id._serialized, null);
                    }
                });
            }
            if (data.event === "getMessage") {
                const mediaFile = data.data.media;
                if (mediaFile) {
                    const mediaUrl = `data:${mediaFile.mimetype};base64,${mediaFile.data}`;
                    media.current.set(data.data.messageId, mediaUrl);
                    setChats((prevChats) =>
                        prevChats.map((chat) =>
                            chat.id._serialized === data.data.messageId
                                ? { ...chat, mediaUrl } // **Tambahkan mediaUrl ke objek chat**
                                : chat
                        )
                    );
                }
            }
            if (data.event === "message" && data.session === sessionId) {
                if (data.data._data.id.remote === chatId) {
                    setTimeout(() => {
                        const sendSeen = {
                            chatId: data.data._data.id.remote,
                            sessionId: data.session
                        }
                        socket.emit('sendSeen', sendSeen)
                        socket.emit("getcontact", sendSeen);
                    }, 500);
                }
            }
            if (data.event === "message_revoke_me" && data.session === sessionId) {
                if (data.data.message._data.id.remote === chatId) {
                    setTimeout(() => {
                        const sendSeen = {
                            chatId: data.data._data.id.remote,
                            sessionId: data.session
                        }
                        socket.emit('sendSeen', sendSeen)
                        socket.emit("getcontact", sendSeen);
                    }, 500);
                }
            }
            if (data.event === "message_revoke_everyone" && data.session === sessionId) {
                if (data.data.message._data.id.remote === chatId) {
                    setTimeout(() => {
                        const sendSeen = {
                            chatId: data.data._data.id.remote,
                            sessionId: data.session
                        }
                        socket.emit('sendSeen', sendSeen)
                        socket.emit("getcontact", sendSeen);
                    }, 500);
                }
            }
            if (data.event === "message_ciphertext" && data.session === sessionId) {
                if (data.data.message._data.id.remote === chatId) {
                    setTimeout(() => {
                        const sendSeen = {
                            chatId: data.data._data.id.remote,
                            sessionId: data.session
                        }
                        socket.emit('sendSeen', sendSeen)
                        socket.emit("getcontact", sendSeen);
                    }, 500);
                }
            }
            if (data.event === "message_edit" && data.session === sessionId) {
                if (data.data.message._data.id.remote === chatId) {
                    setTimeout(() => {
                        const sendSeen = {
                            chatId: data.data._data.id.remote,
                            sessionId: data.session
                        }
                        socket.emit('sendSeen', sendSeen)
                        socket.emit("getcontact", sendSeen);
                    }, 500);
                }
            }
            if (data.event === "message_reaction" && data.session === sessionId) {
                if (data.data.message._data.id.remote === chatId) {
                    setTimeout(() => {
                        const sendSeen = {
                            chatId: data.data._data.id.remote,
                            sessionId: data.session
                        }
                        socket.emit('sendSeen', sendSeen)
                        socket.emit("getcontact", sendSeen);
                    }, 500);
                }
            }
            if (data.event === "message_create" && data.session === sessionId) {

                if (data.data.message._data.id.remote === chatId) {
                    setTimeout(() => {
                        const sendSeen = {
                            chatId: data.data.message._data.id.remote,
                            sessionId: data.session
                        }
                        socket.emit('sendSeen', sendSeen)
                        socket.emit("getcontact", sendSeen);
                    }, 500);
                }
            }
            if (data.event === "message_ack" && data.session === sessionId) {

                if (data.data.message._data.id.remote === chatId) {
                    setTimeout(() => {
                        const sendSeen = {
                            chatId: data.data.message._data.id.remote,
                            sessionId: data.session
                        }
                        socket.emit('sendSeen', sendSeen)
                        socket.emit("getcontact", sendSeen);
                    }, 500);
                }
            }
            if (data.event === "message" && data.session === sessionId) {
                if (data.data._data.id.remote === chatId) {
                    setTimeout(() => {
                        const sendSeen = {
                            chatId: data.data._data.id.remote,
                            sessionId: data.session
                        }
                        socket.emit('sendSeen', sendSeen)
                        socket.emit("getcontact", sendSeen);
                    }, 500);
                }
            }
        };

        socket.on("waClient", handleSocketEvent);
        return () => {
            socket.off("waClient", handleSocketEvent);
        };
    }, []);

    useEffect(() => {
        if (isFirstLoad && chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
            setIsFirstLoad(false);
        }
        console.log(chats)
    }, [chats, chatId, sessionId]);

    const openMedia = (mediaUrl) => {
        try {
            const [header, base64Data] = mediaUrl.split(",");
            const mimeType = header.match(/:(.*?);/)[1]; // Ambil MIME type dari data URL

            const byteCharacters = atob(base64Data);
            const byteNumbers = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const blob = new Blob([byteNumbers], { type: mimeType });
            const blobUrl = URL.createObjectURL(blob);

            window.open(blobUrl, "_blank");

            // Bebaskan memori setelah beberapa detik
            setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
        } catch (error) {
            console.error("Gagal membuka media:", error);
        }
    };
    const formatMessage = (message, links) => {
        if (!message) return "";

        // Bold & Italic Formatting
        let formattedMessage = message
            .replace(/\*(.*?)\*/g, "<b>$1</b>")  // Bold (*text*)
            .replace(/_(.*?)_/g, "<i>$1</i>")   // Italic (_text_)
            .replace(/\n/g, "<br>");            // Newline to <br>

        // Tambahkan link jika ada links[0].link
        if (links?.length > 0) {
            links.map((url) => {
                formattedMessage = formattedMessage.replace(
                    url.link,
                    `<a href="${url.link}" target="_blank" class="text-blue-500">${url.link}</a>`
                );
            })
        }

        return formattedMessage;
    };
    const [pesan, setPesan] = useState("")
    const handleSenText = () => {
        socket.emit("sendText", { chatId, message: pesan, sessionId })
        setPesan("")
        setTimeout(() => {
            const sendSeen = { chatId, sessionId }
            socket.emit('sendSeen', sendSeen)
            socket.emit("getcontact", sendSeen);
        }, 500);
    }
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(false)

    const handleFileSelect = (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);

        // **Tampilkan preview sesuai tipe file**
        if (selectedFile.type.startsWith("image/")) {
            setFilePreview(URL.createObjectURL(selectedFile));
        } else if (selectedFile.type.startsWith("video/")) {
            setFilePreview(URL.createObjectURL(selectedFile));
        } else if (selectedFile.type.startsWith("audio/")) {
            setFilePreview(null); // Tidak ada pratinjau untuk audio
        } else {
            setFilePreview(null); // Tidak ada pratinjau untuk dokumen lain
        }
        setPreview(true)
    };

    // **Fungsi menghapus file yang dipilih**
    const clearFile = () => {
        setFile(null);
        setFilePreview(null);
    };
    const handleSendMessage = () => {
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const base64Data = reader.result.split(",")[1];
                const mediaData = {
                    chatId,
                    sessionId,
                    file: {
                        data: base64Data,
                        mimetype: file.type,
                        filename: file.name,
                    },
                    caption: pesan,
                };

                socket.emit("sendMedia", mediaData);
                clearFile();
                setPesan("");
            };
        }
        setTimeout(() => {
            const sendSeen = { chatId, sessionId }
            socket.emit('sendSeen', sendSeen)
            socket.emit("getcontact", sendSeen);
        }, 500);
        setPreview(false)
    };
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + " B";
        else if (bytes < 1024 ** 2) return (bytes / 1024).toFixed(2) + " KB";
        else if (bytes < 1024 ** 3) return (bytes / 1024 ** 2).toFixed(2) + " MB";
        else return (bytes / 1024 ** 3).toFixed(2) + " GB";
    }
    return (
        <div className="w-2/3 bg-white flex flex-col shadow-md max-h-[620px]">
            <div className="flex p-3 items-center">
                <img src={img || "https://www.nicepng.com/png/detail/128-1280406_view-user-icon-png-user-circle-icon-png.png"} className="h-10 w-10 rounded-full" />
                <div className="ms-3">
                    <p className="font-bold">{name}</p>
                </div>
            </div>
            <div className="flex-1 bg-gray-100 text-sm p-4 overflow-auto no-scrollbar ">
                {chats.length > 0 &&
                    chats.map((msg, index) => (
                        <div
                            key={index}
                            ref={index === chats.length - 1 ? chatEndRef : null}
                            className={`flex ${msg.fromMe ? "justify-end" : "justify-start"} mb-3`}>
                            <div className={`${msg.fromMe ? "bg-green-100" : "bg-white"} p-1 px-2 rounded-lg w-auto flex flex-col  max-w-[400px] `}>
                                {msg.hasMedia && (
                                    <div>
                                        {!media.current.has(msg.id._serialized) ? (
                                            <p>Memuat media ...</p>
                                        ) : (
                                            <div className="max-w-[400px]">
                                                {msg.type === "image" && msg.mediaUrl !== null && (
                                                    <img
                                                        src={msg.mediaUrl}
                                                        alt="Media"
                                                        className="w-full h-auto rounded-lg mb-2 cursor-pointer"
                                                        onClick={() => openMedia(msg.mediaUrl)}
                                                    />
                                                )}
                                                {msg.type === "sticker" && (
                                                    <img
                                                        src={msg.mediaUrl}
                                                        alt="Media"
                                                        className="w-full h-32 rounded-lg mb-2 cursor-pointer"
                                                    />
                                                )}
                                                {msg.type === "video" && (
                                                    <video
                                                        controls
                                                        src={msg.mediaUrl}
                                                        className="w-full max-h-64 rounded-lg mb-2"
                                                        onClick={() => openMedia(msg.mediaUrl)}
                                                    />
                                                )}
                                                {msg.type === "audio" && (
                                                    <audio
                                                        controls
                                                        src={msg.mediaUrl}
                                                        className="w-full mb-2"
                                                        onClick={() => openMedia(msg.mediaUrl)}
                                                    />
                                                )}
                                                {msg.type === "document" && (
                                                    <div className="cursor-pointer " onClick={() => openMedia(msg.mediaUrl)}>
                                                        {msg._data.mimetype === "application/pdf" ? (
                                                            <div className="flex mb-2 items-center space-x-3 text-sm p-2 bg-green-200 rounded-md">
                                                                <iframe
                                                                    src={msg.mediaUrl}
                                                                    className="w-full h-50 rounded-lg"
                                                                    title="Preview PDF"
                                                                ></iframe>
                                                            </div>

                                                        ) : (
                                                            <div className="flex mb-2 items-center space-x-3 text-sm p-2 bg-green-200 rounded-md">
                                                                <FontAwesomeIcon icon={faFileAlt} className="text-2xl text-blue-500" />
                                                                <div>
                                                                    <p className="text-sm">{msg._data.filename}</p>
                                                                    <p className="text-xs text-gray-400">{formatFileSize(msg._data.size)}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/* Tampilkan teks pesan */}
                                {msg.links.length > 0 && msg.links.map((items, index) => (
                                    <a href={msg._data.matchedText || items.link} key={index} target="_blank">
                                        <div className="bg-green-200 text-sm rounded-lg mb-2 max-w-[400px]">
                                            {msg._data.thumbnail && <p className="text-xs">
                                                <div
                                                    className="w-full h-[200px] rounded-tl-lg rounded-tr-lg bg-cover bg-center"
                                                    style={{ backgroundImage: `url(data:image/jpeg;base64,${msg._data.thumbnail})` }}
                                                ></div>
                                            </p>}
                                            <div className="px-3 py-2">
                                                {msg.title ? <p className="text-xs m-0">
                                                    {msg.title}
                                                </p> : <p className="text-xs m-0">
                                                    {items.link}
                                                </p>}
                                                {msg.description && <p className="text-[10px] text-gray-500 m-0">
                                                    {msg.description}
                                                </p>}
                                            </div>
                                        </div>
                                    </a>

                                ))}
                                {/* <p>{formatMessage(msg.body)}</p> */}
                                <span dangerouslySetInnerHTML={{ __html: formatMessage(msg.body, msg.links) }} />

                                <div className={`flex items-center ${msg.fromMe ? "justify-end" : "justify-start"}`}>
                                    <p className={`text-xs ${msg.fromMe ? "text-start" : "text-end w-full"} text-gray-500`}>
                                        {formatDate(msg.timestamp)}
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
                    ))}
            </div>
            <div className="flex p-4 items-center space-x-3">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                />
                <div className="cursor-pointer" onClick={() => fileInputRef.current.click()}>
                    <FontAwesomeIcon icon={faPaperclip} className="text-2xl" />
                </div>
                <div className="w-full">
                    <input
                        type="text"
                        placeholder="Pencarian Chat ..."
                        value={pesan}
                        onChange={(e) => setPesan(e.target.value)}
                        className="w-full bg-gray-50 px-3 py-2 border rounded-lg focus:outline-none border-gray-100" />
                </div>
                <div className="cursor-pointer" onClick={() => handleSenText()}>
                    <FontAwesomeIcon icon={faPaperPlane} className="text-3xl text-blue-500" />
                </div>
            </div>
            {file && <Modal isOpen={preview} >
                <div>
                    <div className="mb-2 relative">
                        <button
                            className="absolute top-2 right-2 text-red-500"
                            onClick={clearFile}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>

                        {file.type.startsWith("image/") && (
                            <img src={filePreview} alt="Preview" className="max-h-50 mx-auto rounded-lg" />
                        )}

                        {file.type.startsWith("video/") && (
                            <video controls src={filePreview} className="max-h-50 mx-auto rounded-lg" />
                        )}

                        {file.type.startsWith("audio/") && (
                            <p className="text-sm text-gray-700">Audio: {file.name}</p>
                        )}

                        {!file.type.startsWith("image/") &&
                            !file.type.startsWith("video/") &&
                            !file.type.startsWith("audio/") && (
                                <p className="text-sm text-gray-700">Dokumen: {file.name}</p>
                            )}
                    </div>
                    <div className="flex space-x-5 mt-4 items-center bg-gray-50 p-3 rounded-lg">
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="Tmbahkan Keterangan disini..."
                                value={pesan}
                                onChange={(e) => setPesan(e.target.value)}
                                className="w-full bg-white px-3 py-2 border rounded-lg focus:outline-none border-gray-200" />
                        </div>
                        <div className="cursor-pointer" onClick={() => handleSendMessage()}>
                            <FontAwesomeIcon icon={faPaperPlane} className="text-3xl text-blue-500" />
                        </div>
                    </div>
                </div>
            </Modal>}
        </div>
    );
}
