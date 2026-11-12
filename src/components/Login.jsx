import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { loginApi } from "../services/authServices.js";
import { obtenerMensajeError } from "../utils/utils.js";
import { cargarUsuarioSlice } from "../redux/features/usuarioSlice.js";

const esquemaLogin = Yup.object({
  identificador: Yup.string()
    .trim()
    .required("El usuario o email es obligatorio")
    .min(3, "Debe tener al menos 3 caracteres")
    .matches(/^([a-zA-Z0-9]+|\S+@\S+\.\S+)$/, "Ingresá un email o un usuario con solo letras y números"),
  password: Yup.string()
    .required("La contraseña es obligatoria")
    .min(3, "La contraseña debe tener al menos 3 caracteres")
    .max(30, "La contraseña no puede superar los 30 caracteres"),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [mensajeError, setMensajeError] = useState("");

  const formik = useFormik({
    initialValues: {
      identificador: "",
      password: "",
    },

    validationSchema: esquemaLogin,

    onSubmit: async (valores) => {
      setMensajeError("");
      try {
        const resultado = await loginApi(valores);
        localStorage.setItem("token", resultado.token);
        dispatch(cargarUsuarioSlice(resultado.user));
        navigate("/dashboard");
      } catch (error) {
        setMensajeError(obtenerMensajeError(error, "No se pudo iniciar sesión"));
      }
    },
  });

  //deshabilitado el boton si algun campo este vacio
  const camposVacios =
    formik.values.identificador.trim() === "" || formik.values.password === "";

  return (
    <div className="pantalla-acceso">
      <Card className="tarjeta-acceso">
        <Card.Body>
          <h2>Iniciar sesión</h2>

          {mensajeError && <Alert variant="danger">{mensajeError}</Alert>}

          <Form onSubmit={formik.handleSubmit} noValidate>
            <Form.Group className="mb-3" controlId="identificador">
              <Form.Label>Usuario o email</Form.Label>
              <Form.Control
                type="text"
                name="identificador"
                value={formik.values.identificador}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.identificador && Boolean(formik.errors.identificador)}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.identificador}
              </Form.Control.Feedback>
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
              <Form.Control.Feedback type="invalid">
                {formik.errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" disabled={camposVacios || formik.isSubmitting}>
              Iniciar sesión
            </Button>
          </Form>

          <p className="mt-3">
            ¿No tenés cuenta? <NavLink to="/registro">Registrate</NavLink>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
