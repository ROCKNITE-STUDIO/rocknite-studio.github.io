document.addEventListener('DOMContentLoaded', () => {
    fetch('games.json')
        .then(response => response.json())
        .then(data => renderGames(data));
});

function renderGames(games) {
    const featuredGameElement = document.getElementById('featured-game');
    const gamesListElement = document.getElementById('games-list');

    // Afficher le jeu en vedette
    const featuredGame = games.find(game => game.featured);
    if (featuredGame) {
        featuredGameElement.innerHTML = `
            <a href="${featuredGame.link}">
                <div class="featured-content">
                    <img src="${featuredGame.image}" alt="${featuredGame.title}">
                    <div class="info">
                        <h2>${featuredGame.title}</h2>
                        <p>by ${featuredGame.creator}</p>
                        <span>Version: ${featuredGame.version} | ${featuredGame.price}</span>
                    </div>
                </div>
            </a>
        `;
    }

    // Afficher les autres jeux
    games.forEach(game => {
        if (!game.featured) {
            const gameCard = document.createElement('div');
            gameCard.classList.add('game-card');
            gameCard.innerHTML = `
                <a href="${game.link}">
                    <img src="${game.image}" alt="${game.title}">
                    <div class="details">
                        <h3>${game.title}</h3>
                        <p>by ${game.creator}</p>
                        <span>Version: ${game.version}</span>
                        <p class="price">${game.price}</p>
                    </div>
                </a>
            `;
            gamesListElement.appendChild(gameCard);
        }
    });
}
