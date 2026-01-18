import styles from './styles.module.css';
import {useEffect, useState} from "react";

export function ListTask() {
    const [tarefas, setTarefas] = useState<Array<{id: number, title: string, priority: string}>>([]);

    useEffect(() => {
        const tarefasSalvas = localStorage.getItem('tarefas');
        if (tarefasSalvas) {
            try {
                const dados = JSON.parse(tarefasSalvas);
                if (Array.isArray(dados)) {
                    setTarefas(dados);
                }
            } catch (error) {
                console.error('Erro ao carregar tarefas:', error);
            }
        }
    }, []);

    function deletarTarefa(id: number) {
        const tarefasAtuais = JSON.parse(localStorage.getItem('tarefas')) || [];
        const novasTarefas = tarefasAtuais.filter(tarefa => tarefa.id !== id);
        localStorage.setItem('tarefas', JSON.stringify(novasTarefas));
        setTarefas(novasTarefas);
        window.location.reload();
    }

    return (
        <>
            <h3 className={styles.title}>TAREFAS</h3>
            <div className={styles.tasksContainer}>
                {tarefas.map(tarefa => (
                    <div key={tarefa.id} className={styles.task}>
                        <div className={styles.taskContent}>
                            <strong className={styles.taskTitle}>
                                {tarefa.title.length > 40
                                    ? `${tarefa.title.substring(0, 40)}...`
                                    : tarefa.title}
                            </strong>
                            <span className={`${styles.prioridade} ${styles[tarefa.priority]}`}>
                                {tarefa.priority === 'low' ? 'Baixa' :
                                    tarefa.priority === 'medium' ? 'Média' : 'Alta'}
                            </span>
                            <div className={styles.btnTask}>
                                <button className={styles.btConcluida}>CONCLUÍDA</button>
                                <button className={styles.btEditar}>EDITAR</button>
                                <button className={styles.btDeletar} onClick={() => deletarTarefa(tarefa.id)}>
                                    DELETAR
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}