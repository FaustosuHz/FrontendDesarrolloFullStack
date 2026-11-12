import { configureStore } from '@reduxjs/toolkit'
import librosSlice from "./features/librosSlice.js"
import categoriasSlice from "./features/categoriasSlice.js"
import usuarioSlice from "./features/usuarioSlice.js"

export const store = configureStore({
    reducer: {
        librosSlice, categoriasSlice, usuarioSlice
    },
})
