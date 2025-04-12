document.addEventListener('DOMContentLoaded', () => {
    const buyButtons = document.querySelectorAll('.btn');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const email = localStorage.getItem('email');
            const baseUrl = 'https://rocknite-studio.netlify.app';
            const gameId = 'rocknite';
            
            let newUrl = `${baseUrl}?id=${gameId}`;
            if (email && email.trim() !== '') {
                newUrl = `${baseUrl}/${gameId}?email=${encodeURIComponent(email)}`;
            }
            
            console.log('Redirection vers :', newUrl);
            window.location.href = newUrl;
        });
    });
});
