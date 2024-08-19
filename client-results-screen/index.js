let count = 0;

const interval = setInterval(() => {
	const sec = document.getElementById('seconds');

	if (sec) {
		sec.textContent = count;
	}

	count++;

	if (count === 10) {
		fetchData();
		count = 0;
	}
}, 1000);

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

async function clearPlayersList() {
	try {
		await fetch('http://localhost:5050/users', { method: 'DELETE' });
		renderData({ players: [] }); // Limpia la pantalla
		console.log('Player list cleared');
	} catch (error) {
		console.error('Failed to clear the list', error);
	}
}

function renderErrorState() {
	const container = document.getElementById('data-container');
	container.innerHTML = ''; // Limpiar datos anteriores
	container.innerHTML = '<p>Failed to load data</p>';
	console.log('Failed to load data');
}

function renderLoadingState() {
	const container = document.getElementById('data-container');
	container.innerHTML = ''; // Limpiar datos anteriores
	container.innerHTML = '<p>Loading...</p>';
	console.log('Loading...');
}

function renderData(data) {
	const container = document.getElementById('data-container');
	container.innerHTML = ''; // Limpiar datos anteriores

	if (data.players.length > 0) {
		data.players.forEach((player) => {
			const div = document.createElement('div');
			div.className = 'item';

			let itemImage;
			switch (player.item) {
				case 'Rock':
					itemImage = 'https://www.pngall.com/wp-content/uploads/5/Stone-PNG-High-Quality-Image.png';
					break;
				case 'Paper':
					itemImage =
						'https://static.vecteezy.com/system/resources/previews/009/340/335/non_2x/white-crumpled-paper-balls-for-design-element-png.png';
					break;
				case 'Scissors':
					itemImage = 'https://pngimg.com/d/scissors_PNG10.png';
					break;
			}

			// Mostrar la imagen del ítem, el nombre y la opción elegida por el jugador
			div.innerHTML = `
        <p>Name: ${player.name}</p>
        <p>Chose: ${player.item}</p>
        <img src="${itemImage}" alt="${player.item}" style="width: 100px; height: auto;" />
      `;

			container.appendChild(div);
		});
	} else {
		container.innerHTML = '<p>No players found</p>';
	}
}
