import {Provider} from "./components/ui/provider"
import ReactDOM from "react-dom/client"
import App from "./App/App.tsx"
import {BrowserRouter} from 'react-router-dom'


ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
)
