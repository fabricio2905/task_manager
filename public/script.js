let processos = [];
let processoEmExecucao = null;

// Função para gerar uso de CPU aleatório
function gerarUsoCPU() {
    return Math.floor(Math.random() * 100); // Entre 0 e 100%
}

function gerarUsoMemoria() {
    return Math.floor(Math.random() * 1000); // Entre 0 e 1000MB
}

// Função para adicionar um processo
function adicionarProcesso() {
    const nome = document.getElementById('nome').value;
    const disco = document.getElementById('disco').value;
    const prioridade = document.getElementById('prioridade').value;

    if (nome && disco) {
        const processo = {
            pid: nome,
            usoCpu: gerarUsoCPU(),
            usoMemoria: gerarUsoMemoria(),
            estado: 'Pronto',
            prioridade: prioridade,
            disco: disco,
            tempoEmEspera: 0 // Novo campo para controlar o tempo em espera
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

    processos.forEach((processo) => {
        const li = document.createElement('li');
        li.innerHTML = `${processo.pid} CPU: ${processo.usoCpu}% - Memória: ${processo.usoMemoria}MB - Disco: ${processo.disco}MB - Prioridade: ${processo.prioridade} <span class="estado">${processo.estado}</span>`;
        
        listaProcessos.appendChild(li);
    });
}

// Função para alterar estados automaticamente a cada 5 segundos
function alterarEstados() {
    // Se um processo está em execução, mudar seu estado
    if (processoEmExecucao) {
        let estadoAleatorio = Math.random() > 0.5 ? 'Espera' : 'Pronto'; // 50% de chance
        processoEmExecucao.estado = estadoAleatorio;

        // Se o estado foi mudado para "Espera", agendar mudança para "Pronto" após 5 a 10 segundos
        if (estadoAleatorio === 'Espera') {
            // Inicia o contador de tempo em espera
            processoEmExecucao.tempoEmEspera = 0; // Reseta o contador

            // Faz a mudança para "Pronto" após 5 a 10 segundos
            let tempoEspera = Math.random() * 5000 + 5000; // 5 a 10 segundos
            setTimeout(() => {
                if (processoEmExecucao.estado === 'Espera') {
                    processoEmExecucao.estado = 'Pronto'; // Muda para Pronto
                }
                atualizarLista();
            }, tempoEspera);
        }
        processoEmExecucao = null; // Limpa a referência ao processo em execução
    }

    // Seleciona processos que estão em "Pronto" para serem executados
    let processosProntos = processos.filter(p => p.estado === 'Pronto');

    if (processosProntos.length > 0) {
        // Escolhe um processo aleatório para execução
        let proximoExecucao = processosProntos[Math.floor(Math.random() * processosProntos.length)];
        proximoExecucao.estado = 'Execução';
        processoEmExecucao = proximoExecucao;
    }

    // Processos que estão em "Espera" e ultrapassaram 10 segundos devem voltar a "Pronto"
    processos.forEach(processo => {
        if (processo.estado === 'Espera') {
            processo.tempoEmEspera += 5; // Incrementa o tempo em espera
            if (processo.tempoEmEspera >= 10) { // Se ultrapassar 10 segundos
                processo.estado = 'Pronto'; // Muda para "Pronto"
                atualizarLista();
            }
        }
    });

    // Atualiza a lista de processos na interface
    atualizarLista();
}

// Inicia a atualização automática a cada 5 segundos
setInterval(alterarEstados, 5000);
