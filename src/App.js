import "antd/dist/antd.css";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { Login } from "./components/Login";
import useToken from "./actions/useToken";
import { useEffect } from "react";

//App
function App() {
  //Custom Hook para solicitar y setear el token
  const { token, setToken } = useToken();

  //Cierra sesión después de una hora
  useEffect(() => {
    setTimeout(() => {
      setToken('')
    }, 3600000);
  }, [])

  //Condicional para verificar si el token existe, caso contrario enviará a la página de login
  if (!token) {
    return <Login setToken={setToken}></Login>;
  }

  
  

  return (
    <BrowserRouter>
      <div className="App" >
        <Dashboard />
      </div>
    </BrowserRouter>
  );
}

export default App;
