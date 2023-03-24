import { Card, Avatar, Typography } from "antd";
import React, { useState, useEffect } from "react";
import useToken from "../actions/useToken";

const { Meta } = Card;

export const Resumen = () => {
  //Hook para el Token
  const { token, setToken } = useToken();
  //Hook para los planes
  const [planes, setPlanes] = useState([]);
  //Hook para los planes
  const [usuarios, setUsuarios] = useState([]);
  //Hook para los planes
  const [usuarioMensaje, setUsuarioMensaje] = useState([]);
  //Hook para los ultimos planes
  const [lastPlan, setLastPlan] = useState([]);
  //Hook para holdear la fecha de los planes
  const [planFecha, setPlanFecha] = useState({});

  //PLANES
  async function getPlanes(token) {
    return fetch("http://localhost:8080/api/planes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      //body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        setPlanes(data);
        console.log("ASI LLEGAN LOS DATOS DE LOS PLANES", data.planes);
      })
      .then(handleLastPlan())
      .catch((error) => {
        console.error(error);
      });
  }

  //USUARIOS
  async function getUsuarios(token) {
    return fetch("http://localhost:8080/api/usuarios", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      //body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        setUsuarios(data);
        console.log("ASI LLEGAN LOS DATOS DE LOS USUARIOS", data.users);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //Hace las consultas
  const Consultas = async (values) => {
    const authToken = "Bearer " + token;
    await getPlanes(authToken);
    await getUsuarios(authToken);
    //console.log("TOKEN: ", authToken);
  };

  //Hook de useEffect para setear automaticamente los datos de los menus cada 21 segundos (tablas y segmented)
  useEffect(() => {
     setTimeout(() => {
      Consultas();
      MessageWelcome()
      handleLastPlan()
    }, 1000);
  }
  //, []
  );

  //Mensaje de bienvenida
  const MessageWelcome = ()=>{
    //console.log("TEST: ", usuarios.users)
    for (let i in usuarios.users) {
        //console.log("TEST CORREO: ", usuarios.users[i].correo)
        if (usuarios.users[i].correo === localStorage.getItem('userLoged')){
            console.log("ENCONTRADO")
            setUsuarioMensaje(usuarios.users[i].usuario)
        }
    }
    return(
        <Typography.Title level={3} italic>
        Bienvenido, {usuarioMensaje}
      </Typography.Title>
    )
    
  }

  //Último plan
  const handleLastPlan = () =>{
    let sel = [];
    let selMod = []
    for (const i in planes.planes) {
        if (planes.planes[i].fecha_ingreso!== null){
            console.log("FECHA",planes.planes[i].fecha_modifica_id)
            sel.push(planes.planes[i].fecha_ingreso)
            selMod.push(planes.planes[i].fecha_modifica_id)
        }
    }
    console.log("FECHAS RECOPILADAS: ", sel)
    console.log("FECHAS RECOPILADAS MODIFICADAS: ", selMod)
    setLastPlan(Math.max(...sel))
    console.log("SETEADO EL ULTIMO PLAN: ", lastPlan)
  }

  return (
    <div>
      {/* <Typography.Title level={3} italic>
        Bienvenido, {usuarioMensaje}
      </Typography.Title> */}

      {/* Muestra un mensaje de bienvenida junto al nombre del usuario logeado */}
      <MessageWelcome/> 

      <h1>Último plan registrado</h1>
      <Card
        hoverable
        // onClick={messageWelcome
        // }
      >
        <Meta
          avatar={
            <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
          }
          title="'Nombre del plan'"
          description="'Descripción del plan'"
        />
      </Card>
      <h1></h1>
      <h1>Último plan modificado</h1>
      <Card
        hoverable
        onClick={() =>
          console.log("CARD SELECCIONADO: 'Aquí van los datos del plan'")
        }
      >
        <Meta
          avatar={
            <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
          }
          title="'Nombre del plan'"
          description="'Descripción del plan'"
        />
      </Card>
      <h1>Último proyecto registrado</h1>
      <Card
        hoverable
        // onClick={messageWelcome
        // }
      >
        <Meta
          avatar={
            <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
          }
          title="'Nombre del plan'"
          description="'Descripción del plan'"
        />
      </Card>
      <h1></h1>
      <h1>Último proyecto modificado</h1>
      <Card
        hoverable
        onClick={() =>
          console.log("CARD SELECCIONADO: 'Aquí van los datos del plan'")
        }
      >
        <Meta
          avatar={
            <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
          }
          title="'Nombre del plan'"
          description="'Descripción del plan'"
        />
      </Card>
    </div>
  );
};
