// SISTEMA DE SEGURIDAD Y AUTENTICACIÓN REAL
document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('loginForm');
    if(!loginForm) return; // Si no estoy en login.html, ignorar

    // Si ya tiene sesion activa, lo tiramos al sistema de una vez
    if(sessionStorage.getItem('nova_session') === 'active') {
        window.location.href = 'index.html';
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pin = document.getElementById('userPin').value;
        const errMsg = document.getElementById('errorMsg');

        // Emulando una tabla de usuarios segura (El pin es 0000 para el Demo Administrador)
        if(pin === '0000') {
            sessionStorage.setItem('nova_session', 'active');
            sessionStorage.setItem('nova_user_role', 'admin');
            sessionStorage.setItem('nova_user_name', 'Admin Dueño');
            window.location.href = 'index.html';
        } else {
            errMsg.style.display = 'block';
        }
    });

});

// Función Global de Cierre de Sesión (Llamada desde el Dashboard)
function cerrarSesion() {
    sessionStorage.removeItem('nova_session');
    sessionStorage.removeItem('nova_user_role');
    sessionStorage.removeItem('nova_user_name');
    window.location.href = 'login.html';
}

// Bloqueo de intrusos en el Sistema (Si entran directo a index.html sin login)
function verificarSeguridad() {
    if(sessionStorage.getItem('nova_session') !== 'active') {
        window.location.href = 'login.html';
    }
}
