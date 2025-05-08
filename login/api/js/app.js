document.addEventListener('DOMContentLoaded', function() {
    // Helper function to get query parameters from URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Gestion du formulaire d'inscription
    const registerForm = document.getElementById('register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const email =  const email = document.getElementById('email').value;
            const mot_de_passe = document.getElementById('mot_de_passe').value;
            const nom = document.getElementById('nom').value;

            try {
                const response = await fetch('https://rocknite-login.serveo.net/inscription', {
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
                    window.location.href = 'login.html';
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
                const loginResponse = await fetch('https://rocknite-login.serveo.net/connexion', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, mot_de_passe })
                });

                if (!loginResponse.ok) {
                    throw new Error(`Erreur HTTP: ${loginResponse.status} ${loginResponse.statusText}`);
                }

                const loginData = await loginResponse.json();
                if (loginData.token) {
                    localStorage.setItem('token', loginData.token);
                    localStorage.setItem('name', loginData.name);

                    // Fetch additional user data from /profile
                    const profileResponse = await fetch('https://rocknite-login.serveo.net/profile', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${loginData.token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!profileResponse.ok) {
                        throw new Error(`Erreur HTTP: ${profileResponse.status} ${profileResponse.statusText}`);
                    }

                    const profileData = await profileResponse.json();

                    // Check for redirect-api parameter
                    const redirectApi = getQueryParam('redirect-api');
                    if (redirectApi) {
                        // Construct redirect URL with query parameters
                        const redirectUrl = new URL(redirectApi);
                        redirectUrl.searchParams.append('email', profileData.email);
                        redirectUrl.searchParams.append('token', loginData.token);
                        redirectUrl.searchParams.append('username', profileData.name);
                        redirectUrl.searchParams.append('argent', profileData.argent);
                        redirectUrl.searchParams.append('jeux_possedes', JSON.stringify(profileData.jeux_possedes));

                        window.location.href = redirectUrl.toString();
                    } else {
                        // Default redirect if no redirect-api parameter
                        window.location.href = 'protected.html';
                    }
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
                const response = await fetch('https://rocknite-login.serveo.net/protege', {
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
