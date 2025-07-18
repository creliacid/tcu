
//Cargar funciones

annio();

function annio(){
    const fecha = new Date();
    document.getElementById("annio").innerText = fecha.getFullYear();
}