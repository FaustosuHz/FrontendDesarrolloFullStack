import api from "./authServices.js";

export const describirLibroApi = async (nombre) => {
    const response = await api.get("/public/describir-libro", {
        params: { nombre }
    });
    return response.data;
}
