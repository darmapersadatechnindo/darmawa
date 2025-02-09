import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTitleContext } from "../components/config/TitleContext"
import SupabaseClient from "../components/config/SupabaseClient";
import Card from "../components/base/Card";
import Toast from "../components/config/Toast";
import CryptoJS from "crypto-js";
import Badge from "../components/base/Badge";
import Input from "../components/base/Input";
import Button from "../components/base/Button";
export default function Dashboard() {
    const {register,handleSubmit,formState: { errors },reset } = useForm();
    const { updateTitle, updateSubtitle } = useTitleContext();
    const [user, settUser] = useState({})
    useEffect(() => {
        updateSubtitle("Darma WhatsApp")
        updateTitle("Dashboard")
        const getUser = async () => {
            const data = await SupabaseClient.getWhere("profile", "username", localStorage.getItem("username"));
           
            settUser(data[0])
           
        }
        getUser()
    }, [])
    const onSubmit = async (data) => {
        const password = CryptoJS.MD5(data.password).toString();
        await SupabaseClient.Update("profile",{password},"username",localStorage.getItem("username"))
        Toast("Password berhasil diperbaharui",1)
        reset();
    }
    return (
        <div className="">
            <p className="text-xl font-bold">Selamat Datang {user.name}</p>
            <div className="lg:grid lg:grid-cols-2 gap-4 mt-5">
                <Card title={"Data Profile"}>
                    <div className="flex flex-col space-y-2">
                        <p className="">Username &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : {user.username}</p>
                        <p className="">Nama Lengkap : {user.name}</p>
                        <p className="">Hak Akses &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {user.level === 1 ? "Super Admin" : "Administrator"}</p>
                    </div>
                </Card>
                <Card title={"Update Password"}>
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <Input 
                                type="password" 
                                name={'password'} 
                                placeholder={"Password baru"} 
                                label={'Update Password'} 
                                register={register} 
                                errors={errors} 
                                validation={{ required: "Password tidak boleh kosong" }}/>
                            <Button type={"primary"} label={"Submit"} action="submit"/>
                        </form>
                    </div>
                </Card>
                
            </div>
        </div>
    )
}