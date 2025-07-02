function saveToken(token) {
    if (!token) {
        console.error('Aucun token fourni à saveToken');
        return;
    }
    localStorage.setItem('access_token', token);
    console.log('Token sauvegardé:', token);
}

function getToken() {
    const token = localStorage.getItem('access_token');
    console.log('getToken appelé, token:', token);
    return token;
}

function removeToken() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    console.log('Token, email, et nom supprimés de localStorage');
}

function isAuthenticated() {
    const token = getToken();
    const authenticated = !!token;
    console.log('isAuthenticated appelé, token:', token, 'résultat:', authenticated);
    return authenticated;
}

async function verifyToken() {
    const token = getToken();
    if (!token) {
        console.log('Aucun token trouvé dans localStorage');
        return false;
    }

    try {
        const response = await fetch(`${API_URL}/protege`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.ok) {
            console.log('Token valide');
            return true;
        } else {
            console.log('Token invalide ou expiré, statut:', response.status);
            return false;
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        return false;
    }
}
