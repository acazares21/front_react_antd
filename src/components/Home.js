import { Divider } from 'antd'
import React from 'react'
import { Dashboard } from './Dashboard'
import { Routes, Route } from 'react-router-dom';
import { LayoutComponent } from './LayoutComponent';
import { Proyectos } from './Proyectos';
import { Typography } from 'antd';
import { Login } from './Login';

const { Text } = Typography;

export const Home = () => {
  return (
    <Divider >
      <Routes>
          <Route path="/" element={<LayoutComponent/>}>
          <Route index element={<Dashboard/>} />
          <Route path="login" element={<Login/>} />
          <Route path="proyectos" element={<Proyectos/>} />
          <Route path="*" element={<NoPage/>} />
          </Route>
    </Routes>
    </Divider>
  )
}

const NoPage = () =>{
  return(
    <div>
      <Text type="danger"> ERROR, NO EXISTE LA PÁGINA SOLICITADA.</Text>
    </div>
  )
}