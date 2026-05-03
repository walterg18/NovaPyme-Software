// CONTROLADOR LÓGICO DE INVENTARIO

document.addEventListener('DOMContentLoaded', () => {

    function cargarSelect() {
        const selectProd = document.getElementById('inputProductoReab');
        if(!selectProd) return;
        
        selectProd.innerHTML = '<option value="">Seleccione...</option>';
        let stock = DB.obtenerInventario();
        stock.forEach(item => {
            selectProd.innerHTML += `<option value="${item.id}">${item.nombre}</option>`;
        });
    }

    function actualizarPantallaStock() {
        const tabla = document.getElementById('tablaDeInventario');
        if(!tabla) return;

        tabla.innerHTML = '';
        let stock = DB.obtenerInventario();

        stock.forEach(item => {
            let isCritycal = item.stock <= item.critico;
            let badge = isCritycal 
                ? '<span style="background:rgba(255,51,102,0.2); color:var(--secondary); padding:4px 8px; border-radius:5px; font-weight:bold; font-size:0.8rem;">⚠️ Comprar Urgente</span>'
                : '<span style="background:rgba(0,255,136,0.1); color:var(--primary); padding:4px 8px; border-radius:5px; font-weight:bold; font-size:0.8rem;">Sano</span>';
            
            let stockStyle = isCritycal ? 'color:var(--secondary); font-size:1.5rem;' : 'color:var(--text-main); font-size:1.2rem;';

            tabla.innerHTML += `
                <tr>
                    <td><strong style="color:#fff;">${item.nombre}</strong></td>
                    <td><span style="font-weight:bold; ${stockStyle}">${item.stock}</span></td>
                    <td style="color:var(--text-muted); font-size:0.9rem;">Menos de ${item.critico}</td>
                    <td>${badge}</td>
                </tr>
            `;
        });
    }

    // Escuchar recarga de inventario
    const formReab = document.getElementById('formReabastecer');
    if(formReab) {
        formReab.addEventListener('submit', (e) => {
            e.preventDefault();
            let id = document.getElementById('inputProductoReab').value;
            let qty = parseInt(document.getElementById('inputCantidadReab').value);
            
            DB.aumentarInventario(id, qty);
            
            formReab.reset();
            actualizarPantallaStock();
            alert("¡Almacén reabastecido! Las unidades ya están guardadas en la base de datos.");
        });
    }

    cargarSelect();
    actualizarPantallaStock();
});
