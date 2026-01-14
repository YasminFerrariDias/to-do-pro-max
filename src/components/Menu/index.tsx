import styles from './styles.module.css';

export function Menu() {
    return (
        <div className={styles.menu}>
          <div className={styles.content}>
            <h1>TO DO</h1>
            <p>Minhas Tarefas</p>
            <p>Meu Histórico</p>
          </div>
        </div>
    )
}