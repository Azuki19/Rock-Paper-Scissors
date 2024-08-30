	let socket = io("http://localhost:5050", { path: "/real-time" });

	document.getElementById('player-form').addEventListener('submit', createUser);

	document.querySelectorAll('.selectable-item').forEach((item) => {
		item.addEventListener('click', function () {
			this.previousElementSibling.checked = true;
		});
	});

	socket.emit("identify", "user");

	socket.on('update-counter', (count) => {
		const counterElement = document.getElementById('counter');
		if (counterElement) {
			counterElement.textContent = count;
		}
	});

	async function createUser(event) {
		event.preventDefault();
		renderLoadingState();

		try {
			const name = document.getElementById('name').value;
			const item = document.querySelector('input[name="item"]:checked').value;

			const player = {
				name: name,
				item: item,
			};

			const response = await fetch('http://localhost:5050/user', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(player),
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			renderData(player);

			// Emitir el evento "play" al servidor con el nombre y el item
			socket.emit('play', player);

			// Ocultar el formulario después de crear el usuario
			document.getElementById('player-form').style.display = 'none';

		} catch (error) {
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
		const section = document.createElement('section');
		section.className = 'item';
		section.innerHTML = `Player created! ${data.name} chose ${data.item}`;
		container.appendChild(section);
	}

	// Al inicio, deshabilitar el formulario y mostrar el mensaje de espera
	document.getElementById('player-form').style.display = 'none';
	document.getElementById('waiting-message').style.display = 'block';

	socket.on('start-countdown', () => {
		// Habilitar el formulario y ocultar el mensaje de espera cuando comience el juego
		document.getElementById('player-form').style.display = 'block';
		document.getElementById('waiting-message').style.display = 'none';

		// Mostrar el contador
		document.getElementById('counter').style.display = 'block';


	});

