const API_URL = 'https://rocknite-login.serveo.net';

// Fonction pour gérer les erreurs HTTP
function handleError(response) {
    if (!response.ok) {
        return response.json().then(data => {
            const message = data.message || `Erreur HTTP ${response.status}`;
            if (response.status === 401) {
                throw new Error('Session expirée. Veuillez vous reconnecter.');
            } else if (response.status === 403) {
                throw new Error('Accès interdit.');
            } else if (response.status === 400) {
                throw new Error(message || 'Requête invalide.');
            } else {
                throw new Error(message);
            }
        }).catch(() => {
            throw new Error('Erreur réseau ou réponse non-JSON.');
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

        if (!email || !mot_de_passe || !nom) {
            alert('Tous les champs sont requis.');
            return;
        }

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
            console.error('Erreur lors de l\'inscription:', error.message);
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

        if (!email || !mot_de_passe) {
            alert('Email et mot de passe sont requis.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/connexion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, mot_de_passe }),
            });

            const data = await handleError(response);
            if (typeof saveToken !== 'function') {
                throw new Error('saveToken n\'est pas défini. Vérifiez que token.js est chargé.');
            }
            if (!data.token || !data.name || !email) {
                throw new Error('Données de connexion incomplètes.');
            }

            console.log('Token reçu:', data.token);
            console.log('Nom reçu:', data.name);
            console.log('Email:', email);
            saveToken(data.token);
            localStorage.setItem('user_email', email);
            localStorage.setItem('user_name', data.name);
            console.log('Token sauvegardé:', localStorage.getItem('access_token'));
            console.log('Email sauvegardé:', localStorage.getItem('user_email'));
            console.log('Nom sauvegardé:', localStorage.getItem('user_name'));
            alert('Connexion réussie !');
            window.location.href = 'protected.html';
        } catch (error) {
            console.error('Erreur lors de la connexion:', error.message);
            alert(error.message);
        }
    });
}

// Gestion de la page protégée
const messageElement = document.getElementById('message');
if (messageElement) {
    if (typeof isAuthenticated !== 'function' || 
        typeof verifyToken !== 'function' || 
        typeof getToken !== 'function' || 
        typeof removeToken !== 'function') {
        console.error('Fonctions requises (isAuthenticated, verifyToken, getToken, removeToken) non définies. Vérifiez que token.js est chargé.');
        alert('Erreur de chargement des scripts. Veuillez rafraîchir la page.');
        window.location.href = 'login.html';
        return;
    }

    verifyToken().then(isValid => {
        if (!isValid) {
            console.log('Redirection vers login.html car le token est invalide ou absent');
            window.location.href = 'login.html';
        } else {
            console.log('Token valide, requête vers /protege');
            fetch(`${API_URL}/protege`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                },
            })
                .then(response => {
                    console.log('Statut de la réponse /protege:', response.status);
                    return handleError(response);
                })
                .then(data => {
                    console.log('Succès de la requête /protege:', data);
                    messageElement.textContent = data.message || 'Bienvenue !';
                    const usernameElement = document.getElementById('username');
                    const emailElement = document.getElementById('email');
                    if (usernameElement && emailElement) {
                        usernameElement.textContent = localStorage.getItem('user_name') || 'Inconnu';
                        emailElement.textContent = localStorage.getItem('user_email') || 'Inconnu';
                    } else {
                        console.warn('Éléments DOM username et/ou email introuvables dans protected.html');
                    }
                })
                .catch(error => {
                    console.error('Échec de la requête /protege:', error.message);
                    alert(error.message);
                    if (typeof removeToken === 'function') {
                        removeToken();
                        console.log('Token supprimé suite à une erreur');
                    }
                    window.location.href = 'login.html';
                });
        }
    }).catch(error => {
        console.error('Erreur lors de la vérification du token:', error);
        alert('Erreur lors de la vérification de l\'authentification.');
        window.location.href = 'login.html';
    });
}

// Gestion de la déconnexion
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        if (typeof removeToken !== 'function') {
            console.error('removeToken n\'est pas défini. Vérifiez que token.js est chargé.');
            alert('Erreur lors de la déconnexion. Veuillez rafraîchir la page.');
            return;
        }
        removeToken();
        console.log('Utilisateur déconnecté avec succès');
        alert('Déconnexion réussie.');
        window.location.href = 'login.html';
    });
}
