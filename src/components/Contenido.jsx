import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import Agregar from "./Agregar.jsx";
import Libros from "./Libros.jsx";
import MiGrafica from "./MiGrafica.jsx";
import InformeUso from "./InformeUso.jsx";
import CambiarPlan from "./CambiarPlan.jsx";
import { obtenerLibrosUsuarioApi } from "../services/librosServices.js";
import { cargarLibrosInicialesSlice } from "../redux/features/librosSlice.js";
import { LIMITE_PLUS } from "../utils/utils.js";

const Contenido = () => {
  const dispatch = useDispatch();

  const listaLibros = useSelector((state) => state.librosSlice.listaLibros);
  const usuario = useSelector((state) => state.usuarioSlice.usuario);

  const obtenerLibros = async (controller) => {
    try {
      const listaLibrosApi = await obtenerLibrosUsuarioApi(controller.signal);
      dispatch(cargarLibrosInicialesSlice(listaLibrosApi));
    } catch (error) {
      if (error.code === "ERR_CANCELED") {
        console.log("Petición cancelada");
        return;
      }
      toast.error("No se pudieron cargar tus libros");
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    obtenerLibros(controller);

    return () => {
      controller.abort();
    };
  }, []);

  const puedeAgregar = usuario?.plan === "premium" || listaLibros.length < LIMITE_PLUS;

  return (
    <Container className="contenido">
      <Row>
        <Col lg={7}>
          {puedeAgregar ? (
            <Agregar />
          ) : (
            <p className="aviso">Llegaste al límite de {LIMITE_PLUS} libros del plan Plus</p>
          )}
          <Libros />
        </Col>
        <Col lg={5}>
          <MiGrafica />
          <InformeUso />
          <CambiarPlan />
        </Col>
      </Row>
    </Container>
  );
};

export default Contenido;
