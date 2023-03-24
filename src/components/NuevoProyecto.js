import React, { useState } from "react";
import { Button, Divider, Form, Input, Modal, Switch, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";

import useToken from "../actions/useToken";

const NuevoProyecto = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  return (
    <div>
      <Modal
        open={open}
        title="Crear nuevo proyecto"
        okText="Crear"
        cancelText="Cancelar"
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
            })
            .catch((info) => {
              console.log("Validación fallida", info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}
        >
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[
              {
                required: true,
                message: "Por favor ingrese el nombre del proyecto.",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug"
            rules={[
              {
                required: true,
                message: "Por favor, ingrese el slug del proyecto.",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="descripcion" label="Descripción">
            <Input type="textarea" />
          </Form.Item>
        </Form>

        <Form.Item label="Visible" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item label="Imagen">
          <Form.Item
            name="imagen"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            noStyle
          >
            <Upload.Dragger name="files" action="/upload.do">
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Presione o arrastre a esta zona para subir el archivo.
              </p>
              <p className="ant-upload-hint">Carga uno o varios archivos.</p>
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>
      </Modal>
    </div>
  );
};

//Función para validar el archivo
const normFile = (e) => {
  console.log("Evento de subida:", e);
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export const BotonNuevoProyecto = () => {
  //Hook para el Token
  const { token, setToken } = useToken();
  const [open, setOpen] = useState(false);
  const onCreate = (values) => {
    console.log("Valores recibidos del formulario: ", values);
    //Guardar el nuevo proyecto
    //PROYECTO
    async function saveProyecto(token) {
      return fetch("http://localhost:8080/api/proyectos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(values),
        //body: JSON.stringify(credentials),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          //console.log("Evaluar datos PROYECTO: ", data)
          //setProyectos(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    //Hace las solicitudes
    const Planes = async () => {
      const authToken = "Bearer " + token;
      await saveProyecto(authToken);
    };

    Planes()
    setOpen(false);
  };

  return (
    <div>
      {/* <Button
        type="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        Nuevo Proyecto
      </Button> */}
      <Divider>
        <PlusOutlined
          type="primary"
          onClick={() => {
            setOpen(true);
          }}
        />
      </Divider>
      <NuevoProyecto
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </div>
  );
};
