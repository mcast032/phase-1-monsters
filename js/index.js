let currentPage = 1;
const limit = 50;

document.addEventListener('DOMContentLoaded', () => {
    createMonsterForm(); // Initialize monster creation form
    getMonsters(currentPage); // Load initial set of monsters when the page loads
    console.log("DOM fully loaded, createMonsterForm and getMonsters called");

    document.getElementById('back').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            getMonsters(currentPage);
        }
    });

    document.getElementById('forward').addEventListener('click', () => {
        currentPage++;
        getMonsters(currentPage);
    });
});

function getMonsters(page) {
    const url = `http://localhost:3000/monsters?_limit=${limit}&_page=${page}`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(monsters => {
            const monsterContainer = document.querySelector('#monster-container');
            monsterContainer.innerHTML = ''; // Clear existing content

            monsters.forEach(monster => {
                createMonsterCard(monster);
            });

            if (currentPage > 1) {
                createBackButton(); // Add "Back" button if not on first page
            }

            if (monsters.length === limit) {
                createForwardButton(); // Add "Forward" button if there are more monsters
            }
        })
        .catch(error => console.error('Error fetching monsters:', error));
}

function createMonsterCard(monster) {
    let card = document.createElement('div');
    let name = document.createElement('h2');
    let age = document.createElement('h4');
    let bio = document.createElement('p');

    name.textContent = `${monster.name}`;
    age.textContent = `Age: ${monster.age}`;
    bio.textContent = `Bio: ${monster.description}`;

    card.appendChild(name);
    card.appendChild(age);
    card.appendChild(bio);

    document.querySelector('#monster-container').appendChild(card);
}

function createMonsterForm() {
    const form = document.createElement('form');
    const nameInput = document.createElement('input');
    const ageInput = document.createElement('input');
    const descriptionInput = document.createElement('input');
    const submitButton = document.createElement('button');

    form.id = "monster-form";
    nameInput.id = "name";
    ageInput.id = "age";
    descriptionInput.id = "description";

    nameInput.placeholder = "Name...";
    ageInput.placeholder = "Age...";
    descriptionInput.placeholder = "Description...";
    submitButton.textContent = 'Create';

    form.appendChild(nameInput);
    form.appendChild(ageInput);
    form.appendChild(descriptionInput);
    form.appendChild(submitButton);

    document.getElementById('create-monster').appendChild(form);

    form.addEventListener('submit', event => {
        event.preventDefault();
        const newMonster = {
            name: nameInput.value,
            age: parseFloat(ageInput.value),
            description: descriptionInput.value
        };
        postNewMonster(newMonster);
    });
}

function postNewMonster(monster) {
    fetch('http://localhost:3000/monsters', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(monster)
    })
    .then(response => response.json())
    .then(newMonster => {
        console.log('New monster added:', newMonster);
        createMonsterCard(newMonster);
    })
    .catch(error => console.error('Error adding new monster:', error));
}

function createBackButton() {
    const backButton = document.getElementById('back');
    if (!backButton) {
        const backBtn = document.createElement('button');
        backBtn.id = 'back';
        backBtn.textContent = '<= Back';
        backBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                getMonsters(currentPage);
            }
        });
        document.body.appendChild(backBtn);
    }
}

function createForwardButton() {
    const forwardButton = document.getElementById('forward');
    if (!forwardButton) {
        const forwardBtn = document.createElement('button');
        forwardBtn.id = 'forward';
        forwardBtn.textContent = 'Forward =>';
        forwardBtn.addEventListener('click', () => {
            currentPage++;
            getMonsters(currentPage);
        });
        document.body.appendChild(forwardBtn);
    }
}
