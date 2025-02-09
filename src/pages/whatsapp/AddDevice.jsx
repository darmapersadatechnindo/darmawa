import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMobileAndroidAlt, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import SupabaseClient from "../../components/config/SupabaseClient";
import socket from "../../components/config/Socket";

export default function AddDevice({getDevice}) {
    const [loading, setLoading] = useState(false)
    const owner = localStorage.getItem("username")
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();
    const onSubmit = async(data) => {
        setLoading(true);
        const dataInsert = {
            name:data.sessionId,
            owner
        }
        await SupabaseClient.Insert("device",dataInsert)
        getDevice()
        socket.emit("start", data.sessionId)
        
        reset();
        setLoading(false)
    }
    return (
        <div className="w-full  rounded-lg shadow-md p-5 flex flex-col bg-white">
            <div className="w-36 h-36 rounded-full bg-gray-300 mx-auto flex justify-center items-center text-gray-500">
                <FontAwesomeIcon icon={faMobileAndroidAlt} className="text-8xl" />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <input
                    id={'sessionId'}
                    name={'sessionId'}
                    type={'text'}
                    placeholder={"Buat Session baru"}
                    className={`w-full mt-4 bg-gray-200 px-3 py-2 border rounded-lg focus:outline-none focus:ring-none ${errors?.["sessionId"] ? "border-red-500" : "border-gray-300"
                        }`}
                    {...register("sessionId", { required: "Requored" })}
                />
                {errors?.['sessionId'] && (
                    <span className="text-red-500 text-sm">{errors['sessionId']?.message}</span>
                )}
                <button
                    type={"submit"}
                    disabled={loading}
                    className={`mt-3 w-full bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-700 hover:bg-blue-700 rounded-lg p-2 text-white font-semibold transition duration-200`}
                >
                    {loading ? "Loading..." : "Create"}
                </button>
            </form>
        </div>
    )
}