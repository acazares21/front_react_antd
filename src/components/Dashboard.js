import React, { useState } from "react";
import {
  FileDoneOutlined,
  BookOutlined,
  AppstoreOutlined,
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  PoweroffOutlined,
  BarsOutlined,
  SlidersOutlined
} from "@ant-design/icons";
import { Breadcrumb, Button, Layout, Menu, Image, Typography } from "antd";
import { Proyectos } from "./Proyectos";
import { Footer } from "antd/lib/layout/layout";
import useToken from "../actions/useToken";
import "./Dashboard.css";
import { Planes } from "./Planes";
import { Settings } from "../components/settings/settings";
import { Resumen } from "../components/Resumen"

const { Paragraph } = Typography;

//PLANES
async function getPlanes(token) {
  return fetch("http://localhost:8080/api/planes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    //body: JSON.stringify(credentials),
  }).then((data) => console.log(data));
}
//PROYECTOS
async function getProyectos(token) {
  return fetch("http://localhost:8080/api/proyectos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    //body: JSON.stringify(credentials),
  }).then((data) => data.json());
}
//SUSCRIPCIONES
async function getSuscripciones(token) {
  return fetch("http://localhost:8080/api/suscripciones", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    //body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

const { Header, Content, Sider } = Layout;

//Items para label horizontal
const items1 = [
  { key: "home", icon: <HomeOutlined /> },
  { key: "ajustes", icon: <SettingOutlined /> },
  {
    key: "cuenta",
    icon: <UserOutlined />,
    children: [
      { label: "Cerrar sesión", key: "logout", icon: <PoweroffOutlined /> },
    ],
  },
];

//Items para la barra lateral
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
//Mapeo de los Items de cada menu y submenu de la barra lateral
const items = [
  getItem("Resumen", "summary", <BarsOutlined />),
  getItem("Planes", "sub1", <FileDoneOutlined />, [
    getItem("Todos los planes", "1"),
    getItem("Opción 2", "2"),
    getItem("Opción 3", "3"),
    getItem("Opción 4", "4"),
  ]),
  getItem("Proyectos", "sub2", <AppstoreOutlined />, [
    getItem("Todos los proyectos", "5"),
    getItem("Opción 6", "6"),
    getItem("Submenu", "sub3", null, [
      getItem("Opción 7", "7"),
      getItem("Opción 8", "8"),
    ]),
  ]),
  getItem("Suscripciones", "sub4", <BookOutlined />, [
    getItem("Todas las suscripciones", "9"),
    getItem("Opción 10", "10"),
    getItem("Opción 11", "11"),
    getItem("Opción 12", "12"),
  ]),
  getItem("Administración", "admin", <SlidersOutlined />, [
    getItem("Opción 13", "13"),
    getItem("Opción 14", "14"),
    getItem("Opción 15", "15"),
    getItem("Opción 16", "16"),
  ]),
];

//Keys para los submenus de primer nivel
const rootSubmenuKeys = ["sub1", "sub2", "sub4"];

export const Dashboard = () => {
  //  ****  HOOKS ****
  //Hook para el content
  const [current, setCurrent] = useState("summary");
  //Hook para el Token
  const { token, setToken } = useToken();
  //Hook para el content
  //const [content, setContent] = useState(current);

  const ClickButton = async (values) => {
    const authToken = "Bearer " + token;
    await getPlanes(authToken);
    console.log("TOKEN: ", authToken);
  };

  //Cerrar sesión
  const LogOut = () => {
    setToken(" ");
    console.log(token);
    window.location.reload(false);
  };

  //Maneja el evento al dar click sobre alguna opción del menú
  const onClick = (e) => {
    console.log("click ", e);
    if (e.key === "logout") {
      console.log("cerrar sesión ", e.key);
      LogOut();
    }
    setCurrent(e.key);
  };

  //Maneja el evento al dar click sobre la opción de cerrar sesión
  const onClickLogOut = (e) => {
    console.log("click ", e);

    //setCurrent(e.key);
  };

  //Cerrar automáticamente cada menú al abrir uno nuevo
  const [openKeys, setOpenKeys] = useState(["summary"]);
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  //Renderizado del contenido del Dashboard de acuerdo a las opciones del menú lateral
  const ContentRender = (content) => {
    switch (current) {
      case "1":
        return <Planes />;
        break;
      
      case "summary":
        return <Resumen></Resumen>

      case "5":
        return <Proyectos />;
        break;
      default:
        return console.log(current);
    }
  };

  //Renderizazdo del contenido del Dashboard de acuerdo a las opciones del menú horizontal
  const ContentRenderHeader = () => {
    switch (current) {
      case "home":
        return <Planes />;
        break;
      case "ajustes":
        return <Settings />;
        break;
      case "cuenta":
        return <Proyectos />;
        break;
      default:
        return console.log(current);
    }
  };

  //Renderizado de la UI
  return (
    <div style={{ height: "calc(100vh - 55px)" }}>
      <Layout>
        <Header
          className="header"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
          }}
        >
          <div className="logo" />

          <div>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={["home"]}
              items={items1}
              onClick={onClick}
              style={{ margin: "0px 50px 75px 89%", width: "14%" }}
            />
          </div>
        </Header>
        <Layout hasSider style={{ height: "calc(100vh - 70px)" }}>
          {/* <ContentRenderHeader/> */}
          <Sider
            width={200}
            className="site-layout-background"
            style={{ overflow: "scroll" }}
          >
            <Menu
              theme="light"
              mode="inline"
              onOpenChange={onOpenChange}
              openKeys={openKeys}
              items={items}
              onClick={onClick}
              selectedKeys={[current]}
            />
          </Sider>
          <Layout
            style={{
              padding: "0 24px 24px",
            }}
          >
            <Breadcrumb
              style={{
                margin: "16px 0",
              }}
            >
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            </Breadcrumb>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                overflow: "scroll",
              }}
            >
              <div style={{ height: "calc(100vh - 55px)" }}>
                {/* Content
              <Button type="primary" onClick={LogOut}>
                Cerrar Sesión
              </Button> */}
                <ContentRender />
                <ContentRenderHeader />
              </div>
            </Content>
          </Layout>
        </Layout>
        <Layout>
          <Footer
            style={{ position: "fixed", left: "0", bottom: "0", width: "100%" }}
          >
            <Paragraph level={5} italic type="secondary" disabled>
              ...
            </Paragraph>
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};
