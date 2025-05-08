// js/token.js
function saveToken(token) {
    localStorage.setItem('access_token', token);
    console.log('Token saved:', token);
}

function getToken() {
    const token = localStorage.getItem('access_token');
    console.log('getToken called, token:', token);
    return token;
}

function removeToken() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    console.log('Token, email, and name removed from localStorage');
}

function isAuthenticated() {
    const token = getToken();
    const authenticated = !!token;
    console.log('isAuthenticated called, token:', token, 'result:', authenticated);
    return authenticated;
}
