import React from 'react';

import io from 'socket.io-client';
import Game from './Screens/Game';

function App() {
  let socket = io("http://192.168.68.122:8000", {
    path:"/"
  });

  return (
    <Game socket={socket} />
  );
}

export default App;
