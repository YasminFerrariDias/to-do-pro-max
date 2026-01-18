import styles from './styles.module.css';

export function NewTask() {

    // NewTask.jsx - Verifica diretamente do localStorage
    const tarefasSalvas = localStorage.getItem('tarefas');
    const listaTarefas = tarefasSalvas ? JSON.parse(tarefasSalvas) : [];
    const podeAdicionar = listaTarefas.length < 10;

    function inserirCampo() {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Qual sua próxima tarefa?';
        input.name = 'title';
        input.maxLength = 30;
        input.oninput = function() {
            if (this.value.length >= 30) {
                alert('Máximo de 30 caracteres atingido!');
            }
        };

        const select = document.createElement('select');
        select.name = 'prioridade';

        const placeholder = document.createElement('option');
        placeholder.value = ""; // Valor vazio, porque o usuario vai escolher qual é
        placeholder.textContent = "Prioridade";
        placeholder.disabled = true;
        placeholder.selected = true;
        placeholder.hidden = true;
        select.appendChild(placeholder);

        const option1 = document.createElement('option');
        option1.value = 'low';
        option1.textContent = 'Baixa';

        const option2 = document.createElement('option');
        option2.value = 'medium';
        option2.textContent = 'Média';

        const option3 = document.createElement('option');
        option3.value = 'high';
        option3.textContent = 'Alta';

        select.appendChild(option1);
        select.appendChild(option2);
        select.appendChild(option3);

        const button = document.createElement('button');
        button.type = 'button';
        button.onclick = salvarDados;
        button.className = styles.btnSalvar;
        button.textContent  = 'SALVAR';

        // adiciona os elementos ao container
        const container = document.getElementById('newTaskInputs');
        if (container) {
            container.appendChild(input);
            container.appendChild(select);
            container.appendChild(button);
        }

        const btnAdicionar = document.getElementById('btn');
        if (btnAdicionar) {
            btnAdicionar.hidden = true;
        }
    }

    // responsavel por salvar os dados no local, que é chamado no inicio da pagina
    function salvarDados() {
        // pega os valores dos campos
        const inputTitulo = document.querySelector('input[name="title"]');
        const selectPrioridade = document.querySelector('select[name="prioridade"]');

        // confere se exite algum dado digitado
        if (inputTitulo != null && selectPrioridade != null) {
            // trim - tira os espaços em branco no inicio e no fim
            const titulo = (inputTitulo as HTMLInputElement).value.trim();
            const prioridade = (selectPrioridade as HTMLSelectElement).value;

            // Validação básica
            if (!titulo) {
                alert('Digite o título da tarefa!');
                return;
            }

            if (!prioridade) {
                alert('Selecione uma prioridade!');
                return;
            }

            // vai definir como vai ser salvo
            const novaTarefa = {
                id: Date.now(),
                title: titulo,
                completed: false,
                priority: prioridade,
                createdAt: Date.now(),
                completedAt: null
            }

            // busca tarefas existentes
            const tarefasSalvas = localStorage.getItem('tarefas');
            const listaTarefas = tarefasSalvas ? JSON.parse(tarefasSalvas) : [];

            // adiciona a nova tarefa na lista
            listaTarefas.unshift(novaTarefa);

            // salva a nova lista no localStorage
            localStorage.setItem('tarefas', JSON.stringify(listaTarefas));

            window.location.reload();

            //some os campos para escrever e volta o botão
            const container = document.getElementById('newTaskInputs');
            if (container) {
                container.innerHTML = ''; // remove os campos
            }

            const btnAdicionar = document.getElementById('btn');
            if (btnAdicionar) {
                btnAdicionar.hidden = false; // mostra o botão de adicionar
            }

            alert('Tarefa salva com sucesso!');

        } else {
            alert('ERRO: Campos não encontrados!');
            return;
        }
    }

    return (
        <>
            {podeAdicionar ? (
                <button id={'btn'} onClick={inserirCampo} className={styles.btn}>
                    ADICIONAR NOVA TAREFA
                </button>
            ) : (
                <p className={styles.limite}>Você alcançou o limite de 10 atividades simultâneas!</p>
            )}
            <div id="newTaskInputs"></div>
        </>
    )
}
