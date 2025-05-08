// js/app.js
const API_URL = 'https://rocknite-login.serveo.net';

// Fonction pour gérer les erreurs
function handleError(response) {
    if (!response.ok) {
        return response.json().then(data => {
            throw new Error(data.message || 'Une erreur est survenue');
        });
    }
    return response.json();
}

// Gestion du formulaire d'inscription
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const mot_de_passe = document.getElementById('mot_de_passe').value;
        const nom = document.getElementById('nom').value;

        try {
            const response = await fetch(`${API_URL}/inscription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, mot_de_passe, nom }),
            });

            const data = await handleError(response);
            alert(data.message);
            window.location.href = 'login.html';
        } catch (error) {
            alert(error.message);
        }
    });
}

// Gestion du formulaire de connexion
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const mot_de_passe = document.getElementById('mot_de_passe').value;

        try {
            const response = await fetch(`${API_URL}/connexion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, mot_de_passe }),
            });

            const data = await handleError(response);
            if (typeof saveToken === 'function') {
                console.log('Token received:', data.token);
                saveToken(data.token);
                console.log('Token saved in localStorage:', localStorage.getItem('access_token'));
                alert('Connexion réussie !');
                window.location.href = 'protected.html';
            } else {
                throw new Error('saveToken is not defined. Please check token.js.');
            }
        } catch (error) {
            alert(error.message);
        }
    });
}

// Gestion de la page protégée
const messageElement = document.getElementById('message');
if (messageElement) {
    if (typeof isAuthenticated !== 'function') {
        console.error('isAuthenticated is not defined. Ensure token.js is loaded.');
        window.location.href = 'login.html';
    } else {
        console.log('Token in localStorage:', localStorage.getItem('access_token'));
        console.log('isAuthenticated:', isAuthenticated());
        if (!isAuthenticated()) {
            console.log('Redirecting to login.html because user is not authenticated');
            window.location.href = 'login.html';
        } else {
            fetch(`${API_URL}/protege`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                },
            })
                .then(handleError)
                .then(data => {
                    messageElement.textContent = data.message;
                })
                .catch(error => {
                    console.error('Fetch /protege failed:', error.message);
                    alert(error.message);
                    if (typeof removeToken === 'function') {
                        removeToken();
                        console.log('Token removed due to fetch error');
                    } else {
                        console.error('removeToken is not defined. Ensure token.js is loaded.');
                    }
                    window.location.href = 'login.html';
                });
        }
    }
}

// Gestion de la déconnexion
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        if (typeof removeToken === 'function') {
            removeToken();
            console.log('Token removed on logout');
        } else {
            console.error('removeToken is not defined. Ensure token.js is loaded.');
        }
        window.location.href = 'login.html';
    });
}
