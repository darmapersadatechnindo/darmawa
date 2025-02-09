import React, { useState } from "react";
import { useForm } from "react-hook-form";
import SupabaseClient from "../components/config/SupabaseClient";
import Toast from "../components/config/Toast";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import Input from "../components/base/Input";
import Button from '../components/base/Button'
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
        const cekUsername = await SupabaseClient.getWhere("profile", "username", data.username);
        if (cekUsername.length === 0) {
            Toast("Username tidak terdaftar", 0)
        } else {
            const row = cekUsername[0]
            const password = CryptoJS.MD5(data.password).toString();
            if (password === row.password) {
                Toast("Anda berhasil masuk", 1)
                localStorage.setItem("isLogin", true);
                localStorage.setItem("level", row.level)
                localStorage.setItem("username", data.username);
                window.location.href = "./app/dashboard"
            } else {
                Toast("Password yang anda masukan tidak sesuai", 0)
            }
        }
        setLoading(false)
    };

    console.log(localStorage.getItem("isLogin"))
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
