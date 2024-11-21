// Vérifie si un token est présent dans le localStorage
const token = localStorage.getItem('token');

// Si un token est trouvé, redirige vers la page protégée
if (token) {
    window.location.href = 'https://rocknite-studio.github.io/login/protected.html';
}
