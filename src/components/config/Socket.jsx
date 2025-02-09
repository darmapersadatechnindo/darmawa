import { io } from 'socket.io-client';

// Ganti URL ini dengan alamat server Anda
//const SOCKET_SERVER_URL = 'https://wa.darmasoft.biz.id:6969';
const SOCKET_SERVER_URL = 'http://localhost:3000';

const socket = io(SOCKET_SERVER_URL);

export default socket;
