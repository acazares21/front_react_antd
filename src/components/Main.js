import React from 'react';
import { Layout } from 'antd';
import { Login } from './Login';
import { Proyectos } from './Proyectos';
import { Typography } from 'antd';
import { Routes, Route } from 'react-router-dom';
import { LayoutComponent } from './LayoutComponent';
import { Home } from './Home';
import { useState } from "react";
import { Planes } from '../components/Planes';
import { Dashboard } from './Dashboard';

const { Header, Footer, Content } = Layout;
const { Text } = Typography;

/**
*Componente principal para el renderizado de la interfaz de usuario.
*Lugar donde se conectará al redux store.
*Aquí va el encabezado general de la página junto con el pie de página.
*En el content se encuentra el componente que se mostrará de acuerdo a lo requerido por el usuario a través del breadcrumb mediante react router.
**/
 
export const Main = () => {
  return (
    <div>
      <Layout>
        <Header>
          <Typography.Title level={1} style={{color:'white'}}>Encabezado general</Typography.Title>
        </Header>

        
          <Content style={{position: '0', width: '100'}}>
            <Routes>
              <Route path="/" element={<LayoutComponent/>}>
                <Route index element={<Dashboard/>} />
                <Route path="proyectos" element={<Proyectos/>} />
                <Route path="*" element={<NoPage/>} />
              </Route>
            </Routes>
            <Dashboard/>
          </Content>
        
        
        
          <Footer>PIE DE PÁGINA GENERAL.</Footer>
        
      </Layout>
    </div>
  )
}

const NoPage = () =>{
  return(
    <div>
      <Text type="danger"> ERROR, NO EXISTE LA PÁGINA SOLICITADA.</Text>
    </div>
  )
}