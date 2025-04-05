document.addEventListener('DOMContentLoaded', function() {
    // Gestion du formulaire d'inscription
    const registerForm = document.getElementById('register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const mot_de_passe = document.getElementById('mot_de_passe').value;
            const nom = document.getElementById('nom').value;

            try {
                const response = await fetch('https://proxy.serveo.net/inscription', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, mot_de_passe, nom })
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                alert(data.message);
                if (data.message === 'Utilisateur créé avec succès.') {
                    window.location.href = '/login/login.html';
                }
            } catch (error) {
                console.error('Erreur lors de l\'inscription:', error);
                if (error.message.includes('Failed to fetch')) {
                    alert('Erreur de connexion au serveur. Vérifiez l\'URL, le réseau ou les restrictions CORS.');
                } else {
                    alert(`Erreur: ${error.message}`);
                }
            }
        });
    }

    // Gestion du formulaire de connexion
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const mot_de_passe = document.getElementById('mot_de_passe').value;

            try {
                const response = await fetch('https://proxy.serveo.net/connexion', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, mot_de_passe })
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('name', data.name);
                    window.location.href = '../point';
                } else {
                    alert('Identifiants incorrects. Veuillez réessayer.');
                }
            } catch (error) {
                console.error('Erreur lors de la connexion:', error);
                alert(`Erreur lors de la connexion: ${error.message}`);
            }
        });
    }

    // Gestion de la page protégée et déconnexion
    const messageElement = document.getElementById('message');
    const logoutButton = document.getElementById('logout-button');
    
    if (messageElement) {
        const token = localStorage.getItem('token');

        if (!token) {
            messageElement.textContent = 'Aucun token trouvé. Veuillez vous connecter.';
            return;
        }

        (async function() {
            try {
                const response = await fetch('https://proxy.serveo.net/protege', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                if (data.message) {
                    messageElement.textContent = `${data.message} (Connecté en tant que ${localStorage.getItem('name')})`;
                } else {
                    messageElement.textContent = 'Erreur d\'authentification';
                }
            } catch (error) {
                console.error('Erreur lors de l\'accès à la page protégée:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('name');
                messageElement.textContent = 'Erreur d\'accès. Token supprimé.';
            }
        })();
    }
});
