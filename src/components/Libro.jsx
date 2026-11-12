import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { borrarLibroSlice, editarLibroSlice } from "../redux/features/librosSlice.js";
import { borrarLibroApi, editarLibroApi } from "../services/librosServices.js";
import { describirLibroApi } from "../services/publicServices.js";
import { obtenerMensajeError, useObtenerNombreCategoria } from "../utils/utils.js";

const Libro = (propiedades) => {
  const { libro } = propiedades;
  const { id, title, completed, categoryId } = libro;

  const dispatch = useDispatch();
  const listaCategorias = useSelector((state) => state.categoriasSlice);
  const obtenerNombreCategoria = useObtenerNombreCategoria();

  const [editando, setEditando] = useState(false);
  const [tituloEditando, setTituloEditando] = useState(title);
  const [categoriaEditando, setCategoriaEditando] = useState(categoryId);
  const [descripcion, setDescripcion] = useState("");
  const [describiendo, setDescribiendo] = useState(false);

  const guardarEnApi = async (libroModificado) => {
    try {
      const libroEditado = await editarLibroApi(id, libroModificado);
      dispatch(editarLibroSlice(libroEditado));
      return true;
    } catch (error) {
      toast.error(obtenerMensajeError(error, "No se pudo modificar el libro"));
      return false;
    }
  };

  const onChangeHandler = (evento) => {
    const checked = evento.target.checked;
    guardarEnApi({ title, completed: checked, categoryId });
  };

  const handlerEditar = () => {
    setTituloEditando(title);
    setCategoriaEditando(categoryId);
    setEditando(true);
  };

  const handlerGuardar = async () => {
    const tituloLimpio = tituloEditando.trim();
    if (tituloLimpio === "") {
      toast.error("El título es obligatorio");
      return;
    }
    if (tituloLimpio.length > 100) {
      toast.error("El título no puede superar los 100 caracteres");
      return;
    }

    const guardo = await guardarEnApi({
      title: tituloLimpio,
      completed,
      categoryId: categoriaEditando,
    });
    if (guardo) {
      toast.success("Libro modificado");
      setEditando(false);
    }
  };

  const borrarHandler = async () => {
    try {
      await borrarLibroApi(id);
      dispatch(borrarLibroSlice(id));
      toast.success("Libro eliminado");
    } catch (error) {
      toast.error(obtenerMensajeError(error, "No se pudo eliminar el libro"));
    }
  };

  const describirHandler = async () => {
    setDescribiendo(true);
    try {
      const resultado = await describirLibroApi(title);
      setDescripcion(resultado.descripcion);
    } catch (error) {
      toast.error("No se pudo obtener la descripción");
    } finally {
      setDescribiendo(false);
    }
  };

  return (
    <div className="tarjeta">
      {editando ? (
        <div className="tarjeta-edicion">
          <input
            type="text"
            value={tituloEditando}
            onChange={(e) => setTituloEditando(e.target.value)}
          />
          <select value={categoriaEditando} onChange={(e) => setCategoriaEditando(e.target.value)}>
            {listaCategorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.name}
              </option>
            ))}
          </select>
          <button className="principal" onClick={handlerGuardar}>Guardar</button>
          <button onClick={() => setEditando(false)}>Cancelar</button>
        </div>
      ) : (
        <>
          <div className="tarjeta-cabecera">
            <input
              type="checkbox"
              id={`libro_${id}`}
              checked={completed}
              onChange={onChangeHandler}
            />
            <div className="tarjeta-info">
              <label className="checkLabel" htmlFor={`libro_${id}`}>{title}</label>
              <span className="etiqueta-categoria">{obtenerNombreCategoria(categoryId)}</span>
            </div>
            <span className={`estado ${completed ? "leido" : "pendiente"}`}>
              {completed ? "Leído" : "Pendiente"}
            </span>
          </div>

          <div className="tarjeta-acciones">
            <button className="boton-ia" onClick={describirHandler} disabled={describiendo}>
              {describiendo ? "Generando descripción..." : "Describir con IA"}
            </button>
            <div className="acciones-secundarias">
              <button onClick={handlerEditar}>Editar</button>
              <button className="peligro" onClick={borrarHandler}>Eliminar</button>
            </div>
          </div>

          {descripcion && (
            <div className="descripcion">
              <span className="descripcion-titulo">Descripción generada con IA</span>
              <p>{descripcion}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Libro;
