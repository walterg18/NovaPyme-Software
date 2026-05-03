// MÓDULO DE BASE DE DATOS (NUBE + EMULADOR LOCAL)
// En la Fase 2, aquí irán las verdaderas llaves de Google Firebase.
// Por ahora, el Emulador garantiza que el programa funcione y almacene 
// la información en el navegador para que puedas empezar a vender.

const DB = {
    // Función central para guardar un nuevo ticket
    guardarTicket: function(ticket) {
        let tickets = this.obtenerTickets();
        ticket.id = Date.now().toString(); // Generar ID único
        ticket.fecha = new Date().toLocaleString();
        
        // Calcular Comisión Matemática Automática
        let barberos = this.obtenerBarberos();
        let barberInfo = barberos.find(b => b.nombre === ticket.barbero);
        let porcentaje = barberInfo ? barberInfo.comision_porcentaje : 0.50; // default 50%
        
        ticket.ganancia_barbero = parseFloat(ticket.costo) * porcentaje;
        ticket.ganancia_local = parseFloat(ticket.costo) - ticket.ganancia_barbero;

        tickets.push(ticket);
        localStorage.setItem('nova_barber_tickets', JSON.stringify(tickets));
        return true;
    },

    // Guardar un Egreso (Gasto) del negocio
    guardarEgreso: function(egreso) {
        let egresos = this.obtenerEgresos();
        egreso.id = Date.now().toString();
        egreso.fecha = new Date().toLocaleString();
        egresos.push(egreso);
        localStorage.setItem('nova_barber_egresos', JSON.stringify(egresos));
        return true;
    },

    // Leer todos los gastos
    obtenerEgresos: function() {
        let data = localStorage.getItem('nova_barber_egresos');
        if(!data) return [];
        return JSON.parse(data);
    },

    // Lee todos los cobros del día
    obtenerTickets: function() {
        let data = localStorage.getItem('nova_barber_tickets');
        if(!data) return [];
        return JSON.parse(data);
    },

    // Función que simula la Base de Datos de Barberos 
    obtenerBarberos: function() {
        let data = localStorage.getItem('nova_barber_staff');
        if(!data) {
            // Barberos semilla con % de comisión acordada
            let defaultStaff = [
                { id: '1', nombre: 'Admin / Dueño', rol: 'admin', comision_porcentaje: 0 },
                { id: '2', nombre: 'Julio (Barbero)', rol: 'empleado', comision_porcentaje: 0.60 }, // 60% Barbero, 40% Casa
                { id: '3', nombre: 'Marcos VIP', rol: 'empleado', comision_porcentaje: 0.50 }      // 50% / 50%
            ];
            localStorage.setItem('nova_barber_staff', JSON.stringify(defaultStaff));
            return defaultStaff;
        }
        return JSON.parse(data);
    },

    calcularIngresosTotales: function() {
        let tickets = this.obtenerTickets();
        let suma = 0;
        tickets.forEach(t => suma += parseFloat(t.costo));
        return suma;
    },

    calcularUtilidadLocal: function() {
        let tickets = this.obtenerTickets();
        let egresos = this.obtenerEgresos();
        
        let gananciaNetaBrutaLocal = 0;
        tickets.forEach(t => gananciaNetaBrutaLocal += t.ganancia_local);
        
        let totalEgresos = 0;
        egresos.forEach(e => totalEgresos += parseFloat(e.monto));

        return gananciaNetaBrutaLocal - totalEgresos;
    },

    // INVENTARIO / KARDEX MATEMÁTICO
    obtenerInventario: function() {
        let data = localStorage.getItem('nova_barber_inventory');
        if(!data) {
            let defaultStock = [
                { id: '1', nombre: 'Minoxidil (Tratamiento Barba)', stock: 5, critico: 3 }, // Critico al arranque para demostrar la alerta!
                { id: '2', nombre: 'Gelatina Black Extreme', stock: 15, critico: 5 },
                { id: '3', nombre: 'Papel Cuello (Docena)', stock: 30, critico: 10 }
            ];
            localStorage.setItem('nova_barber_inventory', JSON.stringify(defaultStock));
            return defaultStock;
        }
        return JSON.parse(data);
    },

    reducirInventario: function(idProd, qty) {
        if(!idProd) return;
        let stockList = this.obtenerInventario();
        let itemIndex = stockList.findIndex(i => i.id === idProd);
        if(itemIndex > -1) {
            stockList[itemIndex].stock -= qty;
            if(stockList[itemIndex].stock < 0) stockList[itemIndex].stock = 0;
            localStorage.setItem('nova_barber_inventory', JSON.stringify(stockList));
        }
    },

    aumentarInventario: function(idProd, qty) {
        if(!idProd) return;
        let stockList = this.obtenerInventario();
        let itemIndex = stockList.findIndex(i => i.id === idProd);
        if(itemIndex > -1) {
            stockList[itemIndex].stock += qty;
            localStorage.setItem('nova_barber_inventory', JSON.stringify(stockList));
        }
    },

    // CRM / CLIENTES VIP 
    obtenerClientes: function() {
        let data = localStorage.getItem('nova_barber_clientes');
        if(!data) {
            let cx = [
                { nombre: 'Juan Aristides', telefono: '809-555-1234', notas: 'Fade navaja sin linea, no usar gel.', cortes_registrados: 9 }
            ];
            localStorage.setItem('nova_barber_clientes', JSON.stringify(cx));
            return cx;
        }
        return JSON.parse(data);
    },

    guardarCliente: function(cliente) {
        let clientes = this.obtenerClientes();
        clientes.push(cliente);
        localStorage.setItem('nova_barber_clientes', JSON.stringify(clientes));
    },

    sumarVisitaCliente: function(telefono) {
        if(!telefono) return;
        let clientes = this.obtenerClientes();
        let i = clientes.findIndex(c => c.telefono === telefono);
        if(i > -1) {
            clientes[i].cortes_registrados += 1;
            localStorage.setItem('nova_barber_clientes', JSON.stringify(clientes));
        } else {
            // Si no existe, crearlo vacio rapido para que reciba el punto
            this.guardarCliente({ nombre: 'Cliente Express', telefono: telefono, notas: 'Añadido desde caja rapida', cortes_registrados: 1 });
        }
    }
};
