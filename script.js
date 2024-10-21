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
            <td><button class="finalizar" onclick="finalizarProcesso(${processo.id})">Finalizar Tarefa</button></td>
        `;
        
        listaProcessos.appendChild(tr);
    });
}

function finalizarProcesso(id) {
    // Localiza o processo a ser finalizado
    let processo = processos.find(p => p.id === id);

    if (processo) {
        // Muda o estado do processo para "Término"
        processo.estado = 'Término';
        atualizarLista();

        // Aguarda 5 segundos antes de remover o processo
        setTimeout(() => {
            // Remove o processo do frontend
            processos = processos.filter(p => p.id !== id);
            atualizarLista();

            // Remove o processo do backend
            fetch(`/processos/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) });
                }
            })
            .catch(error => console.error('Erro ao finalizar processo:', error));
        }, 5000); // 5 segundos no estado "Término"
    }
}


/*function limparFormulario() {
    document.getElementById('nome').value = '';
    document.getElementById('disco').value = '';
    document.getElementById('prioridade').value = 'Média';
}*/

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
    // Verifica se há um processo em execução
    if (processoEmExecucao) {
        let estadoAleatorio = Math.random() > 0.5 ? 'Espera' : 'Pronto';
        processoEmExecucao.estado = estadoAleatorio;

        // Se o processo foi para "Espera", ele volta para "Pronto" após 5 segundos
        if (estadoAleatorio === 'Espera') {
            processoEmExecucao.tempoEmEspera = 0;
            let tempoEspera = 5000; // 5 segundos
            setTimeout(() => {
                if (processoEmExecucao.estado === 'Espera') {
                    processoEmExecucao.estado = 'Pronto';
                    atualizarLista();
                }
            }, tempoEspera);
        }

        processoEmExecucao = null;
    }

    // Verifica processos no estado "Início" e move para "Pronto" após 5 segundos
    let processosInicio = processos.filter(p => p.estado === 'Início');
    processosInicio.forEach(processo => {
        setTimeout(() => {
            processo.estado = 'Pronto';
            atualizarLista();
        }, 5000); // Muda de "Início" para "Pronto" após 5 segundos
    });

    // Filtra processos que estão no estado 'Pronto' para serem movidos para 'Execução'
    let processosProntos = processos.filter(p => p.estado === 'Pronto');

    // Se há processos prontos e nenhum em execução, escolhe um para mover para "Execução"
    if (!processoEmExecucao && processosProntos.length > 0) {
        let proximoExecucao = processosProntos[Math.floor(Math.random() * processosProntos.length)];
        proximoExecucao.estado = 'Execução';
        processoEmExecucao = proximoExecucao;
    }

    // Atualiza a lista de processos que estão em "Espera"
    processos.forEach(processo => {
        if (processo.estado === 'Espera') {
            processo.tempoEmEspera += 5;
            if (processo.tempoEmEspera >= 10) {
                processo.estado = 'Pronto';
                atualizarLista();
            }
        }
    });

    // Atualiza a lista de processos na tela
    atualizarLista();
}

// Executa a função alterarEstados a cada 5 segundos
setInterval(alterarEstados, 5000);

