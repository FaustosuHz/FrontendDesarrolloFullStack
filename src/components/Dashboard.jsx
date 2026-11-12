import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import App from "../App.jsx";
import { obtenerUsuarioApi } from "../services/usersServices.js";
import { obtenerCategoriasApi } from "../services/categoriasServices.js";
import { cargarUsuarioSlice } from "../redux/features/usuarioSlice.js";
import { cargarCategoriasSlice } from "../redux/features/categoriasSlice.js";
import { programarVencimiento } from "../utils/sesion.js";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [estaLogueado, setEstaLogueado] = useState(false);

  const cargarDatos = async (idUsuario, controller) => {
    try {
      const usuario = await obtenerUsuarioApi(idUsuario, controller.signal);
      dispatch(cargarUsuarioSlice(usuario));

      const listaCategorias = await obtenerCategoriasApi(controller.signal);
      dispatch(cargarCategoriasSlice(listaCategorias));
    } catch (error) {
      if (error.code === "ERR_CANCELED") {
        console.log("Petición cancelada");
        return;
      }
      toast.error("No se pudieron cargar los datos");
    }
  };


  
  useEffect(() => {
    const controller = new AbortController();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    programarVencimiento(token, () => {
      toast.info("Tu sesión venció. Iniciá sesión nuevamente.");
      navigate("/login", { replace: true });
    });

    const { id } = jwtDecode(token);
    setEstaLogueado(true);
    cargarDatos(id, controller);

    return () => {
      controller.abort();
    };
  }, []);

  return <>{estaLogueado ? <App /> : <p>Cargando</p>}</>;
};

export default Dashboard;
