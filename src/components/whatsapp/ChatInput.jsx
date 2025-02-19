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
        setMessage("");
    };
    const clearFile = () => {
        setFile(null);
        setFilePreview(null);
    };
    
    return (
        <div className="p-4 bg-gray-700 flex items-center text-gray-400 space-x-3 me-2">
            <div onClick={() => fileInputRef.current.click()}>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                />
                <Icon.attachment className="w-12 h-12 text-white cursor-pointer" />
            </div>
            <textarea
                className="w-full px-3 py-2 bg-gray-600 rounded-lg text-white focus:outline-none resize-none"
                placeholder="Masukan pesan disini...."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
            />
            <div onClick={sendMessage}>
                <Icon.send className="w-16 h-12 text-white cursor-pointer" />
            </div>

        </div>
    );
}
