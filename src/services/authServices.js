import axios from "axios";

const urlBase = `${import.meta.env.VITE_API_URL_BACKEND}`;

const api = axios.create({
    baseURL: urlBase,
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const loginApi = async (dataLogin) => {
    const resultado = await api.post("/auth/login", dataLogin);
    return resultado.data;
}

export const registroApi = async (dataRegistro) => {
    const resultado = await api.post("/auth/register", dataRegistro);
    return resultado.data;
}

export default api;
