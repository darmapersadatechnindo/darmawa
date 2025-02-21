import { useState,useRef } from "react";
import Icon from "../base/Icon";
import { useTitleContext } from "../config/TitleContext";
import socket from "../config/Socket";
export default function ChatInput({ sessionId,handleFileSelect }) {
    const [message, setMessage] = useState("");
    const { userId } = useTitleContext();
    const fileInputRef = useRef(null);
    
    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };
    
    const sendMessage = () => {
        if (message.trim() === "") return;
        socket.emit("sendText", { chatId: userId, message, sessionId })
        setTimeout(() => {
            socket.emit("showChats", { userId, sessionId })
        }, 500);
        setMessage("");
    };
    const clearFile = () => {
        setFile(null);
        setFilePreview(null);
    };
    
    return (
        <div className="p-2 bg-white flex items-center text-gray-400 space-x-3">
            <div onClick={() => fileInputRef.current.click()}>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                />
                <Icon.attachment className="w-12 h-12 text-gray-500 cursor-pointer" />
            </div>
            <textarea
                className="w-full px-3 py-2 bg-gray-200 rounded-lg text-gray-700 focus:outline-none resize-none"
                placeholder="Masukan pesan disini...."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
            />
            <div onClick={sendMessage}>
                <Icon.send className="w-16 h-12 text-gray-500 cursor-pointer" />
            </div>

        </div>
    );
}
