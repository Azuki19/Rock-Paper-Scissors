let socket = io("http://localhost:5050", { path: "/real-time" });

socket.emit("identify", "result");

let count = 0;
let interval;

document.getElementById('start-game').addEventListener('click', () => {
  socket.emit('start-game');
});

socket.on('start-countdown', () => {
  clearInterval(interval);
  count = 10;

  interval = setInterval(() => {
    const sec = document.getElementById('seconds');
    if (sec) {
      sec.textContent = count;
    }

    // Emitir el contador al servidor para que lo retransmita a los jugadores
    socket.emit('counter', count);

    count--;

    if (count < 0) {
      clearInterval(interval);
      fetchData();
      count = 0;
    }
  }, 1000);
});

// Escuchar el evento 'clear-players-list' para limpiar la pantalla
socket.on('clear-players-list', () => {
  const container = document.getElementById('data-container');
  container.innerHTML = ''; // Limpiar los datos anteriores
});

// Escuchar el nuevo evento para mostrar el nombre del jugador con item "?"
socket.on('new-player', (player) => {
  const container = document.getElementById('data-container');
  const div = document.createElement('div');
  div.className = 'item';
  div.innerHTML = `
    <p>Name: ${player.name}</p>
    <p>Chose: ${player.item}</p>
  `;
  container.appendChild(div);
});

async function fetchData() {
  renderLoadingState();
  try {
    const response = await fetch('http://localhost:5050/users');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    renderData(data);
  } catch (error) {
    console.error(error);
    renderErrorState();
  }
}

function renderErrorState() {
  const container = document.getElementById('data-container');
  container.innerHTML = '<p>Failed to load data</p>';
  console.log('Failed to load data');
}

function renderLoadingState() {
  const container = document.getElementById('data-container');
  container.innerHTML = '<p>Loading...</p>';
  console.log('Loading...');
}

function renderData(data) {
  console.log(data);

  const container = document.getElementById('data-container');
  container.innerHTML = ''; // Limpiar datos anteriores
  data.players.forEach((player) => {
    const section = document.createElement('section');
    section.className = 'item';
    section.innerHTML = `
      <p>Name: ${player.name}</p>
      <p>Chose: ${player.item}</p>
    `;
    container.appendChild(section);
  });
}


