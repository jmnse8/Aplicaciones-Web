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

function findByTag(tasks, tag) {
    return (!(tasks instanceof Array)) ? [] : tasks.filter(t => (t.tags.includes(tag)));
}

function findByTags(tasks, tags) {
        return (!(tasks instanceof Array) || !tags instanceof Array) ? [] 
        : tasks.filter(t => tags.some(ta => t["tags"].includes(ta)));
}

function countDone(tasks) {
    return (!(tasks instanceof Array)) ? 0 : tasks.filter(t => t["done"]).length;
}


function createTask(texto) {
    let etiquetas = [];
    let titulo = "";

    if(texto != "" && typeof texto != "undefined" && typeof texto == "string"){
        etiquetas = texto.match(/@\w+/g).map(n => n.replace("@",""));

        titulo = texto.replace(/@\w+/g,"").trim().replace(/\s/g,' ');
    }
    return {text: titulo,tags: etiquetas};
}

//countDone(listaTareas);
//getToDoTasks(listaTareas);
//findByTag(listaTareas, "personal");
//findByTags(listaTareas, ["personal", "practica"]);
createTask("Ir al médico @personal @salud");