import { io } from 'socket.io-client';

// Ganti URL ini dengan alamat server Anda
//const SOCKET_SERVER_URL = 'http://185.250.38.224:8000';
//const SOCKET_SERVER_URL = 'http://103.79.131.45:3000';
const SOCKET_SERVER_URL = 'http://localhost:3000';

const socket = io(SOCKET_SERVER_URL);

export default socket;
