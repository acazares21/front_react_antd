import React from "react";
import { Layout } from "antd";
import "antd/dist/antd.css";
import { SiderLogin } from "./SiderLogin";
import { ContentLogin } from "./ContentLogin";
import { Typography } from "antd";

/*
 *Componente para la interfaz de la página de login.
 */
export const Login = ({ setToken }) => {
  const { Header, Footer, Sider, Content } = Layout;
  const style = {
    padding: "8px 0",
  };

  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Header>
          <Typography.Title
            level={1}
            style={{ color: "white" }}
          ></Typography.Title>
        </Header>

        <Layout hasSider="true">
          <Sider style={{ position: "sticky", bottom: "0" }} width="444">
            <div>
              <SiderLogin />
            </div>
          </Sider>
          <Content>
            <ContentLogin setToken={setToken} />
          </Content>
        </Layout>

        <Footer
          style={{ position: "fixed", left: "0", bottom: "0", width: "100%" }}
        >
          <Typography.Title
            level={1}
            style={{ color: "black" }}
          ></Typography.Title>
        </Footer>
      </Layout>
    </div>
  );
};
