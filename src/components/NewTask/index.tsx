import styles from './styles.module.css';

export function NewTask() {
    function inserirCampo() {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Qual sua próxima tarefa?';
        input.name = 'title'
        document.getElementById('newTask')?.appendChild(input);

        const select = document.createElement('select');
        select.name = 'Prioridade';

        const placeholder = document.createElement('option');
        placeholder.value = ""; // Valor vazio
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

        document.getElementById('newTask')?.appendChild(select);

        const button = document.createElement('button');
        button.type = 'submit';
        button.onclick = salvarDados;
        button.className = styles.btnSalvar;
        button.textContent  = 'SALVAR';

        document.getElementById('newTask')?.appendChild(button);

        const btn = document.getElementById('btn');
        if (btn) {
            btn.hidden = true;
        }
    }

    function salvarDados() {
        alert("Botão salvar funcionando!");
    }

    return (
        <button id={'btn'} onClick={inserirCampo} type='button' className={styles.btn}>ADICIONAR NOVA TAREFA</button>
    )
}