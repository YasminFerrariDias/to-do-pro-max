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
	const pendentes = tarefas.filter(t => !t.completed);
	const concluidas = tarefas.filter(t => t.completed);
	// define as prioridades dentro do pendentes e dos concluidos
	const pendentesOrdenadas = ordenarPorPrioridade(pendentes);
	const concluidasOrdenadas = ordenarPorPrioridade(concluidas);
	// junta a lista ordenada pendente e concluida em uma só
	const tarefasParaExibir = [...pendentesOrdenadas, ...concluidasOrdenadas];
	// define o tempo limite
	const tempoLimite = 7 * 24 * 60 * 60 * 1000;
	// TESTE DE 10s const tempoLimite = 10 * 1000;
	
	// carrega os dados do local com localStorage
	useEffect(() => {
		const tarefasSalvas = localStorage.getItem('tarefas');
		if (tarefasSalvas) {
			try {
				const dados = JSON.parse(tarefasSalvas);
				if (Array.isArray(dados)) {
					setTarefas(dados);
				}
			} catch (error) {
				console.log('Erro ao carregar tarefas!', error);
			}
		}
	}, []);
	
	function removerTarefasExpiradas() {
		const agora = Date.now();
		const todasTarefas = JSON.parse(localStorage.getItem('tarefas') || '[]');
		
		const tarefasAtualizadas = todasTarefas.filter((t: Tarefa) => {
			if (!t.completed) return true;
			if (!t.completedAt) return true;
			
			return (agora - t.completedAt) <= tempoLimite;
		});
		
		if (todasTarefas.length !== tarefasAtualizadas.length) {
			localStorage.setItem('tarefas', JSON.stringify(tarefasAtualizadas));
			setTarefas(tarefasAtualizadas);
			console.log(`Removidas ${todasTarefas.length - tarefasAtualizadas.length} tarefas expiradas`);
		}
	}
	
	useEffect(() => {
		removerTarefasExpiradas();
		
		const intervalo = setInterval(removerTarefasExpiradas, 5000); // Verifica a cada 5 segundos
		return () => clearInterval(intervalo);
	}, []);
	
	// define a ordem que deve aparecer pela prioridade
	function ordenarPorPrioridade(lista: Tarefa[]) {
		const ordem = {high: 3, medium: 2, low: 1};
		return [...lista].sort((a, b) =>
			(ordem[b.priority as keyof typeof ordem] || 0) -
			(ordem[a.priority as keyof typeof ordem] || 0)
		);
	}
	
	function deletarTarefa(id: number) {
		const tarefasAtuais = JSON.parse(localStorage.getItem('tarefas') as string) || [];
		const novasTarefas = tarefasAtuais.filter((tarefa: Tarefa) => tarefa.id !== id);
		localStorage.setItem('tarefas', JSON.stringify(novasTarefas));
		setTarefas(novasTarefas);
	}
	
	function iniciarEdicao(tarefa: Tarefa) {
		setEditandoId(tarefa.id);
		setNovoTitulo(tarefa.title);
		setNovaPrioridade(tarefa.priority);
	}
	
	function salvarEdicao() {
		if (!novoTitulo.trim()) {
			alert('Digite um título para a tarefa!');
			return;
		}
		
		// Validação de limite de 30 caracteres
		if (novoTitulo.length > 30) {
			alert('Máximo de 30 caracteres!');
			return;
		}
		
		// Validação de título duplicado
		const tarefaExistente = tarefas.find(t =>
			t.id !== editandoId &&
			t.title.toLowerCase() === novoTitulo.toLowerCase()
		);
		
		if (tarefaExistente) {
			alert('Já existe uma tarefa com este título!');
			return;
		}
		
		const todasTarefas = JSON.parse(localStorage.getItem('tarefas') || '[]');
		const tarefasAtualizadas = todasTarefas.map((t: Tarefa) =>
			t.id === editandoId
				? {...t, title: novoTitulo, priority: novaPrioridade}
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
			{tarefasParaExibir.length === 0 ? (
				// Quando NÃO tem tarefas
				<h3 className={styles.title}>TAREFAS - Nenhuma tarefa encontrada! Crie sua primeira tarefa.</h3>
			) : (
				<>
					<h3 className={styles.title}>TAREFAS</h3>
					<div className={styles.tasksContainer}>
						{tarefasParaExibir.map(tarefa => (
							<div
								key={tarefa.id}
								className={`${styles.task} ${tarefa.completed ? styles.concluido : ''}`}
							>
								{editandoId === tarefa.id ? (
									// MODO EDIÇÃO
									<div className={styles.edicaoContainer}>
										<input
											className={styles.inputEdicao}
											value={novoTitulo}
											onChange={(e) => {
												const valor = e.target.value;
												setNovoTitulo(valor);
											}}
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
													<XCircle
														size={20}
														color={tarefa.completed ? "var(--primary-fundo)" : "var(--primary)"}
													/>
												) : (
													<CheckCircle
														size={20}
														color={tarefa.completed ? "var(--primary-fundo)" : "var(--primary)"}
													/>
												)}
											</button>
											<button className={styles.btEditar} onClick={() => editarTarefa(tarefa.id)}>
												<Edit size={20} color={tarefa.completed ? "var(--primary-fundo)" : "var(--primary)"}
												/>
											</button>
											<button className={styles.btDeletar} onClick={() => deletarTarefa(tarefa.id)}>
												<Trash2 size={20} color={tarefa.completed ? "var(--primary-fundo)" : "var(--primary)"}
												/>
											</button>
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				</>
			)}
		</>
	);
}