import { useSelector } from "react-redux";
import ProgressBar from "react-bootstrap/ProgressBar";
import { LIMITE_PLUS } from "../utils/utils.js";

const InformeUso = () => {
  const listaLibros = useSelector((state) => state.librosSlice.listaLibros);
  const usuario = useSelector((state) => state.usuarioSlice.usuario);

  const cantidad = listaLibros.length;

  if (usuario?.plan === "plus") {
    const porcentaje = Math.round((cantidad / LIMITE_PLUS) * 100);
    return (
      <div className="panel">
        <h3>Uso del plan</h3>
        <p className="dato-grande">{porcentaje}%</p>
        <p>{cantidad} de {LIMITE_PLUS} libros usados</p>
        <ProgressBar now={porcentaje} />
      </div>
    );
  }

  return (
    <div className="panel">
      <h3>Uso del plan</h3>
      <p className="dato-grande">{cantidad}</p>
      <p>libros guardados, sin límite</p>
    </div>
  );
};

export default InformeUso;
