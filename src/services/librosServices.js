import api from "./authServices.js";

export const obtenerLibrosUsuarioApi = async (signal) => {
    const response = await api.get("/libro/usuario", {
        signal: signal
    });
    return response.data;
}

export const crearLibroApi = async (libro) => {
    const response = await api.post("/libro", libro);
    return response.data;
}

export const editarLibroApi = async (idLibro, libro) => {
    const response = await api.put(`/libro/${idLibro}`, libro);
    return response.data;
}

export const borrarLibroApi = async (idLibro) => {
    const response = await api.delete(`/libro/${idLibro}`);
    return response.data;
}
