// Fonction pour charger les jeux depuis le fichier JSON
async function loadGames() {
    const response = await fetch('games.json');
    const games = await response.json();
    const gameList = document.getElementById('game-list');

    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        
        gameCard.innerHTML = `
            <img src="${game.image}" alt="${game.title}">
            <h2>${game.title}</h2>
            <p>by ${game.creator}</p>
            <p>Version: ${game.version}</p>
        `;
        
        gameList.appendChild(gameCard);
    });
}

// Charger les jeux au démarrage
document.addEventListener('DOMContentLoaded', loadGames);
