// src/utils/Socket.js
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8000';

const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
});

socket.on('connect', () => {
  console.log('Connected to Socket.IO server');
});

socket.on('connect_error', (error) => {
  console.error('Socket.IO connect error:', error);
});

socket.on('disconnect', () => {
  console.log('Disconnected from Socket.IO server');
});

export default socket;