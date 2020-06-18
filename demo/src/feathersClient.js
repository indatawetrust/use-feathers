import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';

const URL = process.env.REACT_APP_URL;

const socket = io(URL);
const feathersClient = feathers()
  .configure(socketio(socket))
  .configure(auth({
    storage: window.localStorage
  }));

export default feathersClient;
