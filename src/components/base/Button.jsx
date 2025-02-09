import { useState } from "react"

export default function Button({ loading, label, type,action="submit",onClick}) {
    let classname;
    switch (type) {
        case "success":
            classname = "bg-green-600 disabled:cursor-not-allowed disabled:bg-green-700 hover:bg-green-700 rounded-lg"
            break;
        case "primary":
            classname = "bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-700 hover:bg-blue-700 rounded-lg"
            break;
        case "warning":
            classname = "bg-yellow-600 disabled:cursor-not-allowed disabled:bg-yellow-700 hover:bg-yellow-700 rounded-lg"
            break;
        case "danger":
            classname = "bg-red-600 disabled:cursor-not-allowed disabled:bg-red-700 hover:bg-red-700 rounded-lg"
            break;
        default:
            break;
    }
    return (
        <button
            type={action}
            disabled={loading}
            onClick={onClick}
            className={`w-full ${classname} p-2 text-white font-semibold transition duration-200`}
        >
            {loading ? "Loading..." : label}
        </button>
    )
}