import React from 'react'
import { Layout, Space, Typography, Divider, Card } from 'antd';
import { BotonNuevoProyecto, NuevoProyecto } from './NuevoProyecto';
import { PlusOutlined } from '@ant-design/icons';
import './ContentProyectos.css'
import { ListaProyectos } from './ListaProyectos';

const { Header, Footer, Sider, Content, Text } = Layout;

export const ContentProyectos = () => {
  return (
    
        <Layout>
            <Sider>
                <div className="site-card-border-less-wrapper">
                    <Card
                    title="Nuevo Proyecto"
                    bordered={true}
                    style={{
                        width: 'auto',
                        height: "calc(111vh - 55px)"
                    }}
                >
                        <BotonNuevoProyecto/>
                    </Card>
                </div>
            </Sider>
            <Content>
                <ListaProyectos/>
            </Content>
        </Layout>
    
  )
}
