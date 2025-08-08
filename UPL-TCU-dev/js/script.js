import { db } from './firebase-init.js';
import { collection, getDocs, setDoc, doc, addDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
const { createApp } = Vue;

createApp({
    data() {
        return {
            eventos: [],
            nuevoEvento: { id: '', nombre: '', hora: '', fecha: '', lugar: '', imagen: '', link: '' },
            editandoEvento: null,
        };
    },
    mounted() { /*En Vue.js, la función del hook mounted es una parte del ciclo de vida del componente.
        Se ejecuta automáticamente después de que el componente ha sido insertado en el DOM (Document Object Model).
        ¿Para qué se usa?
        El hook mounted() se usa comúnmente para: Hacer peticiones HTTP (por ejemplo, a una API).
        Acceder directamente al DOM del componente. Iniciar librerías de terceros que necesitan acceso al DOM.*/
        this.cargarEventos();
    },
    methods: {
        async cargarEventos() {
            try {
                const eventosCol = collection(db, "eventos");
                const eventosSnapshot = await getDocs(eventosCol);
                const now = new Date();
                let eventosValidos = [];
                for (const docSnap of eventosSnapshot.docs) {
    const evento = { id: docSnap.id, ...docSnap.data() };
    // Parse fecha y hora (asume formato dd/mm/yy y hh:mm[am|pm])
    const [d, m, y] = evento.fecha.split('/');
    const dia = parseInt(d), mes = parseInt(m), anio = parseInt(y.length === 2 ? '20'+y : y);
    // Validación básica de fecha
    const fechaEvento = new Date(anio, mes - 1, dia);
    const fechaValida = fechaEvento.getFullYear() === anio && fechaEvento.getMonth() === (mes-1) && fechaEvento.getDate() === dia && mes >= 1 && mes <= 12 && dia >= 1 && dia <= 31;
    if (!fechaValida) {
        // Eliminar evento con fecha inválida
        await deleteDoc(doc(db, "eventos", evento.id));
        console.log(`Evento eliminado por fecha inválida: ${evento.nombre}`);
        continue;
    }
    if (evento.hora) {
        // Soporta formato 9:00a.m o 19:00
        let [hora, min] = evento.hora.replace(/[ap.]/gi, '').split(':');
        let h = parseInt(hora);
        let mins = parseInt(min) || 0;
        if (evento.hora.toLowerCase().includes('p') && h < 12) h += 12;
        if (evento.hora.toLowerCase().includes('a') && h === 12) h = 0;
        fechaEvento.setHours(h, mins, 0, 0);
    }
    if (fechaEvento >= now) {
        eventosValidos.push({ ...evento, fechaObj: fechaEvento });
    } else {
        // Eliminar evento pasado de Firestore
        await deleteDoc(doc(db, "eventos", evento.id));
        console.log(`Evento eliminado automáticamente: ${evento.nombre}`);
    }
}
                // Ordena por fecha/hora ascendente
                eventosValidos.sort((a, b) => a.fechaObj - b.fechaObj);
                this.eventos = eventosValidos;
            } catch (error) {
                console.error('Error al cargar eventos:', error);
                this.eventos = [];
            }
        },
        // Guardar solo el evento editado (actualización)
        transformarUrlImagen(url) {
            // Si es Google Drive tipo /file/d/ID/view lo transforma a uc?export=view&id=ID
            const driveRegex = /https?:\/\/drive\.google\.com\/file\/d\/([\w-]+)\/view.*/;
            const match = url.match(driveRegex);
            if (match) {
                return `https://drive.google.com/uc?export=view&id=${match[1]}`;
            }
            return url;
        },
        async guardarEventos() {
            try {
                // Actualiza solo el evento editado
                if (this.editandoEvento !== null) {
                    const evento = this.eventos[this.editandoEvento];
                    evento.imagen = this.transformarUrlImagen(evento.imagen);
                    await setDoc(doc(db, "eventos", evento.id), evento);
                    console.log('Evento actualizado correctamente en Firestore.');
                }
            } catch (error) {
                console.error('Error al guardar evento en Firestore:', error);
            }
        },
        // Agregar evento con ID único y guardar solo el nuevo
        async agregarEvento() {
            try {
                const eventosCol = collection(db, "eventos");
                const nuevoId = crypto.randomUUID();
                // Transforma la URL de imagen si es Google Drive
                const imagenTransformada = this.transformarUrlImagen(this.nuevoEvento.imagen);
                const nuevoEvento = { ...this.nuevoEvento, id: nuevoId, imagen: imagenTransformada };
                const docRef = await setDoc(doc(eventosCol, nuevoId), nuevoEvento);
                this.eventos.push(nuevoEvento);
                this.nuevoEvento = { id: '', nombre: '', hora: '', fecha: '', lugar: '', imagen: '', link: '' };
                console.log('Evento agregado correctamente en Firestore.');
            } catch (error) {
                console.error('Error al agregar evento en Firestore:', error);
            }
        },
        // Eliminar evento individual
        async eliminarEvento(index) {
            try {
                if (confirm('¿Estás seguro de eliminar este evento?')) {
                    const evento = this.eventos[index];
                    await deleteDoc(doc(db, "eventos", evento.id));
                    this.eventos.splice(index, 1);
                    console.log('Evento eliminado correctamente en Firestore.');
                }
            } catch (error) {
                console.error('Error al eliminar evento en Firestore:', error);
            }
        },
        editarEvento(index) {
            this.editandoEvento = index;
        },
        async guardarEdicion() {
            await this.guardarEventos();
            this.editandoEvento = null;
            await this.cargarEventos();
        },
        cancelarEdicion() {
            this.editandoEvento = null;
        },

    }
}).mount('#app');