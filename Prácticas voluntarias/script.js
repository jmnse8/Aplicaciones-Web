"use strict";

let listaTareas = [
    {text:"Preparar prácticas AW", tags:["universidad","awt"]}
    , {text: "Mirar fechas congreso", done: true, tags:[]}
    , {text: "Ir al supermercado", tags: ["personal", "básico"]}
    , {text: "Jugar al fútbol", done: false, tags:["personal", "deportes"]}
    , {text: "Hablar con profesor", done: false, tags:["universidad", "tp2"]}
    ];
    
function getToDoTasks(tasks) {
    return (!(tasks instanceof Array)) ? [] : tasks.filter(t => (t["done"] == undefined || !t["done"])).map(e => e["text"]);
}

getToDoTasks(listaTareas);