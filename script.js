const campoTarefa = document.getElementById('campo-tarefa');
const botaoAdicionar = document.querySelector('.caixa-entrada .botao-principal');
const listaTarefas = document.getElementById('lista-tarefas');
const contadorTarefas = document.getElementById('contador-tarefas');
const botaoTema = document.querySelector('.cabecario-aplicacao .botao-principal');

if (botaoTema) {
    botaoTema.className = 'botao-icone';
}

function atualizarContador() {
    const totalTarefas = listaTarefas.children.length;
    if (totalTarefas === 0) {
        contadorTarefas.textContent = '0 tarefas na Lista';
    } else if (totalTarefas === 1) {
        contadorTarefas.textContent = '1 tarefa na Lista';
    } else {
        contadorTarefas.textContent = `${totalTarefas} tarefas na Lista`;
    }
}

function adicionarTarefa() {
    const textoTarefa = campoTarefa.value.trim();

    if (textoTarefa === '') {
        return;
    }

    const itemLista = document.createElement('li');
    itemLista.classList.add('item-tarefa');

    itemLista.innerHTML = `
        <span>${textoTarefa}</span>
        <div class="acoes-tarefa">
            <button class="botao-acao concluir"><i class="fa-solid fa-check"></i></button>
            <button class="botao-acao excluir"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;

    const botaoConcluir = itemLista.querySelector('.concluir');
    botaoConcluir.addEventListener('click', () => {
        itemLista.classList.toggle('item-tarefa-concluida');
    });

    const botaoExcluir = itemLista.querySelector('.excluir');
    botaoExcluir.addEventListener('click', () => {
        itemLista.remove();
        atualizarContador();
    });

    listaTarefas.appendChild(itemLista);

    campoTarefa.value = '';
    campoTarefa.focus();
    atualizarContador();
}

if (botaoAdicionar) {
    botaoAdicionar.addEventListener('click', adicionarTarefa);
}

campoTarefa.addEventListener('keypress', (evento) => {
    if (evento.key === 'Enter') {
        adicionarTarefa();
    }
});

if (botaoTema) {
    botaoTema.addEventListener('click', () => {
        document.body.classList.toggle('modo-escuro');
        const icone = botaoTema.querySelector('i');
        if (document.body.classList.contains('modo-escuro')) {
            icone.className = 'fa-solid fa-sun';
        } else {
            icone.className = 'fa-solid fa-moon';
        }
    });
}