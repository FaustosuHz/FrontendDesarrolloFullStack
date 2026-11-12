import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { registroApi } from "../services/authServices.js";
import { obtenerMensajeError } from "../utils/utils.js";
import { cargarUsuarioSlice } from "../redux/features/usuarioSlice.js";

const esquemaRegistro = Yup.object({
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
  password: Yup.string()
    .required("La contraseña es obligatoria")
    .min(3, "La contraseña debe tener al menos 3 caracteres")
    .max(30, "La contraseña no puede superar los 30 caracteres"),
  repetirPassword: Yup.string()
    .required("Repetí la contraseña")
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden"),
});

const Registro = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [mensajeError, setMensajeError] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      repetirPassword: "",
    },

    validationSchema: esquemaRegistro,
    validateOnMount: true,

    onSubmit: async (valores) => {
      setMensajeError("");
      try {
        const datosRegistro = {
          name: valores.name,
          username: valores.username,
          email: valores.email,
          password: valores.password,
        };
        const resultado = await registroApi(datosRegistro);

        localStorage.setItem("token", resultado.token);
        dispatch(cargarUsuarioSlice(resultado.user));
        navigate("/dashboard");
      } catch (error) {
        setMensajeError(obtenerMensajeError(error, "No se pudo crear la cuenta"));
      }
    },
  });

  return (
    <div className="pantalla-acceso">
      <Card className="tarjeta-acceso">
        <Card.Body>
          <h2>Crear cuenta</h2>

          {mensajeError && <Alert variant="danger">{mensajeError}</Alert>}

          <Form onSubmit={formik.handleSubmit} noValidate>
            <Form.Group className="mb-3" controlId="name">
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

            <Form.Group className="mb-3" controlId="username">
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

            <Form.Group className="mb-3" controlId="email">
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

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.password && Boolean(formik.errors.password)}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="repetirPassword">
              <Form.Label>Repetir contraseña</Form.Label>
              <Form.Control
                type="password"
                name="repetirPassword"
                value={formik.values.repetirPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.repetirPassword && Boolean(formik.errors.repetirPassword)}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.repetirPassword}</Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" disabled={!formik.isValid || formik.isSubmitting}>
              Registrarme
            </Button>
          </Form>

          <p className="mt-3">
            ¿Ya tenés cuenta? <NavLink to="/login">Iniciá sesión</NavLink>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Registro;
