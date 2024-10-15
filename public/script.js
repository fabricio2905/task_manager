let processos = [];
let processoEmExecucao = null;

function gerarPid() {
    return Math.floor(Math.random() * 15000);
}

function gerarUsoCPU() {
    return Math.floor(Math.random() * 100);
}

function gerarUsoMemoria() {
    return Math.floor(Math.random() * 1000);
}

function adicionarProcesso() {
    const nome = document.getElementById('nome').value;
    const disco = document.getElementById('disco').value;
    const prioridade = document.getElementById('prioridade').value;
    
    if (nome && disco) {
        const processo = {
            id: Date.now(),
            nome: nome,
            pid: gerarPid(),
            usoCpu: gerarUsoCPU(),
            usoMemoria: gerarUsoMemoria(),
            disco: disco,
            prioridade: prioridade,
            usuario: '',
            estado: 'Início',
        };

        // Enviar os dados do processo para o servidor
        fetch('/add-processo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(processo)
        })
        .then(response => {
            if (response.ok) {
                carregarProcessos();
                limparFormulario();
            } else {
                return response.text().then(text => { throw new Error(text) });
            }
        })
        .catch(error => console.error('Erro:', error));
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

function atualizarLista() {
    const listaProcessos = document.getElementById('lista-processos');
    listaProcessos.innerHTML = '';

    processos.forEach((processo) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${processo.nome}</td>
            <td>${processo.pid}</td>
            <td>${processo.usoCpu}%</td>
            <td>${processo.usoMemoria}MB</td>
            <td>${processo.disco}MB</td>
            <td>${processo.prioridade}</td>
            <td>${processo.usuario}</td>
            <td><span class="estado">${processo.estado}</span></td>
            <td><button class="remover" onclick="removerProcesso(${processo.id})">Remover</button></td>
        `;
        
        listaProcessos.appendChild(tr);
    });
}

function removerProcesso(id) {
    fetch(`/processos/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            // Remove o processo da lista localmente
            processos = processos.filter(processo => processo.id !== id);
            atualizarLista();
        } else {
            return response.text().then(text => { throw new Error(text) });
        }
    })
    .catch(error => console.error('Erro ao remover processo:', error));
}

function limparFormulario() {
    document.getElementById('nome').value = '';
    document.getElementById('disco').value = '';
    document.getElementById('prioridade').value = 'Média';
}

// carregar processos do backend ao iniciar
function carregarProcessos() {
    fetch('/processos')
        .then(response => response.json())
        .then(data => {
            processos = data;
            atualizarLista();
        })
        .catch(error => console.error('Erro ao carregar processos:', error));
}

// aqui chama a função para carregar processos quando a página for carregada
window.onload = carregarProcessos;

// Função para alterar estados automaticamente a cada 5 segundos
function alterarEstados() {
    if (processoEmExecucao) {
        let estadoAleatorio = Math.random() > 0.5 ? 'Espera' : 'Pronto';
        processoEmExecucao.estado = estadoAleatorio;

        if (estadoAleatorio === 'Espera') {
            processoEmExecucao.tempoEmEspera = 0;

            let tempoEspera = Math.random() * 5000; // 5 segundos
            setTimeout(() => {
                if (processoEmExecucao.estado === 'Espera') {
                    processoEmExecucao.estado = 'Pronto';
                    atualizarLista();
                }
            }, tempoEspera);
        }
        processoEmExecucao = null;
    }

    let processosProntos = processos.filter(p => p.estado === 'Início');

    if (processosProntos.length > 0) {
        let proximoExecucao = processosProntos[Math.floor(Math.random() * processosProntos.length)];
        proximoExecucao.estado = 'Execução';
        processoEmExecucao = proximoExecucao;
    }

    processos.forEach(processo => {
        if (processo.estado === 'Espera') {
            processo.tempoEmEspera += 5;
            if (processo.tempoEmEspera >= 10) {
                processo.estado = 'Pronto';
                atualizarLista();
            }
        }
    });

    atualizarLista();
}

setInterval(alterarEstados, 5000);
