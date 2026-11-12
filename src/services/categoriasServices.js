import api from "./authServices.js";

export const obtenerCategoriasApi = async (signal) => {
    const response = await api.get("/categoria", {
        signal: signal
    });
    return response.data;
}

export const crearCategoriaApi = async (categoria) => {
    const response = await api.post("/categoria", categoria);
    return response.data;
}

export const editarCategoriaApi = async (idCategoria, categoria) => {
    const response = await api.put(`/categoria/${idCategoria}`, categoria);
    return response.data;
}

export const borrarCategoriaApi = async (idCategoria) => {
    const response = await api.delete(`/categoria/${idCategoria}`);
    return response.data;
}
