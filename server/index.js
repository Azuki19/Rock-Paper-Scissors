const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(express.json());
app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
	path: '/real-time',
	cors: {
		origin: '*',
	},
});

httpServer.listen(5050, () => {
	console.log(`Server is running on http://localhost:${5050}`);
});

const db = {
	players: [],
};

app.get('/users', (request, response) => {
	const lastTwoPlayers = db.players.slice(-2);
	response.send({ players: lastTwoPlayers });
});

app.post('/user', (request, response) => {
	const { body } = request;
	const existingPlayer = db.players.find((player) => player.name === body.name);

	if (existingPlayer) {
		existingPlayer.item = body.item;
		return response.status(200).send(existingPlayer);
	}

	 db.players.push(body);
	response.status(201).send(body);
});

app.delete('/users', (request, response) => {
	db.players = [];
	response.status(204).send();
});

/// socket para el lab
io.on('connection', (socket) => {
	socket.on('identify', (type) => {
		if (type === 'user') {
			console.log('User connected');
		} else if (type === 'result') {
			console.log('Results connected');
		}
	});

	// Manejador del evento 'start-game'
	socket.on('start-game', () => {
		console.log('Game started');

		// Limpiar la lista de jugadores en el servidor
		db.players = [];

		// Emitir evento para limpiar la pantalla del cliente
		io.emit('clear-players-list');

		// Emitir evento para comenzar la cuenta regresiva
		io.emit('start-countdown');
	});

	socket.on('counter', (count) => {
		io.emit('update-counter', count);
	});

	// Escuchar el evento "play" que envía el cliente player
	socket.on('play', (player) => {
		console.log(`Player ${player.name} has joined with item: ${player.item}`);
		io.emit('new-player', { name: player.name, item: '?' }); // Enviar a todos los clientes
	});
});
