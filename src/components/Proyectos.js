import React from 'react'
import { Card, Layout, Typography } from 'antd';
import { ContentProyectos } from './ContentProyectos';
const { Header, Footer, Sider, Content } = Layout;

export const Proyectos = () => {
  return (
    <div style={{ height: "calc(100vh - 55px)" }}>
        {/* <Layout>
            <Header>
              <Typography.Title level={1} style={{color:'white'}}>Sección de Proyectos</Typography.Title>
            </Header> */}
            <Content>
              
                <ContentProyectos></ContentProyectos>
            </Content>
            {/* <Footer>Footer</Footer>
        </Layout> */}
    </div>
  )
}
