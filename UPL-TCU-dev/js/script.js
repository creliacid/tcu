import { db } from './firebase-init.js';
import { collection, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
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
                this.eventos = eventosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch (error) {
                console.error('Error al cargar eventos:', error);
                this.eventos = [];
            }
        },
        async guardarEventos() {
            try {
                // Borra y reescribe todos los eventos (no recomendado para producción, mejor usar add/update/delete individual)
                const eventosCol = collection(db, "eventos");
                // Elimina todos los docs existentes (no eficiente, solo para migración rápida)
                // Lo ideal es actualizar solo lo que cambia
                for (const evento of this.eventos) {
                    await setDoc(doc(db, "eventos", evento.id ? String(evento.id) : crypto.randomUUID()), evento);
                }
                console.log('Eventos guardados correctamente en Firestore.');
            } catch (error) {
                console.error('Error al guardar eventos en Firestore:', error);
            }
        },
        agregarEvento() {
            let id = this.eventos.length;
            this.nuevoEvento.id = id;
            this.eventos.push({ ...this.nuevoEvento });
            this.nuevoEvento = { id: '', nombre: '', hora: '', fecha: '', lugar: '', imagen: '', link: '' };
            this.guardarEventos();
        },
        editarEvento(index) {
            this.editandoEvento = index;
        },
        guardarEdicion() {
            this.editandoEvento = null;
            this.guardarEventos();
        },
        cancelarEdicion() {
            this.editandoEvento = null;
        },
        eliminarEvento(index) {
            if (confirm('¿Estás seguro de eliminar este evento?')) {
                this.eventos.splice(index, 1);
                this.guardarEventos();
            }
        }
    }
}).mount('#app');