import { useSelector } from "react-redux";

export const LIMITE_PLUS = 4;

export const obtenerMensajeError = (error, mensajePorDefecto) => {
    const datos = error.response?.data;
    return datos?.error || datos?.mensaje || datos?.message || mensajePorDefecto;
};

export const useObtenerNombreCategoria = () => {
    const listaCategorias = useSelector((state) => state.categoriasSlice);

    const obtenerNombreCategoria = (categoryId) => {
        const categoria = listaCategorias.find((c) => c.id == categoryId);
        return categoria ? categoria.name : "";
    };

    return obtenerNombreCategoria;
};
