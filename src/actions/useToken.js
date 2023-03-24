import { useState } from 'react';

//Custom Hook para solicitar y setear el token
export default function useToken() {
  //Solicita el token
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
  };

  const [token, setToken] = useState(getToken());

  //Setea el token
  const saveToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.token);
  };

  //Regresa el token
  return {
    setToken: saveToken,
    token
  }

}
