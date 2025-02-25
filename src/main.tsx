import {Provider} from "./components/ui/provider"
import ReactDOM from "react-dom/client"
import App from "./App/App.tsx"
import {
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
    Route,
} from 'react-router-dom';


 const router = createBrowserRouter(
    createRoutesFromElements(<Route path='/' element={<App/>}></Route>)
);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider>
        <RouterProvider router={router}/>
    </Provider>
)
