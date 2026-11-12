import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Grafica from "./Grafica.jsx";
import { useObtenerNombreCategoria } from "../utils/utils.js";

const reduceLibros = (acc, libro) => {
  const categoryId = libro.categoryId;
  if (acc[categoryId]) {
    acc[categoryId] = acc[categoryId] + 1;
  } else {
    acc[categoryId] = 1;
  }
  return acc;
};

const MiGrafica = () => {
  const listaLibros = useSelector((state) => state.librosSlice.listaLibros);
  const listaCategorias = useSelector((state) => state.categoriasSlice);

  const obtenerNombreCategoria = useObtenerNombreCategoria();

  const [datos, setDatos] = useState([]);
  const [etiquetas, setEtiquetas] = useState([]);

  useEffect(() => {
    const objetoCategorias = listaLibros.reduce(reduceLibros, {});

    const etiquetasIdCategoria = Object.keys(objetoCategorias);
    const etiquetasAux = etiquetasIdCategoria.map((idCategoria) => obtenerNombreCategoria(idCategoria));
    const datosAux = Object.values(objetoCategorias);

    setEtiquetas(etiquetasAux);
    setDatos(datosAux);
  }, [listaLibros, listaCategorias]);

  return (
    <div className="panel panel-grafica">
      <Grafica
        etiquetas={etiquetas}
        datos={datos}
        nombreGrafica={"Libros por categoría"}
        nombreDatos={"Libros"}
      />
    </div>
  );
};

export default MiGrafica;
