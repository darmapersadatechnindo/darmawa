const Utils = {
    formatDate: (timestamp) => {
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
    },
    openMedia: (mediaUrl) => {
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
            console.error("Gagal membuka media:", mediaUrl);
        }
    },
    formatMessage: (message) => {
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
    },
    formatChat: (message, msg) => {
        if (!message) return "";

        // Bold & Italic Formatting
        let formattedMessage = message
            .replace(/\*(.*?)\*/g, "<b>$1</b>")  // Bold (*text*)
            .replace(/_(.*?)_/g, "<i>$1</i>")   // Italic (_text_)
            .replace(/\n/g, "<br>");            // Newline to <br>

        if (msg.subtype && msg.subtype === "url") {
            formattedMessage = formattedMessage.replace(
                msg.matchedText,
                `<a href="${msg.matchedText}" target="_blank" class="text-blue-500">${msg.matchedText}</a>`
            );
        }

        return formattedMessage;
    },
    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + " B";
        else if (bytes < 1024 ** 2) return (bytes / 1024).toFixed(2) + " KB";
        else if (bytes < 1024 ** 3) return (bytes / 1024 ** 2).toFixed(2) + " MB";
        else return (bytes / 1024 ** 3).toFixed(2) + " GB";
    },
    base64ToBlob : (base64, mimeType) => {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    },
    
}
export default Utils