export default function Input({ label, name, type = "text", placeholder, register, validation, errors }) {
    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={name} className="block mb-1 font-semibold">
                    {label}
                </label>
            )}
            
            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                className={`w-full bg-gray-50 px-3 py-2 border rounded-lg focus:outline-none focus:ring-none ${
                    errors?.[name] ? "border-red-500" : "border-gray-300"
                }`}
                {...register(name, validation)} 
            />
            {errors?.[name] && (
                <span className="text-red-500 text-sm">{errors[name]?.message}</span>
            )}
        </div>
    );
}
