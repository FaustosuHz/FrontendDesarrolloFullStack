import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    usuario: null
};

const usuarioSlice = createSlice({
    name: "usuarioSlice",
    initialState,
    reducers: {
        cargarUsuarioSlice: (state, action) => {
            const usuario = action.payload;
            state.usuario = usuario;
        },
        limpiarUsuarioSlice: (state) => {
            state.usuario = null;
        },
    },
});

export const { cargarUsuarioSlice, limpiarUsuarioSlice } = usuarioSlice.actions;
export default usuarioSlice.reducer;
