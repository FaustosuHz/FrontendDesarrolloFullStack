import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login.jsx";
import Registro from "./Registro.jsx";
import Dashboard from "./Dashboard.jsx";
import Contenido from "./Contenido.jsx";
import Perfil from "./Perfil.jsx";
import Categorias from "./Categorias.jsx";

const Rutas = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<Contenido />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="categorias" element={<Categorias />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Rutas;
