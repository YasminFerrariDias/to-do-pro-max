import styles from './styles.module.css';
import {useEffect, useState} from "react";
import {CheckCircle, Edit, Trash2, XCircle} from "lucide-react";

export function ListTask() {
	interface Tarefa {
		id: number;
		title: string;
		priority: string;
		completed?: boolean;
		createdAt?: number;
		completedAt?: number | null;
	}
	
	const [tarefas, setTarefas] = useState<Tarefa[]>([]);
	const [editandoId, setEditandoId] = useState<number | null>(null);
	const [novoTitulo, setNovoTitulo] = useState('');
	const [novaPrioridade, setNovaPrioridade] = useState('');
	/*const [filtro, setFiltro] = useState('todas');
	const [ordenacao, setOrdenacao] = useState('prioridade');*/
	
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
	
	/*const tarefasFiltradas = tarefas.filter(tarefa => {
		if (filtro === 'pendentes') return !tarefa.completed;
		if (filtro === 'concluidas') return tarefa.completed;
		return true;
	});
	
	const tarefasOrdenadas = [...tarefasFiltradas].sort((a, b) => {
		if (ordenacao === 'prioridade') {
			const ordem = { high: 3, medium: 2, low: 1 };
			return ordem[b.priority] - ordem[a.priority];
		}
		return (b.createdAt || 0) - (a.createdAt || 0);
	});*/
	
	function deletarTarefa(id: number) {
		const tarefasAtuais = JSON.parse(localStorage.getItem('tarefas') as string) || [];
		const novasTarefas = tarefasAtuais.filter((tarefa: Tarefa) => tarefa.id !== id);
		localStorage.setItem('tarefas', JSON.stringify(novasTarefas));
		setTarefas(novasTarefas);
		// REMOVA: window.location.reload();
	}
	
	function iniciarEdicao(tarefa: Tarefa) {
		setEditandoId(tarefa.id);
		setNovoTitulo(tarefa.title);
		setNovaPrioridade(tarefa.priority);
	}
	
	function salvarEdicao() {
		const todasTarefas = JSON.parse(localStorage.getItem('tarefas') || '[]');
		const tarefasAtualizadas = todasTarefas.map((t: Tarefa) =>
			t.id === editandoId
				? { ...t, title: novoTitulo, priority: novaPrioridade }
				: t
		);
		
		localStorage.setItem('tarefas', JSON.stringify(tarefasAtualizadas));
		setTarefas(tarefasAtualizadas);
		setEditandoId(null);
	}
	
	function editarTarefa(id: number) {
		const tarefa = tarefas.find(t => t.id === id);
		if (tarefa) iniciarEdicao(tarefa);
	}
	
	function toggleConcluida(id: number) {
		const tarefasAtualizadas = tarefas.map(tarefa =>
			tarefa.id === id
				? {
					...tarefa,
					completed: !tarefa.completed,
					completedAt: tarefa.completed ? null : Date.now()
				}
				: tarefa
		);
		
		localStorage.setItem('tarefas', JSON.stringify(tarefasAtualizadas));
		setTarefas(tarefasAtualizadas);
	}
	
	return (
		<>
			<h3 className={styles.title}>TAREFAS</h3>
			{/*<div className={styles.controles}>
				<select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
					<option value="todas">Todas</option>
					<option value="pendentes">Pendentes</option>
					<option value="concluidas">Concluídas</option>
				</select>
				
				<select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)}>
					<option value="prioridade">Prioridade</option>
					<option value="data">Data</option>
				</select>
				
				<p>Mostrando {tarefasOrdenadas.length} de {tarefas.length} tarefas</p>
			</div>*/}
			<div className={styles.tasksContainer}>
				{tarefas.map(tarefa => (
					<div key={tarefa.id} className={styles.task}>
						{editandoId === tarefa.id ? (
							// MODO EDIÇÃO
							<div className={styles.edicaoContainer}>
								<input
									className={styles.inputEdicao}
									value={novoTitulo}
									onChange={(e) => setNovoTitulo(e.target.value)}
									maxLength={30}
								/>
								<select
									className={styles.selectEdicao}
									value={novaPrioridade}
									onChange={(e) => setNovaPrioridade(e.target.value)}
								>
									<option value="low">Baixa</option>
									<option value="medium">Média</option>
									<option value="high">Alta</option>
								</select>
								<button className={styles.btnSalvarEdicao} onClick={salvarEdicao}>
									Salvar
								</button>
								<button className={styles.btnCancelarEdicao} onClick={() => setEditandoId(null)}>
									Cancelar
								</button>
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
									<button
										className={styles.btConcluida}
										onClick={() => toggleConcluida(tarefa.id)}
									>
										{tarefa.completed ? (
											<CheckCircle
												size={20}
												color="var(--primary)"
											/>
										) : (
											<XCircle
												size={20}
												color="var(--primary)"
											/>
										)}
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