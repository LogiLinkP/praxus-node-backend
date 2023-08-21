import * as socketIo from 'socket.io';
import { Server } from 'http';

let io: socketIo.Server;

export function setupIo(server: Server, options: any): socketIo.Server {
  io = new socketIo.Server(server, options);
  return io;
}

export function getIo(): socketIo.Server {
  return io;
}