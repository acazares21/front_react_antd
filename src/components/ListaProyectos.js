import React, { useState, useEffect } from "react";
import { Image, Card, Carousel, Typography, Divider, Row, Col } from "antd";

import useToken from "../actions/useToken";

const contentStyle = {
  margin: 0,
  height: "calc(44vh - 55px)",
  color: "#fff",
  // lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

export const ListaProyectos = () => {
  //Hook para el Token
  const { token, setToken } = useToken();

  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };

  //proyectos
  const [proyectos, setProyectos] = useState([]);

  //PROYECTOS
  async function getProyectos(token) {
    return fetch("http://localhost:8080/api/proyectos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      //body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let proSelected = [];
        for (let i in data.projects) {
          proSelected.push({
            value: data.projects[i].id,
            label: data.projects[i].nombre,
            nombre: data.projects[i].nombre,
            id: data.projects[i].id,
            status: data.projects[i].status,
          });
        }

        console.log("Evaluar datos PRO: ", proSelected);
        setProyectos(proSelected);

        //console.log("Evaluar datos PROYECTO: ", data)
        //setProyectos(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //Hace las consultas
  const Consultas = async (values) => {
    const authToken = "Bearer " + token;
    await getProyectos(authToken);
  };

  //Hook de useEffect para setear automaticamente los datos de los menus cada 21 segundos (tablas y segmented)
  useEffect(() => {
    //setTimeout(() => {
    Consultas();
    //}, 4000);
  }, []);

  const { Meta } = Card;

  const ShowProjects = () => {
    let display = [];
    for (let i in proyectos) {
      display[i] = (
        // <div>
        //   <h3 id={proyectos[i].id} style={contentStyle}>
        //     <p>{proyectos[i].nombre}</p>
        //     <p>{proyectos[i].id}</p>
        //     <p>{proyectos[i].status}</p>
        //   </h3>
        // </div>
        <Col span={8}>
          <Card
            hoverable
            style={{
              width: 240,
            }}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            onClick={()=>(console.log("CARD SELECCIONADO: ", proyectos[i].nombre))}
          >
            <Meta title={proyectos[i].nombre} description={"Estado: "+proyectos[i].status} />
          </Card>
        </Col>
      );
    }
    return (
      <div>
        <Row gutter={16} wrap>{display}</Row>
      </div>
    );
  };

  return (
    <div>
      <div className="site-card-border-less-wrapper">
        {/* <Card
          title="Proyectos"
          bordered={false}
          style={{
            width: 222,
          }}
        >
          <Image
            width={200}
            src="https://www.dinami.ec/wp-content/uploads/2021/09/logo-blanco.png"
          />
        </Card> */}
        {/* <Divider>
          <Typography.Title level={5}>Listado de proyectos</Typography.Title>
        </Divider> */}
        <Card
        title={"Listado de proyectos"}
          bordered={true}
          style={{
            width: "auto",
            height: "calc(100vh - 55px)",
          }}
        >
          {/* <Carousel afterChange={onChange}> */}
          <ShowProjects />
          {/* <div>
            <h3 style={contentStyle}>1</h3>
          </div>
          <div>
            <h3 style={contentStyle}>2</h3>
          </div>
          <div>
            <h3 style={contentStyle}>3</h3>
          </div>
          <div>
            <h3 style={contentStyle}>4</h3>
          </div> */}
          {/* </Carousel> */}
        </Card>
      </div>
    </div>
  );
};
