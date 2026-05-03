// LÓGICA CRM VIP
document.addEventListener('DOMContentLoaded', () => {

    const formCliente = document.getElementById('formNuevoCLiente');
    if(formCliente){
        formCliente.addEventListener('submit', (e) => {
            e.preventDefault();
            let n = document.getElementById('cNombre').value;
            let t = document.getElementById('cTelefono').value;
            let nt = document.getElementById('cNotas').value;

            DB.guardarCliente({ nombre: n, telefono: t, notas: nt, cortes_registrados: 0 });
            formCliente.reset();
            document.getElementById('modalNuevoCliente').style.display='none';
            renderearClientes();
            alert("Cliente añadido al sistema VIP de Fidelización.");
        });
    }

    renderearClientes();
});

// Función de dibujado que puede ser llamada globalmente
function renderearClientes() {
    let q = document.getElementById('buscadorCRM').value.toLowerCase();
    const caja = document.getElementById('gridClientes');
    if(!caja) return;

    caja.innerHTML = '';
    let clientes = DB.obtenerClientes();

    clientes.forEach(c => {
        // Filtrar
        if(q && !c.nombre.toLowerCase().includes(q) && !c.telefono.includes(q)) return;

        // Logica de Recompensa
        let esPremio = false;
        let pText = `${c.cortes_registrados} / 10 Cortes`;
        let pColor = 'var(--text-muted)';
        let cardBorder = 'var(--border)';

        if(c.cortes_registrados >= 10) {
            esPremio = true;
            pText = '🏆 ¡CORTE GRATIS RECLAMABLE!';
            pColor = 'orange';
            cardBorder = 'orange';
        }

        caja.innerHTML += `
            <div class="glass-panel" style="padding: 20px; border-color: ${cardBorder};">
                <h3 style="margin-bottom: 5px; font-size:1.4rem;">${c.nombre}</h3>
                <span style="color:var(--primary); font-size:0.9rem; font-weight:bold;">${c.telefono}</span>
                
                <div style="margin: 15px 0; padding:10px; background:rgba(255,255,255,0.05); border-radius:5px; border-left:2px solid var(--text-muted);">
                    <small style="color:var(--text-muted); display:block; margin-bottom:5px;">Nota del Barbero:</small>
                    <span style="font-size:0.9rem; color:#fff;">"${c.notas}"</span>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; border-top: 1px solid var(--border); padding-top:15px;">
                    <small style="color:${pColor}; font-weight:800; letter-spacing:1px;">${pText}</small>
                    ${esPremio ? `<button class="btn-danger" style="color:orange; border-color:orange;" onclick="reclamar(${c.telefono})">Reclamar</button>` : ''}
                </div>
            </div>
        `;
    });
}

// Simulacion de Reclamar Premio
function reclamar(telefono) {
    let clientes = DB.obtenerClientes();
    let idx = clientes.findIndex(c => c.telefono == telefono);
    if(idx > -1) {
        clientes[idx].cortes_registrados = 0; // Se resetea
        localStorage.setItem('nova_barber_clientes', JSON.stringify(clientes));
        alert("¡Premio de Fidelidad Cobrado! Se ha reiniciado su puntaje del Pasaporte Digital.");
        renderearClientes();
    }
}
