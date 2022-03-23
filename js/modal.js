const modalConfirmacao = document.querySelector('#modalConfirmacao');
const modalPokemon = document.querySelector('#modalPokemon');

const modalsLista = document.querySelectorAll('.modal-container');

if (modalsLista.length > 0) {
    for (let i = 0; i < modalsLista.length; i++) {
        modalsLista[i].addEventListener('click', function(event){
            if(event.target.id == modalsLista[i].id || event.target.className == 'btn-fechar') //clicar fora ou no botão de fechar
                fecharModal(modalsLista[i]); 
        });
    }
}


function mostrarModal(modal, tituloModal=null, modalBody=null){
    if(modal){
        modal.classList.add('mostrar');

        if (tituloModal != null)
            modal.querySelector('.modal-titulo').innerText = tituloModal;
        
        if (modalBody != null)
            modal.querySelector('.modal-body').innerHTML = modalBody;
    }
}   

function fecharModal(modal){
    modal.classList.remove('mostrar');
}