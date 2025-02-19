export default function Info() {
    return (
        <div className="flex flex-col text-white p-5 text-sm">
            <p className="text-xl text-center font-bold mb-3">Darma WhatsApp 1.0.0</p>
            <p className="my-1">Aplikasi WhatsApp Gateway yang dikembangkan oleh <b className="text-green-500">PT Darma Persada Technindo</b> yang merupakan startup IT berpengalaman di dunia software semenjak 2010 lalu.</p>
            <p className="my-1">Panel WhatsApp pertama di Indonesia dengan Realtime Chat langsung terhubung ke wahstapp dengan primary debice WhatsApp web</p>
            <p className="my-1">Pada versi 1.0.0 ini kami baru mengembangkan realtime chat, namun kami akan senantiasa mengembangkan aplikasi ini, untuk berbagi fitur lainnya</p>

            <p className="text-xl font-bold mt-6 mb-2">Hotline</p>
            <div className="flex items-center">
                <img
                    src="https://media.licdn.com/dms/image/v2/C5103AQEOhnRZDDUtzg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1542327384213?e=2147483647&v=beta&t=Nt0qKE4WtTQCcdQVJiQBhyTmUDi63tsRER3lYzxJU3U"
                    className="h-14 w-14 rounded-full object-cover me-4"
                />
                <div>
                    <p className="my-0 text-xl font-bold">Deni Darmayana</p>
                    <p className="my-0">6281220729369</p>
                </div>
            </div>

        </div>
    )
}