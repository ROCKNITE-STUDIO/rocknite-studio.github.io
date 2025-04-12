document.addEventListener('DOMContentLoaded', () => {
    const buyButton = document.querySelector('.btn');
    
    if (buyButton) {
        buyButton.addEventListener('click', (e) => {
            e.preventDefault();
            const email = localStorage.getItem('userEmail');
            const baseUrl = 'https://rocknite-studio.netlify.app';
            const gameId = 'rocknite';
            let newUrl = `${baseUrl}?id=${gameId}`;
            
            // Ajouter l'email à l'URL uniquement s'il existe
            if (email) {
                newUrl += `&email=${encodeURIComponent(email)}`;
            }
            
            window.location.href = newUrl;
        });
    }
});
