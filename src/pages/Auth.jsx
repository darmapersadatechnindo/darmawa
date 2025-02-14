import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Toast from "../components/config/Toast";
import { useNavigate } from "react-router-dom";
import Input from "../components/base/Input";
import Button from '../components/base/Button'
import socket from "../components/config/Socket";
export default function Auth() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true)
        if (data.username === "admin" && data.password == "admin") {
                    localStorage.setItem("isLogin", true);
                    localStorage.setItem("level", "owner")
                    localStorage.setItem("username", "admin");
                    localStorage.setItem("ownerId", 1);
                    window.location.href = "./app/dashboard"
        }
        //socket.emit("login", { username: data.username, password: data.password });
        // socket.on("login", (response) => {
        //     setLoading(false);
        //     if (response.success) {
        //         Toast(response.message, 1)
        //         localStorage.setItem("isLogin", true);
        //         localStorage.setItem("level", response.data.role)
        //         localStorage.setItem("username", response.data.username);
        //         localStorage.setItem("ownerId", response.data.userId);
        //         window.location.href = "./app/dashboard"

        //     } else {
        //         Toast(response.message, 0)
        //     }
        //    setLoading(false)
        //});
    };

    return (
        <div className="h-screen w-full bg-gray-200 text-black flex flex-col justify-center items-center px-5">
            <div className="bg-gray-50 border-2 border-gray-300 p-6 rounded-xl lg:w-1/4 w-full">
                <div className="flex justify-center items-center mb-5">
                    <img src="/WhatsApp.png" alt="Japri Pay Nusantara" className="h-12" />
                    <p className="text-2xl ms-2 font-bold">Darma WhatsApp</p>
                </div>


                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Input
                        label="Username"
                        name="username"
                        placeholder="Username"
                        register={register}
                        validation={{ required: "Username tidak boleh kosong" }}
                        errors={errors}
                    />
                    <Input
                        type="password"
                        label="Password"
                        name="password"
                        placeholder="Password"
                        register={register}
                        validation={{ required: "Password tidak boleh kosong" }}
                        errors={errors}
                    />

                    <Button label={"Submit"} loading={loading} type={'success'} />
                </form>
            </div>
        </div>
    );
}
