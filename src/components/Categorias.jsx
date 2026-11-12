import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Container, Form, Button } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { crearCategoriaApi, editarCategoriaApi, borrarCategoriaApi } from "../services/categoriasServices.js";
import { agregarCategoriaSlice, editarCategoriaSlice, borrarCategoriaSlice } from "../redux/features/categoriasSlice.js";
import { obtenerMensajeError } from "../utils/utils.js";

const esquemaCategoria = Yup.object({
  name: Yup.string()
    .trim()
    .required("El nombre es obligatorio")
    .min(3, "Debe tener al menos 3 caracteres")
    .max(30, "No puede superar los 30 caracteres"),
});

const Categoria = ({ categoria }) => {
  const dispatch = useDispatch();
  const [editando, setEditando] = useState(false);
  const [nombreEditando, setNombreEditando] = useState(categoria.name);

  const guardarHandler = async () => {
    const nombreLimpio = nombreEditando.trim();
    if (nombreLimpio.length < 3 || nombreLimpio.length > 30) {
      toast.error("El nombre debe tener entre 3 y 30 caracteres");
      return;
    }
    try {
      const categoriaEditada = await editarCategoriaApi(categoria.id, { name: nombreLimpio });
      dispatch(editarCategoriaSlice(categoriaEditada));
      setEditando(false);
      toast.success("Categoría modificada");
    } catch (error) {
      toast.error(obtenerMensajeError(error, "No se pudo modificar la categoría"));
    }
  };

  const borrarHandler = async () => {
    try {
      await borrarCategoriaApi(categoria.id);
      dispatch(borrarCategoriaSlice(categoria.id));
      toast.success("Categoría eliminada");
    } catch (error) {
      toast.error(obtenerMensajeError(error, "No se pudo eliminar la categoría"));
    }
  };

  return (
    <div className="tarjeta tarjeta-principal">
      {editando ? (
        <>
          <input type="text" value={nombreEditando} onChange={(e) => setNombreEditando(e.target.value)} />
          <button className="principal" onClick={guardarHandler}>Guardar</button>
          <button onClick={() => setEditando(false)}>Cancelar</button>
        </>
      ) : (
        <>
          <span className="tarjeta-info">{categoria.name}</span>
          <button onClick={() => setEditando(true)}>Editar</button>
          <button className="peligro" onClick={borrarHandler}>Eliminar</button>
        </>
      )}
    </div>
  );
};

const Categorias = () => {
  const dispatch = useDispatch();
  const usuario = useSelector((state) => state.usuarioSlice.usuario);
  const listaCategorias = useSelector((state) => state.categoriasSlice);

  const formik = useFormik({
    initialValues: { name: "" },
    validationSchema: esquemaCategoria,

    onSubmit: async (valores, { resetForm }) => {
      try {
        const categoriaCreada = await crearCategoriaApi({ name: valores.name.trim() });
        dispatch(agregarCategoriaSlice(categoriaCreada));
        resetForm();
        toast.success("Categoría creada");
      } catch (error) {
        toast.error(obtenerMensajeError(error, "No se pudo crear la categoría"));
      }
    },
  });

  if (!usuario) {
    return null;
  }

  if (usuario.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Container className="contenido">
      <div className="panel panel-angosto">
        <h3>Categorías</h3>

        <Form onSubmit={formik.handleSubmit} noValidate className="agregar-fila mb-3">
          <Form.Group className="agregar-titulo" controlId="nombreCategoria">
            <Form.Control
              type="text"
              name="name"
              placeholder="Nueva categoría"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.name && Boolean(formik.errors.name)}
            />
            <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
          </Form.Group>
          <Button type="submit" disabled={formik.isSubmitting}>Agregar</Button>
        </Form>

        {listaCategorias.map((categoria) => (
          <Categoria key={categoria.id} categoria={categoria} />
        ))}
      </div>
    </Container>
  );
};

export default Categorias;
