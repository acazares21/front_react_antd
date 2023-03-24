import React, { createContext, useEffect, useState } from "react";
import {
  Divider,
  Segmented,
  Table,
  Col,
  Row,
  Form,
  Space,
  Typography,
  Switch,
  notification,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  UserOutlined,
  SmileOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { Input } from "antd";
import { BotonNuevoPlan } from "./NuevoPlan";
import BotonEditarCategoria from "./EditarCategoria";
import useToken from "../actions/useToken";

//Hook Context para compartir los datos del estado de categorias
export const CatContext = createContext();

//Varios
const { Search } = Input;
const onSearch = (value) => console.log(value);

// ********* EJEMPLO PARA DATOS ESTÁTICOS *********
// const dataSource = [
//   {
//     key: "1",
//     nombre: "Mike",
//     precio_mes: 32,
//     precio_anio: 384,
//     status: "A",
//     descripcion: "???????",
//   },
//   {
//     key: "2",
//     name: "John",
//     age: 42,
//     address: "10 Downing Street",
//   },
// ];

const columns = [
  {
    title: "Nombre del plan",
    dataIndex: "nombre",
    key: "nombre",
  },
  {
    title: "Precio mensual",
    dataIndex: "precio_mes",
    key: "precio_mes",
  },
  {
    title: "Precio anual",
    dataIndex: "precio_anio",
    key: "price_anio",
  },
  {
    title: "Estado",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Descripción",
    dataIndex: "descripcion",
    key: "descripcion",
  },
];

// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === "Disabled User",
    // Column configuration not to be checked
    name: record.name,
  }),
};

