import api from "./authServices.js";

export const obtenerUsuarioApi = async (idUsuario, signal) => {
    const response = await api.get(`/usuario/${idUsuario}`, {
        signal: signal
    });
    return response.data;
}

export const editarUsuarioApi = async (idUsuario, usuario) => {
    const response = await api.put(`/usuario/${idUsuario}`, usuario);
    return response.data;
}

export const cambiarPlanApi = async (plan) => {
    const response = await api.patch("/usuario/plan", { plan });
    return response.data;
}

export const borrarUsuarioApi = async (idUsuario) => {
    const response = await api.delete(`/usuario/${idUsuario}`);
    return response.data;
}
