document.addEventListener('DOMContentLoaded', () => {
    const buyButton = document.querySelector('.btn');
    
    if (buyButton) {
        buyButton.addEventListener('click', (e) => {
            e.preventDefault();
            const email = localStorage.getItem('email'); // Récupérer l'email du localStorage
            const baseUrl = 'https://rocknite-studio.netlify.app/buy.html';
            const gameId = 'rocknite';
            
            // Construire l'URL avec l'ID
            let newUrl = `${baseUrl}?id=${gameId}`;
            
            // Ajouter l'email seulement s'il existe et n'est pas vide
            if (email && email.trim() !== '') {
                newUrl = `${baseUrl}?id=${gameId}&email=${encodeURIComponent(email)}`;
            }
            
            console.log('Redirection vers :', newUrl); // Pour déboguer
            window.location.href = newUrl;
        });
    }
});
