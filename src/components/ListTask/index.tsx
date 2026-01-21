import styles from './styles.module.css';
import {useEffect, useState} from "react";
import {CheckCircle, Edit, Trash2} from "lucide-react";

export function ListTask() {
    const [tarefas, setTarefas] = useState<Array<{
        id: number;
        title: string;
        priority: string;
        completed: boolean;
        createdAt: number;
        completedAt: number | null;
    }>>([]);

    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [novoTitulo, setNovoTitulo] = useState('');
    const [novaPrioridade, setNovaPrioridade] = useState('');

    // carrega os dados salvos no localStorage
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
        const tarefasAtuais = JSON.parse(localStorage.getItem('tarefas') as string) || [];
        const novasTarefas = tarefasAtuais.filter(tarefa => tarefa.id !== id);
        localStorage.setItem('tarefas', JSON.stringify(novasTarefas));
        setTarefas(novasTarefas);
        window.location.reload();
    }

    function iniciarEdicao(tarefa: any) {
        setEditandoId(tarefa.id);
        setNovoTitulo(tarefa.title);
        setNovaPrioridade(tarefa.priority);
    }

    function salvarEdicao() {
        const tarefasAtualizadas = tarefas.map(tarefa =>
            tarefa.id === editandoId
                ? { ...tarefa, title: novoTitulo, priority: novaPrioridade }
                : tarefa
        );

        localStorage.setItem('tarefas', JSON.stringify(tarefasAtualizadas));
        setTarefas(tarefasAtualizadas);
        setEditandoId(null);
    }

    function editarTarefa(id: number) {
        const tarefa = tarefas.find(t => t.id === id);
        if (tarefa) iniciarEdicao(tarefa);
    }

    return (
        <>
            <h3 className={styles.title}>TAREFAS</h3>
            <div className={styles.tasksContainer}>
                {tarefas.map(tarefa => (
                    <div key={tarefa.id} className={styles.task}>
                        {editandoId === tarefa.id ? (
                            // MODO EDIÇÃO
                            <div>
                                <input
                                    value={novoTitulo}
                                    onChange={(e) => setNovoTitulo(e.target.value)}
                                    maxLength={30}
                                    style={{ height: '1.5rem', width: '15px', display: 'block' }}
                                />                                <select className={styles.prioritiEdt} value={novaPrioridade} onChange={(e) => setNovaPrioridade(e.target.value)}>
                                    <option value="low">Baixa</option>
                                    <option value="medium">Média</option>
                                    <option value="high">Alta</option>
                                </select>
                                <button className={styles.btnS} onClick={salvarEdicao}>Salvar</button>
                                <button className={styles.btnC} onClick={() => setEditandoId(null)}>Cancelar</button>
                            </div>
                        ) : (
                            // MODO VISUALIZAÇÃO
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
                                    <button className={styles.btConcluida}>
                                        <CheckCircle size={20} color='var(--primary)' />
                                    </button>
                                    <button className={styles.btEditar} onClick={() => editarTarefa(tarefa.id)}>
                                        <Edit size={20} color='var(--primary)' />
                                    </button>
                                    <button className={styles.btDeletar} onClick={() => deletarTarefa(tarefa.id)}>
                                        <Trash2 size={20} color='var(--primary)' />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}