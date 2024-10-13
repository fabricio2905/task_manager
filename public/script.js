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
            disco: disco,
            prioridade: prioridade,
            estado: 'Pronto',
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
                // Após adicionar com sucesso, carregar novamente os processos
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

// Função para atualizar a lista de processos na interface
function atualizarLista() {
    const listaProcessos = document.getElementById('lista-processos');
    listaProcessos.innerHTML = '';

    processos.forEach((processo) => {
        const li = document.createElement('li');
        li.innerHTML = `${processo.pid} | CPU: ${processo.usoCpu}% - Memória: ${processo.usoMemoria}MB - Disco: ${processo.disco}MB - Prioridade: ${processo.prioridade} - Usuário: ${processo.usuario} <span class="estado">${processo.estado}</span>`;
        
        const btnRemover = document.createElement('button');
        btnRemover.textContent = 'Remover';
        btnRemover.onclick = () => removerProcesso(processo.id);
        li.appendChild(btnRemover);

        listaProcessos.appendChild(li);
    });
}

// Função para limpar os campos do formulário
function limparFormulario() {
    document.getElementById('nome').value = '';
    document.getElementById('disco').value = '';
    document.getElementById('prioridade').value = 'Média';  // Ou o valor padrão que você deseja
}

// Função para carregar processos do backend ao iniciar
function carregarProcessos() {
    fetch('/processos')
        .then(response => response.json())
        .then(data => {
            processos = data;
            atualizarLista();
        })
        .catch(error => console.error('Erro ao carregar processos:', error));
}

// Chama a função para carregar processos quando a página for carregada
window.onload = carregarProcessos;

// Função para remover um processo (opcional)
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

// Função para alterar estados automaticamente a cada 5 segundos
function alterarEstados() {
    if (processoEmExecucao) {
        let estadoAleatorio = Math.random() > 0.5 ? 'Espera' : 'Pronto'; // 50% de chance
        processoEmExecucao.estado = estadoAleatorio;

        if (estadoAleatorio === 'Espera') {
            processoEmExecucao.tempoEmEspera = 0;

            let tempoEspera = Math.random() * 5000 + 5000; // 5 a 10 segundos
            setTimeout(() => {
                if (processoEmExecucao.estado === 'Espera') {
                    processoEmExecucao.estado = 'Pronto';
                    atualizarLista();
                }
            }, tempoEspera);
        }
        processoEmExecucao = null;
    }

    let processosProntos = processos.filter(p => p.estado === 'Pronto');

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
