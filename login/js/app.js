document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();  // Empêche le comportement par défaut du formulaire

            const email = document.getElementById('email').value;
            const mot_de_passe = document.getElementById('mot_de_passe').value;
            const nom = document.getElementById('nom').value;

            fetch('https://institutis.serveo.net/inscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, mot_de_passe, nom })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur de réseau');
                }
                return response.json();
            })
            .then(data => {
                alert(data.message);
                if (data.message === 'Utilisateur créé avec succès.') {
                    window.location.href = '/login/login.html';  // Redirige vers la page de connexion après l'inscription
                }
            })
            .catch(error => {
                console.error('Erreur lors de l\'inscription:', error);
                alert('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
            });
        });
    }

    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();  // Empêche le comportement par défaut du formulaire

            const email = document.getElementById('email').value;
            const mot_de_passe = document.getElementById('mot_de_passe').value;

            fetch('https://institutis.serveo.net/connexion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, mot_de_passe })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur de réseau');
                }
                return response.json();
            })
            .then(data => {
                if (data.token) {
                    localStorage.setItem('token', data.token);  // Stocke le token dans le localStorage
                    window.location.href = '/login/protected.html';  // Redirige vers la page protégée après la connexion
                } else {
                    alert('Identifiants incorrects. Veuillez réessayer.');
                }
            })
            .catch(error => {
                console.error('Erreur lors de la connexion:', error);
                alert('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
            });
        });
    }

    const messageElement = document.getElementById('message');
    const logoutButton = document.getElementById('logout-button');
    
    if (messageElement) {
        const token = localStorage.getItem('token');

        fetch('https://institutis.serveo.net/protege', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur de réseau');
            }
            return response.json();
        })
        .then(data => {
            if (data.message) {
                messageElement.textContent = data.message;
            } else {
                messageElement.textContent = 'Erreur d\'authentification';
            }
        })
        .catch(error => {
            console.error('Erreur lors de l\'accès à la page protégée:', error);
            messageElement.textContent = 'Erreur lors de l\'accès à la page protégée.';
        });

        if (logoutButton) {
            logoutButton.addEventListener('click', function() {
                localStorage.removeItem('token');  // Supprime le token du localStorage
                window.location.href = '/login/login.html';  // Redirige vers la page de connexion
            });
        }
    }
});
