$('#checkSearch').on('click', (e) => {
    let searchInp = $('#textSearch');
    if(e.target.checked)
        searchInp.attr('placeholder', 'Buscar usuario');
    else
        searchInp.attr('placeholder', 'Buscar aviso');
});