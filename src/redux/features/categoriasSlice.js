import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const categoriasSlice = createSlice({
    name: "categoriasSlice",
    initialState,
    reducers: {
        cargarCategoriasSlice: (state, action) => {
            const listaCategorias = action.payload;
            return listaCategorias;
        },
        agregarCategoriaSlice: (state, action) => {
            const categoria = action.payload;
            state.push(categoria);
        },
        editarCategoriaSlice: (state, action) => {
            const categoriaEditada = action.payload;
            const categoria = state.find((c) => c.id === categoriaEditada.id);
            if (categoria) {
                categoria.name = categoriaEditada.name;
            }
        },
        borrarCategoriaSlice: (state, action) => {
            const id = action.payload;
            return state.filter((categoria) => categoria.id !== id);
        },
    },
});

export const { cargarCategoriasSlice, agregarCategoriaSlice, editarCategoriaSlice, borrarCategoriaSlice } = categoriasSlice.actions;
export default categoriasSlice.reducer;
