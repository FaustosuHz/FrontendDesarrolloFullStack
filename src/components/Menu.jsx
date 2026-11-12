import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { limpiarUsuarioSlice } from "../redux/features/usuarioSlice.js";
import { limpiarLibrosSlice } from "../redux/features/librosSlice.js";
import { cancelarVencimiento } from "../utils/sesion.js";

const Menu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const usuario = useSelector((state) => state.usuarioSlice.usuario);

  const handlerLogout = () => {
    localStorage.clear();
    cancelarVencimiento();
    dispatch(limpiarUsuarioSlice());
    dispatch(limpiarLibrosSlice());
    navigate("/login");
  };

  return (
    <Container className="menu">
      <Row className="align-items-center">
        <Col>
          <h2>Mi Biblioteca</h2>
        </Col>
        <Col className="menu-links">
          <NavLink to="/dashboard" end>Mis libros</NavLink>
          <NavLink to="/dashboard/perfil">Perfil</NavLink>
          {usuario?.role === "admin" && <NavLink to="/dashboard/categorias">Categorías</NavLink>}
          <button onClick={handlerLogout}>Cerrar sesión</button>
        </Col>
      </Row>
    </Container>
  );
};

export default Menu;
