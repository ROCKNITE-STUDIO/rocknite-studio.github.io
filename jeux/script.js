async function loadGames() {
    const response = await fetch('games.json');
    const games = await response.json();

    const featuredGameDiv = document.getElementById('featured-game');
    const gameListDiv = document.getElementById('game-list');

    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = game.featured ? 'featured-card' : 'game-card';

        gameCard.innerHTML = `
            <img src="${game.image}" alt="${game.title}">
            <h2>${game.title}</h2>
            <p>by ${game.creator}</p>
            <p>Version: ${game.version}</p>
            <p class="price">${game.price}</p>
        `;

        if (game.featured) {
            featuredGameDiv.appendChild(gameCard);
        } else {
            gameListDiv.appendChild(gameCard);
        }
    });
}

document.addEventListener('DOMContentLoaded', loadGames);
