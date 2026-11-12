import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listaLibros: [],
    search: ""
};

const librosSlice = createSlice({
    name: "librosSlice",
    initialState,
    reducers: {
        cargarLibrosInicialesSlice: (state, action) => {
            const listaLibros = action.payload;
            state.listaLibros = listaLibros;
        },
        agregarLibroSlice: (state, action) => {
            const libro = action.payload;
            state.listaLibros.push(libro);
        },
        borrarLibroSlice: (state, action) => {
            const id = action.payload;
            state.listaLibros = state.listaLibros.filter((libro) => libro.id !== id);
        },
        editarLibroSlice: (state, action) => {
            const libroEditado = action.payload;
            const indice = state.listaLibros.findIndex((libro) => libro.id === libroEditado.id);
            if (indice !== -1) {
                state.listaLibros[indice] = libroEditado;
            }
        },
        modificarSearchSlice: (state, action) => {
            const searchAux = action.payload;
            state.search = searchAux;
        },
        limpiarLibrosSlice: () => {
            return initialState;
        },
    },
});

export const { cargarLibrosInicialesSlice, agregarLibroSlice, borrarLibroSlice, editarLibroSlice, modificarSearchSlice, limpiarLibrosSlice } = librosSlice.actions;
export default librosSlice.reducer;

export const filtrarLibrosPorSearch = (state) => {
    const search = state.librosSlice.search.trim().toLowerCase();
    const listaLibros = state.librosSlice.listaLibros;

    if (search === "") {
        return listaLibros;
    }
    return listaLibros.filter((libro) => libro.title.toLowerCase().includes(search));
};
