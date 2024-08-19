document.getElementById('player-form').addEventListener('submit', createUser);

document.querySelectorAll('.selectable-item').forEach((item) => {
	item.addEventListener('click', function () {
		this.previousElementSibling.checked = true;
	});
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
	section.innerHTML = `Player created!
  ${data.name} chose ${data.item}`;
	container.appendChild(section);
}
