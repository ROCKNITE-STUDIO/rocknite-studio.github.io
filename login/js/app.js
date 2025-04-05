document.addEventListener('DOMContentLoaded', function() {
    // Gestion du formulaire d'inscription
    const registerForm = document.getElementById('register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Empêche la soumission par défaut

            const email = document.getElementById('email').value;
            const mot_de_passe = document.getElementById('mot_de_passe').value;
            const nom = document.getElementById('nom').value;

            try {
                const response = await fetch('https://brown-goat-85.telebit.io/rocknite-login/inscription', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Ajoutez ceci temporairement si vous testez localement (nécessite serveur compatible)
                        'Access-Control-Allow-Origin': '*' 
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
                const response = await fetch('https://brown-goat-85.telebit.io/rocknite-login/connexion', {
                    method: 'POST',
                    mode: 'no-cors',
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
                    localStorage.setItem('name', data.name); // Note : 'name' au lieu de 'nom' pour cohérence avec le serveur
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
                const response = await fetch('https://brown-goat-85.telebit.io/rocknite-login/protege', {
                    method: 'GET',
                    mode: 'no-cors',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                if (data.message) {
                    // Correction : 'nom' -> 'name' pour cohérence avec localStorage.setItem
                    messageElement.textContent = `${data.message} (Connecté en tant que ${localStorage.getItem('name')})`;
                } else {
                    messageElement.textContent = 'Erreur d\'authentification';
                }
            } catch (error) {
                console.error('Erreur lors de l\'accès à la page protégée:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('name'); // Correction : 'nom' -> 'name'
                messageElement.textContent = 'Erreur d\'accès. Token supprimé.';
            }
        })();

        if (logoutButton) {
            logoutButton.addEventListener('click', function() {
                localStorage.removeItem('token');
                localStorage.removeItem('name'); // Correction : 'nom' -> 'name'
                window.location.href = '/covoitealps/profile/login/index.html';
            });
        }
    }
});
