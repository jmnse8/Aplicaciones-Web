
function pasSelected(){
    let value = document.getElementById('perfilUniversitario').value;
    if(value === "pas"){
        document.getElementById('pasSwitch').style.display = "flex";
    }
    else{
        document.getElementById('pasSwitch').style.display = "none";
    }
}