export function handleSocketEvents(socket,connectedClients) {
    socket.on('CONNECT', (data) => { //espero recibir algun tipo de id del cliente
        let newClient = {
            socketId: socket.id,
            id: data.id
        }
        connectedClients.push(newClient);
    });
  
    socket.on('event2', () => {
      // Handle event2 logic
    });
  
    // Add more socket event handlers as needed
  }