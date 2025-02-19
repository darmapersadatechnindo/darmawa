import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function Contact({ listContact,handleChat }) {
    return (
        <div className="flex flex-col space-y-4 max-h-screen p-2 text-white">
            <div className="flex text-white p-3 mb-3 items-center">
                <p className="me-4 cursor-pointer text-2xl" onClick={handleChat}><FontAwesomeIcon icon={faArrowLeft} /> </p>
                <p className="text-2xl font-bold">Chat baru <span className="text-xs ms-2">{listContact.length.toLocaleString("id-ID")} kontak</span></p>
            </div>
            <div className="flex-1 flex flex-col overflow-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-gray-800">
                {listContact
                    .filter(nomor => nomor.isMyContact && nomor.id.server === "c.us") // Filter kontak yang sesuai
                    .sort((a, b) => a.name.localeCompare(b.name)) // Urutkan berdasarkan nama (A-Z)
                    .map((nomor, index) => (
                        <div key={index} className="flex p-3 cursor-pointer items-center border-b border-gray-700 hover:bg-gray-700">
                            <img src="https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png" className="w-10 h-10 rounded-full object-cover me-3" />
                            <div className="flex flex-col">
                                <p>{nomor.name}</p>
                                <p className="text-sm text-gray-500">{nomor.number}</p>
                            </div>
                        </div>
                    ))}

            </div>
        </div>
    )

}