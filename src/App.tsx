import './styles/theme.css';
import './styles/global.css';
import {Menu} from "./components/Menu";
import {NewTask} from "./components/NewTask";

export function App() {
    return (
        <>
            <Menu />
            <div className="content">
                <div className="conteudo">
                    <p>METRICAS</p>
                    <NewTask />
                </div>
            </div>
        </>
    )
}
