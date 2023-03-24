import React from "react";
import { useState } from "react";
import {
  Button,
  Typography,
  Divider,
  Form,
  Input,
  Checkbox,
  Card,
  Space,
} from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { PropTypes } from "prop-types";
import "./ContentLogin.css";
import { Content } from "antd/lib/layout/layout";
import { Layout } from "antd";

const { Text } = Typography;

//Se toman las credenciales como argumento y usa fetch para solicitudes POST
async function loginUser(credentials) {
  return fetch("http://localhost:8080/api/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

//Contenido de la sección de login
export const ContentLogin = ({ setToken }) => {
  //useStates Hooks para obtener y setear las credenciales
  const [correo, setCorreo] = useState();
  const [password, setPassword] = useState();

  const { Content } = Layout;

  const onFinish = async (values) => {
    //values.preventDefault();
    const token = await loginUser({
      correo,
      password,
    });
    setToken(token);
    console.log("Received values of form: ", values);
  };

  return (
    <>
      <Card>
        <Space
          direction="vertical"
          size={44}
          className="space1"
          align="center"
          style={{ display: "flex" }}
        >
          <span />
          <span />
          <h1 className="login-tittle">LOGIN</h1>
          <Content>
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <Space
                direction="vertical"
                size={24}
                className="space2"
                style={{ display: "flex" }}
              >
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "¡Por favor ingrese su usuario!",
                    },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="site-form-item-icon" />}
                    placeholder="Correo"
                    onChange={(e) => setCorreo(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "¡Por favor ingrese su contraseña!",
                    },
                  ]}
                >
                  <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Contraseña"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Item>
              </Space>
              <Space size={22} direction="vertical">
                <span />
                <Form.Item>
                  <Space wrap>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox>Recordarme</Checkbox>
                    </Form.Item>
                    <a className="login-form-forgot" href="a">
                      ¿Olvidaste la contraseña?
                    </a>
                  </Space>
                </Form.Item>
                <Form.Item>
                  <Space
                    size={21}
                    className="space2"
                    style={{ display: "flex" }}
                  >
                    <Button type="primary" htmlType="submit" onClick={()=>(localStorage.setItem('userLoged', correo))}>
                      Iniciar sesión
                    </Button>
                    <span>ó</span>
                    <a href="a">¡Regístrate ahora!</a>
                  </Space>
                </Form.Item>
              </Space>
            </Form>
          </Content>
          <span />
          <span />
        </Space>
      </Card>
    </>
  );
};

ContentLogin.propTypes = {
  setToken: PropTypes.func.isRequired,
};
