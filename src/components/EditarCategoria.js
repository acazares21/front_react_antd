import React, { useState, useContext, useEffect, useRef } from "react";
import { Button, Modal, Input } from "antd";
import {
  Form,
  Radio,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
  Popover,
  Select,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { CatContext } from "./Planes";
import useToken from "../actions/useToken";
//Modal Draggable
import Draggable from "react-draggable";
import { useAsyncError } from "react-router-dom";

/*      *** FORMA DE UTILIZAR LAS TABLAS***
 *Se especifican los datos de la tabla en un dataSource como un array de datos.
 *Luego, se especifican las columnas a trabajar.
 *Finalmente, en el componente a exportar se usa la etiqueta Table indicando los atributos columns y dataSource creados.
 */

//Datos definidos en el hook del component

const DraggableComponent = ({ categoriaDatos }) => {
  //Hook para el Token
  const { token, setToken } = useToken();
  //Acciones para el menú de editar categoría

  //Hooks para setear la categoria a editar
  const [editCat, setEditCat] = useState({
    nombre: " ",
  });

  //Función encargada de recibir los datos del input del nombre de la categoría y setearlos
  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setEditCat({ ...editCat, [name]: value });
    console.log("Capturó los nuevo datos ingresados: ", editCat);
  };

  //MODAL draggable para editar categoría
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = (e) => {
    console.log("PROBAR", e);
    Peticion();
    setOpen(false);
  };

  //ELIMINAR CATEGORÍAS
  async function deleteCategorias(token) {
    return fetch("http://localhost:8080/api/categorias/" + categoriaDatos.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      //body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //ACTUALIZAR CATEGORÍAS
  async function updateCategorias(token) {
    console.log("Id de la categoria: ", categoriaDatos.id);
    console.log("PETICION PUT: ", editCat.nombre);
    return fetch("http://localhost:8080/api/categorias/" + categoriaDatos.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ nombre: editCat.nombre }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //Hace las consultas
  const Peticion = async (values) => {
    const authToken = "Bearer " + token;
    //await deleteCategorias(authToken)
    console.log("PETICION: ", editCat.nombre /*values.nombre*/);
    await updateCategorias(authToken);
  };

  //Hace las consultas
  const PeticionEliminar = async (values) => {
    const authToken = "Bearer " + token;
    await deleteCategorias(authToken);
  };

  const handleCancel = (e) => {
    console.log("handleCancel", e);
    setOpen(false);
  };
  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };
  return (
    <>
      <Tooltip title="Editar categoría">
        <Button icon={<EditOutlined />} onClick={showModal} />
        <Modal
          okText="OK"
          cancelText="Cancelar"
          title={
            <div
              style={{
                width: "100%",
                cursor: "move",
              }}
              onMouseOver={() => {
                if (disabled) {
                  setDisabled(false);
                }
              }}
              onMouseOut={() => {
                setDisabled(true);
              }}
              // fix eslintjsx-a11y/mouse-events-have-key-events
              // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
              onFocus={() => {}}
              onBlur={() => {}}
              // end
            >
              Categoría a editar: "{categoriaDatos.nombre}"
            </div>
          }
          open={open}
          onOk={handleOk}
          onCancel={handleCancel}
          modalRender={(modal) => (
            <Draggable
              disabled={disabled}
              bounds={bounds}
              onStart={(event, uiData) => onStart(event, uiData)}
            >
              <div ref={draggleRef}>{modal}</div>
            </Draggable>
          )}
        >
          <Typography.Title level={4}>Nuevo nombre:</Typography.Title>
          <p>
            <Input name="nombre" onChange={handleChangeEdit} />
          </p>
        </Modal>
      </Tooltip>
    </>
  );
};

//hook para retener el valor seleccionado en la tabla de categoria a eliminar

//Columnas y renderizado de la tabla incluyendo los botones de las acciones eliminar y editar
const columns = [
  {
    title: "Categoría",
    dataIndex: "nombre",
    key: "nombre",
  },
  {
    title: "Estado actual",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Acciones",
    key: "action",
    align: "center",
    render: (_, record) => (
      <Space size="middle">
        <a>
          {/*record.status*/}
          {/* <Tooltip title="Eliminar categoría">
            <Button
              icon={<DeleteOutlined />}
              onClick={ShowDeleteConfirm(record)}
            />
          </Tooltip> */}
          <DeleteCategoria categoriaDatos={record} />
        </a>
        <a>
          <DraggableComponent categoriaDatos={record} />
        </a>
      </Space>
    ),
  },
];

//TEST COMPONENT
const DeleteCategoria = (categoriaDatos) => {
  //Hook para el Token
  const { token, setToken } = useToken();

  const showDeleteConfirm = () => {
    confirm({
      title: "¿Estás seguro que deseas eliminar esta categoría?",
      icon: <ExclamationCircleOutlined />,
      content: 'La categoría cambiará su estado a "I".',
      okText: "Eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk() {
        console.log("OK", categoriaDatos);
        PeticionEliminar(categoriaDatos);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  //ELIMINAR CATEGORÍAS
  async function deleteCategorias(token) {
    console.log("deleteCategorias::: ", categoriaDatos.categoriaDatos.id);
    return fetch(
      "http://localhost:8080/api/categorias/" +
        categoriaDatos.categoriaDatos.id,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        //body: JSON.stringify(credentials),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //Hace las consultas
  const PeticionEliminar = async (values) => {
    const authToken = "Bearer " + token;
    console.log("PETICION ELIMINAR: ", categoriaDatos.categoriaDatos.id);
    await deleteCategorias(authToken);
  };

  return (
    <div>
      <Tooltip title="Eliminar categoría">
        <Button icon={<DeleteOutlined />} onClick={showDeleteConfirm} />
      </Tooltip>
    </div>
  );
};

//Modal para confirmar la eliminación
const { confirm } = Modal;

//Mostrar confirmación de eliminación
const ShowDeleteConfirm = (categoriaDatos) => {
  console.log(categoriaDatos);
  //Hook para el Token
  const { token, setToken } = useToken();

  //ELIMINAR CATEGORÍAS
  async function deleteCategorias(token) {
    return fetch("http://localhost:8080/api/categorias/" + categoriaDatos.id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      //body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //Hace las consultas
  const PeticionEliminar = async (values) => {
    const authToken = "Bearer " + token;
    console.log("PETICION ELIMINAR: ", categoriaDatos);
    //await deleteCategorias(authToken);
  };

  confirm({
    title: "Do you Want to delete these items?",
    icon: <ExclamationCircleOutlined />,
    content: "Some descriptions",
    onOk() {
      console.log("OK");
      PeticionEliminar();
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};

//Contenido del modal Editar Categoría
const EditarCategoria = () => {
  //Hook para el Token
  const { token, setToken } = useToken();
  //categoria
  const [cat, setCat] = useState([]);
  //proyectos
  const [proyectos, setProyectos] = useState([]);
  //nueva categoria
  const [newCat, setNewCat] = useState({
    nombre: " ",
  });
  //Selecciona el proyecto
  const [proyectoIDSeleccionado, setProyectoIDSeleccionado] = useState("");

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
        let catSelected = [];
        for (let i in data.categorias) {
          catSelected.push({
            nombre: data.categorias[i].nombre,
            id: data.categorias[i].id,
            status: data.categorias[i].status,
          });
        }
        setCat(catSelected);
      })
      .catch((error) => {
        console.error(error);
      });
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

  //AGREGAR NUEVAS CATEGORÍAS
  async function setCategorias(token) {
    return fetch("http://localhost:8080/api/categorias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        nombre: newCat.nombre,
        proyecto_id: proyectoIDSeleccionado,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .then(successModalNuevaCategoria)
      .catch((error) => {
        console.error(error);
      });
  }

  //Hace las consultas
  const Consultas = async (values) => {
    const authToken = "Bearer " + token;
    await getCategorias(authToken);
    await getProyectos(authToken);
  };

  //Hace las consultas
  const AggCat = async () => {
    const authToken = "Bearer " + token;

    console.log(proyectoIDSeleccionado);
    console.log("BOTON NUEVA CATEGORIA, CATEGORIA ", newCat);
    await setCategorias(authToken);
  };

  //Hook de useEffect para setear automaticamente los datos de los menus cada 21 segundos (tablas y segmented)
  useEffect(() => {
    //setTimeout(() => {
    Consultas();
    //}, 4000);
  }, []);

  //Captura los valores ingresados en el input nueva categoría y los setea
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCat({ ...newCat, [name]: value });
    console.log("Capturó los nuevo datos ingresados: ", newCat);
  };

  //Captura la opción seleccionada en el select de proyectos
  const handleChangeSelectProject = (value) => {
    console.log("valor: ", value);
    setProyectoIDSeleccionado(value);
    console.log("valor: ", proyectoIDSeleccionado);
  };

  const successModalNuevaCategoria = () => {
    Modal.success({
      content: "Categoría agregada de forma satisfactoria.",
    });
  };

  //Contenido a renderizar
  return (
    <>
      <Input.Group>
        <Input
          name="nombre"
          style={{ width: "calc(100% - 200px)" }}
          placeholder="Nombre de la categoría"
          onChange={handleChange}
        />
        <Tooltip title="Añadir nueva categoría">
          <Button type="submit" icon={<PlusOutlined />} onClick={AggCat} />
        </Tooltip>
        <Typography.Title level={5}></Typography.Title>
        <Select
          bordered={true}
          onChange={handleChangeSelectProject}
          placeholder="Selecciona un proyecto para la categoría"
          options={proyectos}
          style={{
            width: 304,
          }}
        ></Select>
      </Input.Group>
      <p />
      <Table columns={columns} dataSource={cat} bordered />
    </>
  );
};

//Boton modal de Editar
const BotonEditarCategoria = () => {
  //useState hook
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOkEditCat = () => {
    setIsModalOpen(false);
  };
  const handleCancelEditCat = () => {
    setIsModalOpen(false);
  };

  //Contenido de editar categorías
  const content = (
    <div>
      <p>Opciones:</p>
      <p>- Agregar nueva categoría.</p>
      <p>- Eliminar categoría existente.</p>
      <p>- Renombrar categoría existente.</p>
    </div>
  );

  //Contenido a renderizar
  return (
    <>
      {" "}
      <Popover content={content} title="Edición de las categorías">
        <Button
          type="primary"
          onClick={showModal}
          size={"small"}
          icon={<EditOutlined />}
        >
          Editar categorías
        </Button>{" "}
      </Popover>
      <Modal
        title="Editar categorías"
        open={isModalOpen}
        onOk={handleOkEditCat}
        onCancel={handleCancelEditCat}
      >
        <EditarCategoria />
      </Modal>
    </>
  );
};

export default BotonEditarCategoria;
