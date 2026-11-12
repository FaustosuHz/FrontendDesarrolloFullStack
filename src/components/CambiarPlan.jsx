import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { cambiarPlanApi } from "../services/usersServices.js";
import { cargarUsuarioSlice } from "../redux/features/usuarioSlice.js";
import { obtenerMensajeError } from "../utils/utils.js";

const CambiarPlan = () => {
  const dispatch = useDispatch();
  const usuario = useSelector((state) => state.usuarioSlice.usuario);

  const cambiarHandler = async () => {
    try {
      const usuarioActualizado = await cambiarPlanApi("premium");
      dispatch(cargarUsuarioSlice(usuarioActualizado));
      toast.success("Ahora tenés el plan Premium");
    } catch (error) {
      toast.error(obtenerMensajeError(error, "No se pudo cambiar el plan"));
    }
  };

  return (
    <div className="panel">
      <h3>Tu plan</h3>
      {usuario?.plan === "premium" ? (
        <>
          <p className="dato-grande">Premium</p>
          <p>Podés agregar todos los libros que quieras</p>
        </>
      ) : (
        <>
          <p className="dato-grande">Plus</p>
          <p>Hasta 4 libros. Pasate a Premium para no tener límite</p>
          <button className="principal" onClick={cambiarHandler}>Pasar a Premium</button>
        </>
      )}
    </div>
  );
};

export default CambiarPlan;
