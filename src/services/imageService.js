import api from "./authServices.js";

export const uploadImage = async (base64) => {
    const response = await api.post("/images", { file: base64 });
    return response.data;
}

export const deleteImage = async (publicId) => {
    const response = await api.delete(`/images/${encodeURIComponent(publicId)}`);
    return response.data;
}
