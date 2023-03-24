import React, { useState, useEffect } from "react";
import useToken from "../actions/useToken";
import {
  Button,
  Form,
  Modal,
  Input,
  InputNumber,
  Select,
  Divider,
  Card,
  Space,
  Avatar,
  List,
  Skeleton,
  Typography,
  Switch,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  UserOutlined,
  SmileOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";

const NuevoPlan = ({ open, onCreate, onCancel }) => {
  //Hook para el Token
  const { token, setToken } = useToken();
  //categoria
  const [cat, setCat] = useState([]);
  //proyectos
  const [proyectos, setProyectos] = useState([]);
  //categoria
  const [nombre, setNombre] = useState([]);
  //proyectos
  const [descripcion, setDescripcion] = useState([]);
  //precio_mes
  const [precio_mes, setPrecio_mes] = useState([]);
  //precio_anio
  const [precio_anio, setPrecio_anio] = useState([0]);

  //Acciones cuando termine el formulario
  const onFinishNuevoPlan = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailedNuevoPlan = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

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

  //Hook de useEffect para setear automaticamente los datos de los menus cada 21 segundos (tablas y segmented)
  useEffect(() => {
    //setTimeout(() => {
    Consultas();
    //}, 4000);
  }, []);

  //Hace las consultas
  const Consultas = async (values) => {
    const authToken = "Bearer " + token;
    await getCategorias(authToken);
    await getProyectos(authToken);
  };

  //Selecciona el proyecto
  const [proyectoIDSeleccionado, setProyectoIDSeleccionado] = useState("");
  //Selecciona la categoria
  const [categoriaIDSeleccionado, setCategoriaIDSeleccionado] = useState("");

  //Captura la opción seleccionada en el select de proyectos
  const handleChangeSelectProject = (value) => {
    console.log("valor: ", value);
    setProyectoIDSeleccionado(value);
    console.log("valor: ", proyectoIDSeleccionado);
  };
  //Captura la opción seleccionada en el select de proyectos
  const handleChangeSelectCategoria = (value) => {
    console.log("valor: ", value);
    setCategoriaIDSeleccionado(value);
    console.log("valor: ", categoriaIDSeleccionado);
  };
  //Captura el precio del mes
  const onChangePrecioMes = (value) => {
    //console.log('changed', value);
    setPrecio_mes(value);
    console.log("El precio del mes ha cambiado a: ", precio_mes);
    setPrecio_anio(precio_mes * 12);
    console.log("año", precio_anio);
  };
  //Captura el nombre del plan
  const onChangeNombrePlan = (value) => {
    //console.log('changed', value);
    setNombre(value.target.value);
    console.log("El nombre del plan es: ", nombre);
  };
  //Captura la descripción del plan
  const onChangeDescripcionPlan = (e) => {
    setDescripcion(e.target.value);
    console.log("La descripción del plan es: ", descripcion);
  };
  //TEST
  const [form] = Form.useForm();
  const pAnio = Form.useWatch("precio_mes", form);

  //useState hook
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = (values) => {
    console.log("handleOK Modal button Received values of form:", values);
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [loading, setLoading] = useState(false);

  //TEST
  const onFinish = (values) => {
    console.log("DATOS DEL FORMULARIO");
    console.log("Nombre: ", nombre);
    console.log("descripcion: ", descripcion);
    console.log("precio_mes: ", precio_mes);
    console.log("precio_anio: ", precio_anio);
    console.log("proyecto_id: ", proyectoIDSeleccionado);
    console.log("categoria_id: ", categoriaIDSeleccionado);
    console.log("Received values of form:", values);
    Planes(values);
  };
  //Hook para holdear las descripciones de los planes
  const [planDetalle, setPlanDetalle] = useState({
    nombre: " ",
    descripcion: "",
  });
  //Función encargada de recibir los datos del input del nombre de la categoría y setearlos
  const handleChangeDetail = (e) => {
    console.log("Change:", e.target.value);
    const { name, value } = e.target;
    setPlanDetalle({ ...planDetalle, [name]: value });
    console.log("handelChangeDetail: ", planDetalle);
  };

  //Envío de los datos del formulario
  //PLAN
  async function savePlan(token, plan_detalle) {
    let body = [];
    body.push({
      nombre: nombre,
      descripcion: descripcion,
      precio_mes: precio_mes,
      precio_anio: precio_anio,
      proyecto_id: proyectoIDSeleccionado,
      plan_categoria_id: categoriaIDSeleccionado,
      plan_detalle,
    });
    console.log(Object.values(body));
    let result = body.find((item) => item.nombre !== null);

    console.log(result);
    return fetch("http://localhost:8080/api/planes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(result),
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
  const Planes = async (values) => {
    const authToken = "Bearer " + token;
    await savePlan(authToken, values.plan_detalle);
  };

  return (
    <div>
      <Form name="planDetalleForm" onFinish={onFinish} autoComplete="off">
        <Form.Item>
          <Modal
            title="Crear nuevo plan"
            okText="Crear"
            cancelText="Cancelar"
            open={open}
            // onOk={handleOk}
            onOk={() => {
              form
                .validateFields()
                .then((values) => {
                  form.resetFields();
                  onCreate(values);
                  open();
                })
                .catch((info) => {
                  console.log("Validate Failed:", info);
                });
            }}
            onCancel={onCancel}
            width={666}
            // okButtonProps={{
            //   disabled: false,
            //   htmlType: "submit",
            // }}

            footer={[
              <Button key="back" onClick={handleCancel}>
                Return
              </Button>,
              <Button
                form="planDetalleForm"
                key="submit"
                type="primary"
                htmlType="submit"
              >
                Crear
              </Button>,
            ]}
            style={{
              top: 20,
            }}
          >
            {/* <Form.Provider
          onFormChange={(name, { changedFields, forms }) => {
            if (name === "planDetalleForm") {
              const { plan } = forms;
              const plan_detalle = plan.getFieldValue("plan_detalle") || [];
              plan.setFieldsValue({
                plan_detalle: [...plan_detalle, changedFields],
              });
              //console.log("plandetalle", plan);
            }
          }}
        > */}
            <Form
              form={form}
              name="plan"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinishNuevoPlan}
              onFinishFailed={onFinishFailedNuevoPlan}
              autoComplete="off"
            >
              <Form.Item
                label="Nombre"
                name="nombre"
                rules={[
                  {
                    required: true,
                    message: "¡Por favor, ingrese el nombre!",
                  },
                ]}
              >
                <Input
                  placeholder="Nombre del nuevo plan"
                  name="nombre"
                  onChange={onChangeNombrePlan}
                />
              </Form.Item>

              <Form.Item label="Descripción" name="descripcion">
                <Input.TextArea
                  name="descripcion"
                  onChange={onChangeDescripcionPlan}
                />
              </Form.Item>
              <Form.Item label="Precio mensual" name="precio_mes">
                <InputNumber
                  prefix="$"
                  min={1}
                  max={250000}
                  defaultValue={0}
                  onChange={onChangePrecioMes}
                />
              </Form.Item>
              <Form.Item label="Precio anual" name="precio_anio">
                {/* <InputNumber
                  prefix="$"
                  min={1}
                  max={25000}
                  disabled
                  defaultValue={pAnio*12}
                  value={pAnio}
                  onChange={onChangePrecioAnio}
                /> */}
                <Typography name="precio_anio">$ {pAnio * 12}</Typography>
              </Form.Item>

              <Form.Item label="Proyecto" name="proyecto_id">
                <Select
                  bordered={true}
                  onChange={handleChangeSelectProject}
                  placeholder="Selecciona un proyecto para el plan."
                  options={proyectos}
                  style={{
                    width: "100%",
                  }}
                ></Select>
              </Form.Item>
              <Form.Item label="Categoría" name="plan_categoria_id">
                <Select
                  bordered={true}
                  onChange={handleChangeSelectCategoria}
                  placeholder="Selecciona una categoría para el plan."
                  options={cat}
                  style={{
                    width: "100%",
                  }}
                ></Select>
              </Form.Item>

              {/* <Form.Item
                label="User List"
                shouldUpdate={(prevValues, curValues) =>
                  prevValues.plan !== curValues.plan
                }
              >
                {({ getFieldValue }) => {
                  const users = getFieldValue("plan") || [];
                  return users.length ? (
                    <ul>
                      {users.map((user, index) => (
                        <li key={index} className="user">
                          <Avatar icon={<UserOutlined />} />
                          {user.nombre} - {user.descripcion}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Typography.Text className="ant-form-text" type="secondary">
                      ( <SmileOutlined /> No user yet. )
                    </Typography.Text>
                  );
                }}
              </Form.Item> */}

              <Divider></Divider>

              {/* <div>
                <PlanDetalleCard />
              </div> */}
            </Form>
            {/* </Form.Provider> */}

            {/* TODA ESTA PARTE ES TEST PARA COLOCAR LA INNERCARD EN EL MODAL */}
            <>
              <Card
                type="inner"
                title="Agregar detalles"
                headStyle={{ alignContent: "center" }}
                //onChange={handleAggDetalle}
              >
                {/* <Form>
            <Form.Item label="Descripción del detalle: " name="nombre">
              <Input.TextArea
                showCount
                maxLength={100}
                placeholder="Máximo 100 caracteres."
                name="nombre"
                onChange={handleChangeDetail}
              ></Input.TextArea>
            </Form.Item>
          </Form> */}

                {/* aaaaa */}

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
                {/* <Form.Item>
                    <Button
                      type="primary"
                      onClick={() => console.log(planDetalle)}
                    >
                      Confirmar los detalles
                    </Button>
                    <Switch
                      checkedChildren={<CheckOutlined />}
                      unCheckedChildren={<CloseOutlined />}
                      defaultChecked
                    />
                  </Form.Item> */}
              </Card>
            </>

            {/* <p>
              <p>PARA EL PLAN</p>
              nombre, descripcion, precio_mes, precio_anio, proyecto_id,
              plan_categoria_id
            </p>
            <p>
              PARA EL PLAN DETALLE
              <p>nombre, descripcion:</p>
            </p> */}
          </Modal>
        </Form.Item>
      </Form>
    </div>
  );
};

const PlanDetalleCard = () => {
  //Hook para contar otro detalle
  const [detalle, setDetalle] = useState(1);

  //INNER CARD
  const InnerCard = () => {
    //Hook para holdear las descripciones de los planes
    const [planDetalle, setPlanDetalle] = useState({
      nombre: " ",
      descripcion: "",
    });
    //Función encargada de recibir los datos del input del nombre de la categoría y setearlos
    const handleChangeDetail = (e) => {
      console.log("Change:", e.target.value);
      const { name, value } = e.target;
      setPlanDetalle({ ...planDetalle, [name]: value });
      console.log("handelChangeDetail: ", planDetalle);
    };

    //¿Sumar 1 al contar de detalle?
    const handleAggDetalle = () => {
      setDetalle(detalle + 1);
      console.log("handleAggDetalle: ", detalle);
    };

    //¿Para contar los detalles?
    const NumeroDetalleDisplay = () => {
      handleAggDetalle();
      return <Typography>Detalle {detalle}</Typography>;
    };

    const onFinish = (values) => {
      console.log("Received values of form:", values);
    };
    return (
      <>
        <Card
          type="inner"
          title="Agregar detalles"
          headStyle={{ alignContent: "center" }}
          //onChange={handleAggDetalle}
        >
          {/* <Form>
            <Form.Item label="Descripción del detalle: " name="nombre">
              <Input.TextArea
                showCount
                maxLength={100}
                placeholder="Máximo 100 caracteres."
                name="nombre"
                onChange={handleChangeDetail}
              ></Input.TextArea>
            </Form.Item>
          </Form> */}
          <Form name="planDetalleForm" onFinish={onFinish} autoComplete="off">
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

                  {/* <Form.Item>
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
                  </Form.Item> */}
                </>
              )}
            </Form.List>
            {/* <Form.Item>
              <Button type="primary" onClick={() => console.log(planDetalle)}>
                Confirmar los detalles
              </Button>
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                defaultChecked
              />
            </Form.Item> */}
          </Form>
        </Card>
      </>
    );
  };

  // return (
  //   <>
  //     <Space
  //       direction="vertical"
  //       size="middle"
  //       style={{
  //         display: "flex",
  //       }}
  //     >
  //       <InnerCard />
  //     </Space>
  //   </>
  // );
};

export const BotonNuevoPlan = () => {
  //GUARDAR CATEGORÍAS
  // async function saveCategorias(token) {
  //   console.log("Id de la categoria: ", categoriaDatos.id);
  //   console.log("PETICION PUT: ", editCat.nombre);
  //   return fetch("http://localhost:8080/api/categorias/" + categoriaDatos.id, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: token,
  //     },
  //     body: JSON.stringify({ nombre: editCat.nombre }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

  const [open, setOpen] = useState(false);
  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    setOpen(false);
  };

  return (
    <>
      <Button
        type="primary"
        // onClick={showModal}
        onClick={() => {
          setOpen(true);
        }}
        size={"middle"}
        icon={<PlusOutlined />}
      >
        Nuevo Plan
      </Button>
      <NuevoPlan
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </>
  );
};
