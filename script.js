const login = document.getElementById("login");
const painel = document.getElementById("painel");
const nomeLogin = document.getElementById("nome-login");
const botaoLogin = document.getElementById("botao-login");
const nomePerfil = document.getElementById("nome-perfil");
const entradaTarefa = document.getElementById("entrada-tarefa");
const botaoAdicionar = document.getElementById("botao-adicionar");
const listaTarefas = document.getElementById("lista-tarefas");
const contadorTarefas = document.getElementById("contador-tarefas");
const botaoTema = document.getElementById("botao-tema");
const filtros = document.querySelectorAll(".filtros-tarefas button");
const papoiFixo = document.getElementById("papoi-fixo");
const papoiPopup = document.getElementById("papoi-sucesso");
const papoiErro = document.getElementById("papoi-erro");
const mensagemErro = document.getElementById("mensagem-erro");
const mensagemSucesso = document.getElementById("mensagem-sucesso");
const botaoDesculpa = document.getElementById("botao-desculpa");
const somErro = document.getElementById("som-erro");

let tarefas = JSON.parse(localStorage.getItem("tarefasPapoi")) || [];
let filtroAtual = "todas";

const frasesPapoi = [
    "Estou de olho nas suas tarefas...",
    "Não tente me enganar, eu vi isso.",
    "Vamos trabalhar para conquistar a Lua!.",
    "Essa tarefa não vai se fazer sozinha.",
    "Eu estou observando...",
    "Hmm... interessante.",
    "Você consegue terminar tudo!",
    "Papoi aprova essa organização."
];

const frasesSucesso = [
    "Muito bem! Papoi está orgulhoso.",
    "Tarefa concluída! Que eficiência.",
    "Papoi aprovou!",
    "Mais uma para a conta!",
    "Excelente trabalho!",
    "Assim eu gosto!",
    "Você está arrasando nas tarefas."
];

function salvarTarefas() {
    localStorage.setItem("tarefasPapoi", JSON.stringify(tarefas));
}

function salvarNome(nome) {
    localStorage.setItem("nomeUsuario", nome);
}

function carregarNome() {
    const nomeSalvo = localStorage.getItem("nomeUsuario");
    if (nomeSalvo) {
        nomePerfil.textContent = nomeSalvo;
        login.style.display = "none";
        painel.classList.remove("painel-escondido");
    } else {
        login.style.display = "flex";
        painel.classList.add("painel-escondido");
    }
}

function entrar() {
    const nome = nomeLogin.value.trim();
    if (!nome) {
        mostrarErro("Papoi precisa saber quem está entrando!");
        nomeLogin.focus();
        return;
    }
    salvarNome(nome);
    nomePerfil.textContent = nome;
    login.style.display = "none";
    painel.classList.remove("painel-escondido");
    mostrarFrasePapoi("Olá, " + nome + "! Vamos começar?");
}

function adicionarTarefa() {
    const texto = entradaTarefa.value.trim();
    if (!texto) {
        mostrarErro("Você precisa escrever uma tarefa!");
        entradaTarefa.focus();
        return;
    }
    if (texto.length < 2) {
        mostrarErro("Isso nem é uma tarefa, Papoi recusou.");
        entradaTarefa.focus();
        return;
    }
    const tarefa = {
        id: Date.now(),
        texto: texto,
        concluida: false,
        data: new Date().toISOString()
    };
    tarefas.push(tarefa);
    salvarTarefas();
    entradaTarefa.value = "";
    renderizarTarefas();
    mostrarFrasePapoi("Tarefa adicionada. Papoi está de olho!");
}

function formatarData(data) {
    return new Date(data).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    });
}

function renderizarTarefas() {
    listaTarefas.innerHTML = "";
    const tarefasFiltradas = tarefas.filter(tarefa => {
        if (filtroAtual === "pendentes") return !tarefa.concluida;
        if (filtroAtual === "concluidas") return tarefa.concluida;
        return true;
    });

    if (tarefasFiltradas.length === 0) {
        const vazio = document.createElement("li");
        vazio.className = "item-tarefa";
        vazio.style.justifyContent = "center";
        vazio.style.color = "var(--cor-concluido)";
        vazio.textContent = "Nenhuma tarefa aqui.";
        listaTarefas.appendChild(vazio);
    }

    tarefasFiltradas.forEach(tarefa => {
        const item = document.createElement("li");
        item.className = "item-tarefa";
        if (tarefa.concluida) {
            item.classList.add("item-tarefa-concluida");
        }
        const conteudo = document.createElement("div");
        conteudo.className = "tarefa-conteudo";
        const texto = document.createElement("span");
        texto.textContent = tarefa.texto;
        const data = document.createElement("small");
        data.className = "data-tarefa";
        data.textContent = "Criada em " + formatarData(tarefa.data);
        conteudo.appendChild(texto);
        conteudo.appendChild(data);

        const acoes = document.createElement("div");
        acoes.className = "acoes-tarefa";

        const botaoConcluir = document.createElement("button");
        botaoConcluir.className = "botao-acao concluir";
        botaoConcluir.title = tarefa.concluida ? "Desmarcar tarefa" : "Concluir tarefa";
        botaoConcluir.innerHTML = tarefa.concluida
            ? '<i class="fa-solid fa-rotate-left"></i>'
            : '<i class="fa-solid fa-check"></i>';
        botaoConcluir.addEventListener("click", () => alternarTarefa(tarefa.id));

        const botaoExcluir = document.createElement("button");
        botaoExcluir.className = "botao-acao excluir";
        botaoExcluir.title = "Excluir tarefa";
        botaoExcluir.innerHTML = '<i class="fa-solid fa-trash"></i>';
        botaoExcluir.addEventListener("click", () => excluirTarefa(tarefa.id));

        acoes.appendChild(botaoConcluir);
        acoes.appendChild(botaoExcluir);

        item.appendChild(conteudo);
        item.appendChild(acoes);
        listaTarefas.appendChild(item);
    });
    atualizarContador();
}

