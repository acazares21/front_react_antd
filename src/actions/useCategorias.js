import { useState } from 'react';

//Custom Hook para solicitar y setear el token
export default function useToken() {
  //Solicita el token
  const getCategoria = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
  };

  const [categoria, setCategoria] = useState(getCategoria());

  //Setea el token
  const saveToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setCategoria(userToken.token);
  };

  //Regresa el token
  return {
    setCategoria: saveToken,
    categoria
  }

}