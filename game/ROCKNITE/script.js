document.addEventListener('DOMContentLoaded', () => {
    const buyButton = document.querySelector('.btn');
    
    if (buyButton) {
        buyButton.addEventListener('click', (e) => {
            e.preventDefault();
            const email = localStorage.getItem('userEmail') || '';
            const baseUrl = 'https://rocknite-studio.netlify.app';
            const gameId = 'rocknite';
            const newUrl = `${baseUrl}?email=${encodeURIComponent(email)}&id=${gameId}`;
            window.location.href = newUrl;
        });
    }
});
