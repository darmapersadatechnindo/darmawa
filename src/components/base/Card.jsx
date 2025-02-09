export default function Card({ children, title, right }) {
    return (
        <div className="bg-white border-2 shadow-md border-gray-200 rounded-xl w-full">
            {title !== "" && (
                <div className="flex justify-between items-center border-b-2 px-4 py-3 bg-gray-50 rounded-tl-xl rounded-tr-xl border-gray-200">
                    <p className="text-lg font-semibold text-gray-900">{title}</p>
                    {right}
                </div>
            )}
            <div className="p-3">
                {children}
            </div>

        </div>
    )
}