function alternarTarefa(id) {
    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa) return;
    tarefa.concluida = !tarefa.concluida;
    salvarTarefas();
    renderizarTarefas();
    if (tarefa.concluida) {
        mostrarSucesso();
    } else {
        mostrarFrasePapoi("Tudo bem, tarefa voltou para a lista.");
    }
}

function excluirTarefa(id) {
    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa) return;
    const confirmar = confirm("Tem certeza que deseja excluir esta tarefa?");
    if (!confirmar) {
        mostrarFrasePapoi("Papoi agradece por você ter reconsiderado.");
        return;
    }
    tarefas = tarefas.filter(t => t.id !== id);
    salvarTarefas();
    renderizarTarefas();
    mostrarFrasePapoi("Tarefa removida. Papoi viu tudo.");
}

function atualizarContador() {
    const quantidade = tarefas.length;
    if (quantidade === 0) {
        contadorTarefas.textContent = "Nenhuma tarefa";
    } else if (quantidade === 1) {
        contadorTarefas.textContent = "1 tarefa na lista";
    } else {
        contadorTarefas.textContent = quantidade + " tarefas na lista";
    }
}

function mostrarSucesso() {
    if (!papoiPopup) return;
    const imagem = papoiPopup.querySelector("img");
    const mensagem = papoiPopup.querySelector("#mensagem-sucesso");
    if (imagem) {
        imagem.src = "papoicoracao.jpg";
        imagem.style.display = "block";
        imagem.style.opacity = "1";
    }
    if (mensagem) {
        mensagem.textContent = frasesSucesso[Math.floor(Math.random() * frasesSucesso.length)];
    }
    papoiPopup.style.opacity = "1";
    papoiPopup.style.transform = "translateX(0)";
    papoiPopup.style.pointerEvents = "auto";
    setTimeout(() => {
        papoiPopup.style.opacity = "0";
        papoiPopup.style.transform = "translateX(130%)";
        papoiPopup.style.pointerEvents = "none";
    }, 3000);
}

function mostrarFrasePapoi(frase) {
    if (!papoiFixo) return;
    const balao = papoiFixo.querySelector(".papoi-balao");
    if (balao) {
        balao.textContent = frase;
    }
}

function mostrarErro(mensagem) {
    if (!papoiErro) return;
    mensagemErro.textContent = mensagem;
    papoiErro.classList.add("jumpscare-ativo");
    if (somErro) {
        somErro.currentTime = 0;
        somErro.play().catch(() => {});
    }
}

function fecharErro() {
    if (papoiErro) {
        papoiErro.classList.remove("jumpscare-ativo");
    }
}

function alternarTema() {
    document.body.classList.toggle("modo-escuro");
    const escuro = document.body.classList.contains("modo-escuro");
    localStorage.setItem("temaPapoi", escuro ? "escuro" : "claro");
    botaoTema.innerHTML = escuro
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
}

function carregarTema() {
    const tema = localStorage.getItem("temaPapoi");
    if (tema === "escuro") {
        document.body.classList.add("modo-escuro");
        if (botaoTema) {
            botaoTema.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    }
}

function aplicarFiltro(botao) {
    filtros.forEach(item => item.classList.remove("filtro-ativo"));
    botao.classList.add("filtro-ativo");
    filtroAtual = botao.dataset.filtro;
    renderizarTarefas();
}

if (botaoLogin) {
    botaoLogin.addEventListener("click", entrar);
}
if (nomeLogin) {
    nomeLogin.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            entrar();
        }
    });
}
if (botaoAdicionar) {
    botaoAdicionar.addEventListener("click", adicionarTarefa);
}
if (entradaTarefa) {
    entradaTarefa.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            adicionarTarefa();
        }
    });
}
if (botaoTema) {
    botaoTema.addEventListener("click", alternarTema);
}
filtros.forEach(botao => {
    botao.addEventListener("click", () => aplicarFiltro(botao));
});
if (botaoDesculpa) {
    botaoDesculpa.addEventListener("click", fecharErro);
}
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        fecharErro();
    }
});

carregarTema();
carregarNome();
renderizarTarefas();

setInterval(() => {
    if (papoiFixo && papoiPopup && !papoiPopup.classList.contains("mostrar")) {
        const frase = frasesPapoi[Math.floor(Math.random() * frasesPapoi.length)];
        mostrarFrasePapoi(frase);
    }
}, 7000);

setTimeout(() => {
    mostrarSucesso();
}, 2000);
