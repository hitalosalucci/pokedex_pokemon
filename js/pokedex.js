window.onload = function(){
    
    //variaveis de ambiente
    const pokemonsBuscadosPromise = [];
    const listaPokemonsBuscados = [];

    let modoBusca = false;
    let pokemonCarregadoAtual = 0;

    //elementos
    const botaoBuscar = document.querySelector('#btnBuscaPokedex');
    const botaoLimpar = document.querySelector('#btnLimparBuscaPokedex');
    const inputBuscar = document.querySelector('#inputBuscaPokedex');
    const loadingPokemonsDiv = document.querySelector('.loading-pokemons');
    const spanFecharMensagemAviso = document.querySelector('.div-mensagem-wrap .mensagem-fechar span');
    const mensagemAviso = document.querySelector('.div-mensagem');
    
    const pokedexWrap = document.querySelector('.pokedex-wrap');
    const pokemonsLista = document.querySelector('ul.pokemons-lista');
    const pokemonDatalist = document.querySelector('datalist#lista-pokemons');

    const divFimPagina = document.querySelector('#div-fim-pagina');

    //eventos
    botaoBuscar.addEventListener('click', verificarInputBusca);
    botaoLimpar.addEventListener('click', limparBuscaPokemons);
    spanFecharMensagemAviso.addEventListener('click', fecharMensagemAviso);

    buscarPokemons();

    Promise.all(pokemonsBuscadosPromise)
        .then(pokemons => montarListaPokemons(pokemons));


    //funções
    function fetchPokemon(idPokemon){
        
        let urlApi = `https://pokeapi.co/api/v2/pokemon/${idPokemon}`;

        pokemonsBuscadosPromise.push(
            fetch(urlApi).then(response => response.json())
        );
        
    }

    function buscarPokemons() { 
        
        mostrarLoading();

        for (let i = 1; i <= 150; i++) {
            fetchPokemon(i);
        }

    }

    function mostrarLoading(){
        loadingPokemonsDiv.style.display =  'flex';
    }

    function esconderLoading(){
        loadingPokemonsDiv.style.display =  'none';
    }
    
    function montarHtmlPokemonIndex(pokemonNome, pokemonId, pokemonTipos){
        
        let pokemonIdComZeros = pokemonId.toString().padStart(3, '0');

        const urlImgPokemon = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokemonIdComZeros}.png`;

        let htmlTiposPokemon = '';
        
        for (let i = 0; i < pokemonTipos.length; i++) {
            htmlTiposPokemon += `<span class="badge badge-${pokemonTipos[i].type.name}">${pokemonTipos[i].type.name}</span> `
        }


        let htmlCardPokemon = `
        
        <li class="pokemon-card" data-id="${pokemonId}">

            <div class="pokemon-img card-${pokemonTipos[0].type.name}">
                <img src="${urlImgPokemon}" alt="${pokemonNome}">
            </div>

            <div class="pokemon-info">
                <p class="pokemon-id">N° ${pokemonIdComZeros}</p>
                <h5 class="pokemon-nome">${pokemonNome}</h5>

                <div class="pokemon-tipos">
                    ${htmlTiposPokemon}
                </div>

            </div>

        </li>`;

        return htmlCardPokemon;
    }

    function montarHtmlDatalistPokemons(pokemonNome){
        
        let htmlDataList = `<option value="${pokemonNome}"></option>`;

        return htmlDataList;

    }

    function montarListaPokemons(pokemons){

        //a posição na lista começa em 0
        for (let i = 0; i <= 149; i++) {
            
            listaPokemonsBuscados.push(pokemons[i]);
            
            let pokemonNome = pokemons[i].name; 
            
            pokemonDatalist.innerHTML += montarHtmlDatalistPokemons(pokemonNome);
        }
        
        adicionarIntersectionObserver();
        mostrarMensagemAvisoRolar();
    }

    function adicionarIntersectionObserver(){
        
        const intersectionObserver = new IntersectionObserver( (entries) => {
            if(entries.some((entry) => entry.isIntersecting) && modoBusca == false)
                renderizarPokemonsNaTela(listaPokemonsBuscados);
        });
        intersectionObserver.observe(divFimPagina);

    }

    function mostrarMensagemAvisoRolar(){
        setTimeout(function(){
            mensagemAviso.style.display = 'block';
        }, 800);
    }

    function renderizarPokemonsNaTela(pokemons){ 
        
        esconderLoading();

        let qntPokemonsCarregar = 0;

        if (pokemonCarregadoAtual+12 > pokemons.length) //renderizar somente 12 a cada observação do intersectionObserve
            qntPokemonsCarregar = pokemons.length - pokemonCarregadoAtual;
        else
            qntPokemonsCarregar = 12;
        
        let indexPokemons = pokemonCarregadoAtual;

        for (let i = pokemonCarregadoAtual; i < indexPokemons+qntPokemonsCarregar; i++) {  
            let pokemonNome = pokemons[i].name; 
            let pokemonId = pokemons[i].id;
            let pokemonTipos = pokemons[i].types; 

            pokemonsLista.innerHTML += montarHtmlPokemonIndex(pokemonNome, pokemonId, pokemonTipos);

        }

        pokemonCarregadoAtual += qntPokemonsCarregar;

        adicionarEventoClickCardPokemons();
    }

    function calcularPorcentagemStatsBar(valorTotal, valorStats){
        let porcentagem = (100*valorStats)/valorTotal;
        return porcentagem;
    }

    function montarHtmlModalPokemon(idPokemon){

        let indexPokemon = idPokemon-1;

        let idPokemonComZeros = idPokemon.toString().padStart(3, '0');
        let nomePokemon = listaPokemonsBuscados[indexPokemon].name;

        let spritesPokemon = listaPokemonsBuscados[indexPokemon].sprites;

        let tiposPokemon = listaPokemonsBuscados[indexPokemon].types;

        let htmlTiposPokemon = '';
        for (let i = 0; i < tiposPokemon.length; i++) {
            htmlTiposPokemon += `<span class="badge-modal badge-${tiposPokemon[i].type.name}">${tiposPokemon[i].type.name}</span>`;
        }

        let habilidadesPokemon = listaPokemonsBuscados[indexPokemon].abilities;
        
        let htmlHabilidadesPokemon = '';
        for (let i = 0; i < habilidadesPokemon.length; i++) {
            htmlHabilidadesPokemon += `<span class="informacao">${habilidadesPokemon[i].ability.name}</span>`;
        }
        
        let statsHpValor = listaPokemonsBuscados[indexPokemon].stats[0].base_stat;
        let statsHpPorcentagem = calcularPorcentagemStatsBar(280, statsHpValor);
        
        let statsAtaqueValor = listaPokemonsBuscados[indexPokemon].stats[1].base_stat; 
        let statsAtaquePorcentagem = calcularPorcentagemStatsBar(280, statsAtaqueValor);

        let statsDefesaValor = listaPokemonsBuscados[indexPokemon].stats[2].base_stat;
        let statsDefesaPorcentagem = calcularPorcentagemStatsBar(280, statsDefesaValor);

        let statsAtaqueEspecialValor = listaPokemonsBuscados[indexPokemon].stats[3].base_stat;
        let statsAtaqueEspecialPorcentagem = calcularPorcentagemStatsBar(280, statsAtaqueEspecialValor);

        let statsDefesaEspecialValor = listaPokemonsBuscados[indexPokemon].stats[4].base_stat;
        let statsDefesaEspecialPorcentagem = calcularPorcentagemStatsBar(280, statsDefesaEspecialValor);

        let statsVelocidadeValor = listaPokemonsBuscados[indexPokemon].stats[5].base_stat;
        let statsVelocidadePorcentagem = calcularPorcentagemStatsBar(280, statsVelocidadeValor);

        let htmlPokemon = `
        
        <h2 class="modal-titulo texto-center">${nomePokemon} N°${idPokemonComZeros}</h2>
        
        <div class="modal-pokemon-col">
            <img class="img-pokemon" src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/${idPokemonComZeros}.png" alt="nomePokemon">

            <div class="div-pokemon-stats">
                <h3>Estatísticas</h3>

                <div class="grafico-stats">
                    
                    <div class="stat">
                        <span class="valorTopo">${statsHpValor}</span>
                        <svg><rect class="base"></rect><rect class="valor hp" style="height:calc(100% - ${statsHpPorcentagem}%)"></rect></svg>
                        <span class="descricaoValor">HP</span>
                    </div>
                    <div class="stat">
                        <span class="valorTopo">${statsAtaqueValor}</span>
                        <svg><rect class="base"></rect><rect class="valor ataque" style="height:calc(100% - ${statsAtaquePorcentagem}%)"></rect></svg>
                        <span class="descricaoValor">Ataque</span>
                    </div>
                    <div class="stat">
                        <span class="valorTopo">${statsDefesaValor}</span>
                        <svg><rect class="base"></rect><rect class="valor defesa" style="height:calc(100% - ${statsDefesaPorcentagem}%)"></rect></svg>
                        <span class="descricaoValor">Defesa</span>
                    </div>
                    <div class="stat">
                        <span class="valorTopo">${statsAtaqueEspecialValor}</span>
                        <svg><rect class="base"></rect><rect class="valor ataque-especial" style="height:calc(100% - ${statsAtaqueEspecialPorcentagem}%)"></rect></svg>
                        <span class="descricaoValor">Ataque especial</span>
                    </div>
                    <div class="stat">
                        <span class="valorTopo">${statsDefesaEspecialValor}</span>
                        <svg><rect class="base"></rect><rect class="valor defesa-especial" style="height:calc(100% - ${statsDefesaEspecialPorcentagem}%)"></rect></svg>
                        <span class="descricaoValor">Defesa especial</span>
                    </div>
                    <div class="stat">
                        <span class="valorTopo">${statsVelocidadeValor}</span>
                        <svg><rect class="base"></rect><rect class="valor velocidade" style="height:calc(100% - ${statsVelocidadePorcentagem}%)"></rect></svg>
                        <span class="descricaoValor">Velocidade</span>
                    </div>
                </div>
            </div>
            
        </div>

        <div class="modal-pokemon-col">

            <div class="col-badges">
                <div class="div-informacoes-pokemon">
                    <ul class="pokemon-informacoes">
                        <li><span class="titulo">Habilidades</span> ${htmlHabilidadesPokemon}</li>
                    </ul>
                </div>

                <div class="margin-left-2">
                    <div class="div-tipo-modal">
                        <h3>Tipo</h3>

                        <div class="pokemon-tipos">
                            ${htmlTiposPokemon}
                        </div>
                    </div>
                </div>

            </div>

            <div class="div-sprints">
                <div class="linha-sprints">
                    <img src="${spritesPokemon.front_default}" title="Sprite front default" alt="Sprite front default">
                    <img src="${spritesPokemon.back_default}" title="Sprite back default" alt="Sprite back default">
                </div>
                <div class="linha-sprints">
                    <img src="${spritesPokemon.front_shiny}" title="Sprite front Shiny" alt="Sprite front Shiny">
                    <img src="${spritesPokemon.back_shiny}" title="Sprite back Shiny" alt="Sprite back Shiny">
                </div>
            </div>
            
        </div>`;

        // stats
        
        return htmlPokemon;
    }

    // function alterarGraficoStats(){

    //     const statsHp = document.querySelector('.modal-pokemon-col div.div-pokemon-stats svg rect.valor.hp'); 
    //     const statsAtaque = document.querySelector('.modal-pokemon-col div.div-pokemon-stats svg rect.valor.ataque'); 
    //     const statsDefesa = document.querySelector('.modal-pokemon-col div.div-pokemon-stats svg rect.valor.defesa'); 
    //     const statsAtaqueEspecial = document.querySelector('.modal-pokemon-col div.div-pokemon-stats svg rect.valor.ataque-especial'); 
    //     const statsDefesaEspecial = document.querySelector('.modal-pokemon-col div.div-pokemon-stats svg rect.valor.defesa-especial'); 
    //     const statsVelocidade = document.querySelector('.modal-pokemon-col div.div-pokemon-stats svg rect.valor.velocidade'); 
        
    //     statsHp.style.height = '80%';
    // }

    function adicionarEventoClickCardPokemons(){
        const cardsPokemons = document.querySelectorAll('.pokemon-card');

        if (cardsPokemons.length > 0) {
            for (let i = 0; i < cardsPokemons.length; i++) {
                cardsPokemons[i].addEventListener('click', function(){
                    let idPokemonClicado = cardsPokemons[i].getAttribute('data-id');
                    htmlModalPokemon = montarHtmlModalPokemon(idPokemonClicado);
                    mostrarModal(modalPokemon, null, htmlModalPokemon);
                });
            }
        }
                
    }

    function verificarInputBusca(){
        if(inputBuscar.value.trim() === '')
            alert('Digite o nome ou o número do pokemon que deseja buscar');
        else    
            filtrarPokemon();
    }

    function fecharMensagemAviso(){
        mensagemAviso.style.animation = 'sumir-div';
        mensagemAviso.style.animationFillMode = 'forwards';
    }

    function limparTelaPokemons(){
        pokemonsLista.innerHTML = '';
        pokemonCarregadoAtual = 0;
    }

    function filtrarPokemon(){
        modoBusca = true;
        mostrarLoading();

        let buscaDigitado = inputBuscar.value.trim();
        
        let pokemonsFiltrados = [];

        for (let i = 0; i <= 149; i++) {
        
            let pokemonNome = listaPokemonsBuscados[i].name; 
            
            if ( pokemonNome.trim().toLowerCase().includes(buscaDigitado.toLowerCase()) ) 
                pokemonsFiltrados.push(listaPokemonsBuscados[i]);
        }
        
        botaoLimpar.removeAttribute('disabled');
        limparTelaPokemons();
        renderizarPokemonsNaTela(pokemonsFiltrados);

    }

    function limparBuscaPokemons(){
        mostrarModal(modalConfirmacao, 'Deseja limpar a busca?');
        
        modalConfirmacao.addEventListener('click', function(event){

            if (event.target.value == 'true'){
                executarLimpezaPokemons();
                fecharModal(modalConfirmacao);
            } else if (event.target.value == 'false')
                fecharModal(modalConfirmacao);

        });
    }

    function executarLimpezaPokemons(){
        modoBusca = false;

        limparTelaPokemons();
        renderizarPokemonsNaTela(listaPokemonsBuscados);
        
        botaoLimpar.setAttribute('disabled', true);
        inputBuscar.value = '';
    }
}
