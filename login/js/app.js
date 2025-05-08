// js/app.js
const API_URL = 'https://rocknite-login.serveo.net';

// Fonction pour gérer les erreurs
function handleError(response) {
    if (!response.ok) {
        return response.json().then(data => {
            throw new Error(data.message || `Erreur HTTP ${response.status}`);
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
                console.log('Name received:', data.name);
                console.log('Email:', email);
                saveToken(data.token);
                localStorage.setItem('user_email', email);
                localStorage.setItem('user_name', data.name);
                console.log('Token saved in localStorage:', localStorage.getItem('access_token'));
                console.log('Email saved in localStorage:', localStorage.getItem('user_email'));
                console.log('Name saved in localStorage:', localStorage.getItem('user_name'));
                alert('Connexion réussie !');
                window.location.href = 'protected.html';
            } else {
                throw new Error('saveToken is not défini. Vérifiez token.js.');
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
        const token = localStorage.getItem('access_token');
        console.log('Checking authentication, token in localStorage:', token);
        console.log('isAuthenticated result:', isAuthenticated());
        if (!isAuthenticated()) {
            console.log('Redirecting to login.html because user is not authenticated');
            window.location.href = 'login.html';
        } else {
            console.log('User is authenticated, fetching /protege with token:', token);
            fetch(`${API_URL}/protege`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                },
            })
                .then(response => {
                    console.log('Fetch /protege response status:', response.status);
                    return handleError(response);
                })
                .then(data => {
                    console.log('Fetch /protege success:', data);
                    messageElement.textContent = data.message;
                    const usernameElement = document.getElementById('username');
                    const emailElement = document.getElementById('email');
                    if (usernameElement && emailElement) {
                        usernameElement.textContent = localStorage.getItem('user_name') || 'Inconnu';
                        emailElement.textContent = localStorage.getItem('user_email') || 'Inconnu';
                    }
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
            console.log('Token, email, and name removed on logout');
        } else {
            console.error('removeToken is not defined. Ensure token.js is loaded.');
        }
        window.location.href = 'login.html';
    });
}