//PLANES UI
export const Planes = () => {
  //Hook para el Token
  const { token, setToken } = useToken();
  //
  const [selectionType, setSelectionType] = useState("checkbox");
  //Hook para controlar el menu-segmento
  const [cat, setCat] = useState([]);
  //Hook para controlar el menu-segmento
  const [value, setValue] = useState("");
  //Hook para los datos de las tablas
  const [data, setData] = useState([]);
  //Hook para enviar la información de
  const [catID, setCatID] = useState([]);
  //
  const [newDataTable, setNewDataTable] = useState([]);

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
        setData(data);
        console.log("ASI LLEGAN LOS DATOS DE LOS PLANES", data.planes);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //CATEGORÍAS
  async function getCategorias(token) {
    return fetch("http://localhost:8080/api/categorias", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      //body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("getCategorias: ", data);
        let catSelected = [];
        //let catIdSelected = [];
        for (let i in data.categorias) {
          catSelected.push({
            value: data.categorias[i].id,
            label: data.categorias[i].nombre,
            nombre: data.categorias[i].nombre,
            id: data.categorias[i].id,
            status: data.categorias[i].status,
          });
        }
        console.log("catSelected", catSelected);
        setCat(catSelected);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //Hace las consultas
  const Consultas = async (values) => {
    const authToken = "Bearer " + token;
    await getCategorias(authToken);
    await getPlanes(authToken);
    //console.log("TOKEN: ", authToken);
  };

  //Hook de useEffect para setear automaticamente los datos de los menus cada 21 segundos (tablas y segmented)
  useEffect(() => {
    setTimeout(() => {
      Consultas();
      //handleDataSourceTable()
    }, 1000);
  }, []);

  //Selección de categoría para las tablas dependiendo de la selección en el segmento
  const CatSelection = (data) => {
    console.log(data.planes);
    // if (data.planes){

    // }
  };

  const onFinish = (values) => {
    console.log("Received values of form:", values);
  };

  //Función encargada de recibir los datos del input del nombre de la categoría y setearlos
  const handleChangeDetail = (e) => {
    console.log("Change:", e.target.value);
    const { name, value } = e.target;
    setPlanDetalle({ ...planDetalle, [name]: value });
    console.log("handelChangeDetail: ", planDetalle);
  };

  //Hook para holdear las descripciones de los planes
  const [planDetalle, setPlanDetalle] = useState({
    nombre: " ",
    descripcion: "",
  });

  //Setea nuevamente los datos de acuerdo a la opción seleccionada en el segmento
  const handleChangeCatSeg = (e) => {
    console.log("handleChangeCatSeg: ", e);
    setValue(e);
    console.log("Segmento: ", value);
    ConsultasID(e);
    handleDataSourceTable(e);
  };

  //Hook para holdear las descripciones de los planes
  const [catPorID, setCatPorID] = useState();
  //Hace las consultas de categoria por el ID
  const ConsultasID = async (id) => {
    const authToken = "Bearer " + token;
    await getCategoriasID(authToken, id);
  };

  //CATEGORÍAS POR ID
  async function getCategoriasID(token, id) {
    return fetch("http://localhost:8080/api/categorias/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      //body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("CATEGORIA OBTENIDA POR ID: ", data.user);

        if (data.user.status === "I") {
          openNotificationCatStatus("warning", 'top');
        }
        setCatPorID(data.user);
        console.log("CATPORID SETEADA: ", catPorID);

        // let catSelected = [];
        // for (let i in data.categorias) {
        //   catSelected.push({
        //     nombre: data.categorias[i].nombre,
        //     id: data.categorias[i].id,
        //     status: data.categorias[i].status,
        //   });
        // }
        // setCat(catSelected);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //NOTIFICACIÓN
  const openNotificationCatStatus = (type,placement) => {
    notification[type]({
      message: "Información del estado de la categoría.",
      description: "La categoría actualmente se encuentra en estado inactivo.",
      placement,
    });
  };

  const handleDataSourceTable = (e) => {
    console.log("VALOR ID SELECCIONADO: ", e);
    let a = [];
    for (const i in data.planes) {
      console.log("DATA:PLANES", data.planes[i].id);
      if (e === data.planes[i].plan_categoria_id) {
        //console.log("DATA:PLANES", data.planes[i].id);
        a.push({
          categoria: data.planes[i].categoria,
          descripcion: data.planes[i].descripcion,
          detalle: data.planes[i].detalle,
          nombre: data.planes[i].nombre,
          precio_mes: data.planes[i].precio_mes,
          precio_anio: data.planes[i].precio_anio,
          status: data.planes[i].status,
        });
      }
    }
    setNewDataTable(a);

    console.log("NUEVO VALORES DE LA TABLA: ", newDataTable);
  };

  return (
    <div style={{ height: "calc(100vh - 55px)" }}>
      <Row wrap>
        <Col span={7}>
          <BotonEditarCategoria />
        </Col>
        <Col span={8}></Col>
        <Col span={8}>
          <Segmented
            block
            options={cat}
            value={value}
            onChange={(value) => handleChangeCatSeg(value)}
          />
        </Col>
      </Row>
      <Divider />

      <Row wrap>
        <Col span={7}>
          <Search
            placeholder="Buscar los planes"
            allowClear
            onSearch={onSearch}
            style={{
              width: 200,
            }}
          />
        </Col>
        <Col flex="auto"></Col>
        <Col span={8}>
          <BotonNuevoPlan />
        </Col>
      </Row>

      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        // dataSource={data.planes}
        dataSource={newDataTable}
        bordered
      />

      {/* <Form name="planDetalleForm" onFinish={onFinish} autoComplete="off">
        <Form.List name="plan_detalle">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{
                    display: "flex",
                    marginBottom: 8,
                  }}
                  align="baseline"
                >
                  <Typography>Detalle </Typography>
                  <Form.Item
                    {...restField}
                    name={[name, "nombre"]}
                    rules={[
                      {
                        required: true,
                        message: "Ingrese el nombre del detalle.",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nombre"
                      size="large"
                      name="nombre"
                      onChange={handleChangeDetail}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "descripcion"]}
                    rules={[
                      {
                        required: true,
                        message: "Ingrese la descripción.",
                      },
                    ]}
                  >
                    <Input.TextArea
                      showCount
                      maxLength={100}
                      placeholder="Descripción."
                      name="descripcion"
                      onChange={handleChangeDetail}
                      style={{
                        height: 2,
                        width: "flex",
                      }}
                    ></Input.TextArea>
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  block
                  icon={<PlusOutlined />}
                >
                  Añadir nuevo detalle
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Confirmar los detalles
          </Button>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            defaultChecked
            // htmlType='submit'
            onClick={()=>{}}
          />
        </Form.Item>
      </Form> */}
    </div>
  );
};
