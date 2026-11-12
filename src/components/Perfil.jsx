import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Container, Form, Button } from "react-bootstrap";
import { editarUsuarioApi, borrarUsuarioApi } from "../services/usersServices.js";
import { cargarUsuarioSlice, limpiarUsuarioSlice } from "../redux/features/usuarioSlice.js";
import { limpiarLibrosSlice } from "../redux/features/librosSlice.js";
import { obtenerMensajeError } from "../utils/utils.js";
import SubirImagen from "./SubirImagen.jsx";
import { deleteImage } from "../services/imageService.js";
import { cancelarVencimiento } from "../utils/sesion.js";

const esquemaPerfil = Yup.object({
  name: Yup.string()
    .trim()
    .required("El nombre es obligatorio")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras y espacios")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(30, "El nombre no puede superar los 30 caracteres"),
  username: Yup.string()
    .required("El usuario es obligatorio")
    .matches(/^[a-zA-Z0-9]+$/, "El usuario solo puede contener letras y números")
    .min(3, "El usuario debe tener al menos 3 caracteres"),
  email: Yup.string()
    .trim()
    .required("El email es obligatorio")
    .email("El email no tiene un formato válido"),
});

const Perfil = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const usuario = useSelector((state) => state.usuarioSlice.usuario);

  const [confirmarBorrado, setConfirmarBorrado] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [imagenUrl, setImagenUrl] = useState("");
  const [imagenPublicId, setImagenPublicId] = useState("");

  const formik = useFormik({
    initialValues: {
      name: usuario?.name ?? "",
      username: usuario?.username ?? "",
      email: usuario?.email ?? "",
    },
    enableReinitialize: true,
    validationSchema: esquemaPerfil,

    onSubmit: async (valores) => {
      try {
        const datosUsuario = {
          name: valores.name,
          username: valores.username,
          email: valores.email,
          imageUrl: imagenUrl || usuario.imageUrl || "",
          imagePublicId: imagenPublicId || usuario.imagePublicId || "",
        };
        const usuarioEditado = await editarUsuarioApi(usuario.id, datosUsuario);
        dispatch(cargarUsuarioSlice(usuarioEditado));
        setResetKey(resetKey + 1);
        toast.success("Datos guardados");
      } catch (error) {
        toast.error(obtenerMensajeError(error, "No se pudieron guardar los datos"));
      }
    },
  });

  const quitarFotoHandler = async () => {
    try {
      await deleteImage(usuario.imagePublicId);

      const datosUsuario = {
        name: usuario.name,
        username: usuario.username,
        email: usuario.email,
        imageUrl: "",
        imagePublicId: "",
      };
      const usuarioEditado = await editarUsuarioApi(usuario.id, datosUsuario);
      dispatch(cargarUsuarioSlice(usuarioEditado));
      toast.success("Foto eliminada");
    } catch (error) {
      toast.error(obtenerMensajeError(error, "No se pudo eliminar la foto"));
    }
  };

  const borrarCuentaHandler = async () => {
    try {
      await borrarUsuarioApi(usuario.id);
      localStorage.clear();
      cancelarVencimiento();
      dispatch(limpiarUsuarioSlice());
      dispatch(limpiarLibrosSlice());
      toast.success("Cuenta eliminada");
      navigate("/login");
    } catch (error) {
      toast.error(obtenerMensajeError(error, "No se pudo eliminar la cuenta"));
    }
  };

  return (
    <Container className="contenido">
      <div className="panel panel-angosto">
        <h3>Mi perfil</h3>

        {usuario?.imageUrl && (
          <>
            <img src={usuario.imageUrl} alt="Foto de perfil" className="foto-perfil" />
            <div className="text-center">
              <Button variant="outline-danger" size="sm" onClick={quitarFotoHandler}>Quitar foto</Button>
            </div>
          </>
        )}

        <SubirImagen
          handleImgURL={setImagenUrl}
          handleImgPublicId={setImagenPublicId}
          resetKey={resetKey}
        />

        <Form onSubmit={formik.handleSubmit} noValidate>
          <Form.Group className="mb-3" controlId="perfilName">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.name && Boolean(formik.errors.name)}
            />
            <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="perfilUsername">
            <Form.Label>Usuario</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.username && Boolean(formik.errors.username)}
            />
            <Form.Control.Feedback type="invalid">{formik.errors.username}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="perfilEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.email && Boolean(formik.errors.email)}
            />
            <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" disabled={!formik.isValid || formik.isSubmitting}>
            Guardar cambios
          </Button>
        </Form>

        <hr />

        {confirmarBorrado ? (
          <div>
            <p>¿Seguro? Se borra tu cuenta.</p>
            <Button variant="danger" onClick={borrarCuentaHandler}>Sí, eliminar</Button>{" "}
            <Button variant="secondary" onClick={() => setConfirmarBorrado(false)}>Cancelar</Button>
          </div>
        ) : (
          <Button variant="danger" onClick={() => setConfirmarBorrado(true)}>Eliminar mi cuenta</Button>
        )}
      </div>
    </Container>
  );
};

export default Perfil;
