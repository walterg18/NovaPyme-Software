// LÓGICA PRINCIPAL DEL SISTEMA (Caja Registradora)

document.addEventListener('DOMContentLoaded', () => {
    
    // Inyectar nombre del cajero
    document.getElementById('userNameDisplay').innerText = sessionStorage.getItem('nova_user_name');

    // Cargar Barberos en el Select (Leyéndolos de la Base de Datos)
    const selectBarbero = document.getElementById('inputBarbero');
    if(selectBarbero) {
        let barberos = DB.obtenerBarberos();
        selectBarbero.innerHTML = '<option value="">Seleccione Barbero...</option>';
        barberos.forEach(b => {
            selectBarbero.innerHTML += `<option value="${b.nombre}">${b.nombre}</option>`;
        });
    }

    // Cargar Productos Adicionales
    const selectProducto = document.getElementById('inputProductoExtra');
    if(selectProducto) {
        let stock = DB.obtenerInventario();
        selectProducto.innerHTML = '<option value="">Ningún producto</option>';
        stock.forEach(p => {
            selectProducto.innerHTML += `<option value="${p.id}">${p.nombre}</option>`;
        });
    }

    // Funciones de Dibujo de Pantalla
    function actualizarPantalla() {
        const tabla = document.getElementById('tablaDeCobros');
        const displayTotal = document.getElementById('totalCajaDisplay');
        const displayNeta = document.getElementById('netaDisplay');
        
        let tickets = DB.obtenerTickets();
        
        // Limpiar tabla
        tabla.innerHTML = '';
        
        // Invertir arreglo para mostrar los nuevos arriba
        let ticketsReversos = [...tickets].reverse();

        ticketsReversos.forEach(t => {
            let badgeStyle = t.metodo_pago === 'Efectivo' ? 'background:rgba(0,255,136,0.2); color:var(--primary);' : 'background:rgba(255,255,255,0.1); color:#fff;';
            let prodAdicionalHTML = t.productoAdicionalNombre ? `<br><small style="color:var(--secondary)">+ Venta: ${t.productoAdicionalNombre}</small>` : '';

            tabla.innerHTML += `
                <tr>
                    <td style="font-size:0.8rem; color:var(--text-muted);">${t.fecha.split(', ')[1]}</td>
                    <td><strong style="color:#fff;">${t.servicio}</strong>${prodAdicionalHTML}<br><small style="color:var(--text-muted)">Por: ${t.barbero}</small></td>
                    <td><span style="padding:4px 8px; border-radius:5px; font-size:0.8rem; ${badgeStyle}">${t.metodo_pago}</span></td>
                    <td style="font-size:0.85rem;">Barbero: RD$ ${t.ganancia_barbero}<br><span style="color:var(--primary)">Local: RD$ ${t.ganancia_local}</span></td>
                    <td style="font-weight:bold; font-size:1.1rem;">RD$ ${t.costo}</td>
                </tr>
            `;
        });

        // Sumas finales
        displayTotal.innerText = `RD$ ${DB.calcularIngresosTotales().toFixed(2)}`;
        displayNeta.innerText = `RD$ ${DB.calcularUtilidadLocal().toFixed(2)}`;
    }

    // Escuchar cuando hundan el boton "Cobrar en Caja"
    const formCobro = document.getElementById('formCobro');
    if(formCobro) {
        formCobro.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Extraer info de producto si vendió algo
            let idProdExtra = document.getElementById('inputProductoExtra').value;
            let nombreProdExtra = "";
            if (idProdExtra) {
                let sL = DB.obtenerInventario();
                let prod = sL.find(i => i.id === idProdExtra);
                if(prod) nombreProdExtra = prod.nombre;
            }

            // Recolectar del formulario
            let ticket = {
                servicio: document.getElementById('inputServicio').value,
                barbero: document.getElementById('inputBarbero').value,
                metodo_pago: document.getElementById('inputMetodo').value,
                costo: parseFloat(document.getElementById('inputMonto').value),
                productoAdicionalNombre: nombreProdExtra
            };

            // Enviar a la Base de Datos (Calcula comisión ahi mismo)
            DB.guardarTicket(ticket);

            // Restar Inventario del kardex!
            if (idProdExtra) {
                DB.reducirInventario(idProdExtra, 1);
            }

            // Limpiar cajas de texto
            formCobro.reset();

            // Refrescar los números
            actualizarPantalla();
        });
    }

    // Escuchar cuando reporten un EGRESO (Gasto local)
    const formEgreso = document.getElementById('formEgreso');
    if(formEgreso) {
        formEgreso.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let egreso = {
                razon: document.getElementById('inputRazonGasto').value,
                monto: parseFloat(document.getElementById('inputMontoGasto').value)
            };

            DB.guardarEgreso(egreso);
            formEgreso.reset();
            actualizarPantalla();
            alert("Gasto registrado. Se ha restado de la Utilidad Neta.");
        });
    }

    // Al arrancar, refrescamos la pantalla para traer datos pasados
    actualizarPantalla();

});
