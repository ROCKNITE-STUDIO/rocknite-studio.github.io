document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const accountLink = document.getElementById('account-link');
    const authLinks = document.getElementById('auth-links');
    const welcomeMessage = document.getElementById('welcome-message');

    // Mettre à jour l'interface en fonction du statut de connexion
    if (token) {
        fetch('https://institutis.serveo.net/protege', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                if (!response.ok) throw new Error('Erreur réseau');
                return response.json();
            })
            .then(data => {
                welcomeMessage.textContent = `Bienvenue, ${data.user.nom || 'Utilisateur'} !`;
                accountLink.innerHTML = `<a href="#" id="logout-link">Se déconnecter</a>`;
                authLinks.style.display = 'none';

                // Gérer la déconnexion
                const logoutLink = document.getElementById('logout-link');
                logoutLink.addEventListener('click', function () {
                    localStorage.removeItem('token');
                    window.location.reload();
                });
            })
            .catch(() => {
                localStorage.removeItem('token');
                window.location.reload();
            });
    } else {
        accountLink.innerHTML = `<a href="login.html">Compte</a>`;
        welcomeMessage.textContent = 'Connectez-vous pour accéder à votre compte.';
    }
});
