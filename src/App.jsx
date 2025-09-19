import './App.scss'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Home} from './pages';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home/>
        }
    ]);
    return (
    <> 
     <RouterProvider router={router}/>
     <ToastContainer /> 
    </>)
}

export default App
