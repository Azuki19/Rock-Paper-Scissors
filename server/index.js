const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = {
  players: [],
};

// Obtener la lista de los últimos dos jugadores
app.get("/users", (request, response) => {
  const lastTwoPlayers = db.players.slice(-2); // Selecciona los últimos dos jugadores
  response.send({ players: lastTwoPlayers });
});

// Registrar o actualizar un jugador
app.post("/user", (request, response) => {
  const { body } = request;

  // Verificar si el jugador ya existe
  const existingPlayer = db.players.find(player => player.name === body.name);

  if (existingPlayer) {
    // Actualizar el item si el jugador ya existe
    existingPlayer.item = body.item;
    return response.status(200).send(existingPlayer);
  }

  // Agregar un nuevo jugador si no existe
  db.players.push(body);
  response.status(201).send(body);
});

// Limpiar la lista de jugadores
app.delete("/users", (request, response) => {
  db.players = [];
  response.status(204).send();
});

app.listen(5050, () => {
  console.log(`Server is running on http://localhost:5050`);
});
