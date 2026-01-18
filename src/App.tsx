import './styles/theme.css';
import './styles/global.css';
import { Menu } from "./components/Menu";
import { NewTask } from "./components/NewTask";
import {ListTask} from "./components/ListTask";

export function App() {
    return (
        <>
            <Menu />
            <div id="container" className="container">
                <div className="princ">
                    <div id="newTask" className="newTask">
                        <NewTask />
                    </div>

                    <div id="conteudo" className="conteudo">
                        <ListTask />
                    </div>
                </div>
                <div id="metricas" className="metricas">
                    <p>METRICAS</p>
                </div>
            </div>
        </>
    )
}
