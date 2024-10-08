let processos = [];
let processoEmExecucao = null;

// Função para gerar uso de CPU aleatório
function gerarUsoCPU() {
    return Math.floor(Math.random() * 100); // Entre 0 e 100%
}

// Função para adicionar um processo
function adicionarProcesso() {
    const nome = document.getElementById('nome').value;
    const memoria = document.getElementById('memoria').value;
    const prioridade = document.getElementById('prioridade').value

    if (nome && memoria) {
        const processo = {
            pid: nome,
            usoCpu: gerarUsoCPU(),
            estado: 'Pronto',
            prioridade: prioridade,
            memoria: memoria
        };
        processos.push(processo);
        atualizarLista();
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

// Função para atualizar a lista de processos na interface
function atualizarLista() {
    const listaProcessos = document.getElementById('lista-processos');
    listaProcessos.innerHTML = '';

    processos.forEach((processo, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${processo.pid} - CPU: ${processo.usoCpu}% - Prioridade: ${processo.prioridade} - Memória: ${processo.memoria}MB <span class="estado">${processo.estado}</span>`;
        
        listaProcessos.appendChild(li);
    });
}

// Função para alterar estados automaticamente a cada 5 segundos
function alterarEstados() {
    if (processoEmExecucao) {
        // Muda o processo em execução para "Pronto" ou "Espera"
        let estadoAleatorio = Math.random() > 0.5 ? 'Espera' : 'Pronto';
        processoEmExecucao.estado = estadoAleatorio;
        processoEmExecucao = null;
    }

    // Seleciona processos que estão em "Pronto" para serem executados
    let processosProntos = processos.filter(p => p.estado === 'Pronto');

    if (processosProntos.length > 0) {
        // Escolhe um processo aleatório para execução
        let proximoExecucao = processosProntos[Math.floor(Math.random() * processosProntos.length)];
        proximoExecucao.estado = 'Execução';
        processoEmExecucao = proximoExecucao;
    }

    // Processos em "Espera" vão para "Pronto"
    processos.forEach(processo => {
        if (processo.estado === 'Espera') {
            processo.estado = 'Pronto';
        }
    });

    atualizarLista();
}

// Inicia a atualização automática a cada 5 segundos
setInterval(alterarEstados, 5000);
