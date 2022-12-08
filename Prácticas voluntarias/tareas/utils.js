"use strict"

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
        if(texto.indexOf('@') != -1) etiquetas = texto.match(/@\w+/g).map(n => n.replace("@",""));
        else etiquetas = ['ijdfgnradij'];

        titulo = texto.replace(/@\w+/g,"").trim().replace(/\s/g,' ');
    }
    return {text: titulo,tags: etiquetas};
}

module.exports = {

    createTask : createTask
};