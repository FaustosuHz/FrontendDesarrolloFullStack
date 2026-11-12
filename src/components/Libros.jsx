import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Libro from "./Libro.jsx";
import { filtrarLibrosPorSearch, modificarSearchSlice } from "../redux/features/librosSlice.js";

const Libros = () => {
  const dispatch = useDispatch();

  const listaLibros = useSelector((state) => state.librosSlice.listaLibros);
  const listaLibrosFiltrados = useSelector(filtrarLibrosPorSearch);

  const handlerFilter = (e) => {
    dispatch(modificarSearchSlice(e.target.value));
  };

  return (
    <>
      <div className="encabezado-libros">
        <h2>Mis libros</h2>
        <span className="cantidad-libros">{listaLibros.length}</span>
      </div>

      <div className="filtro">
        <label htmlFor="txtFiltro">Buscar:</label>
        <input type="text" id="txtFiltro" placeholder="Título" onChange={handlerFilter} />
      </div>

      {listaLibros.length === 0 && (
        <p className="vacio">Todavía no agregaste libros. Usá el formulario de arriba para agregar el primero.</p>
      )}

      <div className="tarjetas">
        {listaLibrosFiltrados.map((libro) => (
          <Libro key={libro.id} libro={libro} />
        ))}
      </div>
    </>
  );
};

export default Libros;
