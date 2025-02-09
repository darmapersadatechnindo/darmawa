import DataTable from "../components/base/DataTabke";
import Card from '../components/base/Card'
import { useEffect, useState } from "react";
import SupabaseClient from '../components/config/SupabaseClient'
import Badge from '../components/base/Badge'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useTitleContext } from "../components/config/TitleContext";
import Modal from "../components/base/Moda";
import { useForm } from "react-hook-form";
import Toast from "../components/config/Toast";
import CryptoJS from "crypto-js";
import Button from '../components/base/Button'
import Input from "../components/base/Input";
export default function Profile() {
    const [row, setRow] = useState([])
    const [columns, setColumns] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { updateTitle, updateSubtitle } = useTitleContext();
    const [add, setAdd] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset
    } = useForm();
    const getData = async () => {
        const result = await SupabaseClient.getAll("profile", "id", true);
        setRow(result);
        if (result.length > 0) {
            const generatedColumns = Object.keys(result[0])
                .filter(key => key !== "id" && key !== "created_at" && key !== "password" && key !== "status_trx")
                .map(key => {
                    if (key === 'level') {
                        return {
                            Header: 'Hak Akses',
                            accessor: 'level',
                            Cell: ({ value }) => {
                                return value === 1 ? "Super Admin" : "Administrator"
                            },
                        };
                    }
                    if (key === 'created_at') {
                        return {
                            Header: 'Tanggal',
                            accessor: 'created_at',
                            Cell: ({ value }) => {
                                const date = new Date(value);
                                const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
                                return new Intl.DateTimeFormat('id-ID', options).format(date).replace("pukul", "");

                            },
                        };
                    }
                    return {
                        Header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the header
                        accessor: key, // Map the column to the key in the data
                    };
                });
            generatedColumns.push({
                Header: 'Aksi',
                Cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <Badge type={'warning'} handleClick={() => handleUpdate(row.original)}>
                            <FontAwesomeIcon icon={faEdit} />
                        </Badge>
                        <Badge type={'danger'} handleClick={() => handleDelete(row.original.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </Badge>
                    </div>
                ),
            });
            setColumns(generatedColumns);
        }
    };

    useEffect(() => {
        updateTitle("Data Master")
        updateSubtitle("Profile Login")
        getData();

    }, []);
    
    const closeModal = () => {
        reset();
        setIsModalOpen(false)
    }
    const onSubmit = async (data) => {
        if (data.id !== "") {
            let dataUpdate;
            if (data.password === "") {
                dataUpdate = {
                    name: data.name,
                    username: data.username,
                    level: data.level
                }
            } else {
                const password = CryptoJS.MD5(data.password).toString();
                dataUpdate = {
                    name: data.name,
                    username: data.username,
                    password,
                    level: data.level
                }
            }
            await SupabaseClient.Update("profile", dataUpdate, "id", data.id);
        } else {
            const password = CryptoJS.MD5(data.password).toString();
            const json = {
                name: data.name,
                username: data.username,
                password,
                level: data.level
            }
            await SupabaseClient.Insert("profile", json);
        }
        await getData();
        reset();
        setIsModalOpen(false)
        Toast("Data berhasil disimpan", 1);
    }
    const handleDelete = async (id) => {
        await SupabaseClient.Delete("profile", "id", id);
        await getData();
        Toast("Data berhasil dihapus", 1);
    }
    const handleUpdate = (data) => {
        setAdd(false)
        setValue("username", data.username)
        setValue("level", data.level)
        setValue("name", data.name)
        setValue("id", data.id)
        setIsModalOpen(true)
    }
    const addNew = () => {
        setAdd(true)
        setIsModalOpen(true)
    }
    return (
        <div className="">
            <Card title={'Profile User'} 
                right={<div>
                    <Button type={'primary'} label={'Tambah'} action="button" onClick={addNew}/>
                </div> }>
                <div className="overflow-x-auto max-w-100 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-900 rounded-lg">
                    <DataTable data={row} columns={columns} />
                </div>
            </Card>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <input id="id" name="id" type="hidden" {...register("id")} />
                    <Input 
                        type="text" 
                        name={'name'} 
                        label={'Nama Lengkap'} 
                        placeholder={"Nama Lengkap"} 
                        register={register} 
                        errors={errors}
                        validation={{required: "Nama Lengkap tidak boleh kosong"}}
                        />
                    <Input 
                        type="text" 
                        name={'username'} 
                        label={'Username'} 
                        placeholder={"Username"} 
                        register={register} 
                        errors={errors}
                        validation={{required: "Username tidak boleh kosong"}}
                        />
                    <Input 
                        type="password" 
                        name={'password'} 
                        label={'Password'} 
                        placeholder={"Password"} 
                        register={register} 
                        errors={errors}
                        validation={add && {required: "Password tidak boleh kosong"}}
                        />
                    {!add && <p className="text-sm text-gray-500">Jika tidak akan merubah password, biarkan password kosong</p>}
                    <div className='w-full'>
                        <label htmlFor="username" className="block mb-1 font-semibold">
                            Hak Akses
                        </label>
                        <select
                            id="level"
                            name="level"
                            className={`w-full bg-gray-50 px-3 py-2 border rounded-lg focus:outline-none focus:ring-none ${errors.level ? "border-red-500" : "border-gray-300"}`}
                            {...register("level", {
                                required: "Hak Akses tidak boleh kosong",
                            })}
                        >
                            <option value={""}>Tentukan Hak Akses</option>
                            <option value={1}>Super Admin</option>
                            <option value={0}>Administrator</option>
                        </select>
                        {errors.level && (
                            <span className="text-red-500 text-sm">{errors.level.message}</span>
                        )}
                    </div>
                    <div className="flex justify-between">
                        <div className='w-1/4'>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition duration-200"
                            >
                                {loading ? "Loading..." : "Submit"}
                            </button>
                        </div>
                        <div className='w-1/4'>
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={loading}
                                className="w-full mt-2 p-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition duration-200"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    )
}