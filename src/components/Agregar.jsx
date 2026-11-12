import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { agregarLibroSlice } from "../redux/features/librosSlice.js";
import { crearLibroApi } from "../services/librosServices.js";
import { obtenerMensajeError } from "../utils/utils.js";

const esquemaLibro = Yup.object({
  title: Yup.string()
    .trim()
    .required("El título es obligatorio")
    .max(100, "El título no puede superar los 100 caracteres"),
  categoryId: Yup.string().required("Es necesaria la categoria"),
});

const Agregar = () => {
  const dispatch = useDispatch();

  const listaCategorias = useSelector((state) => state.categoriasSlice);

  const formik = useFormik({
    initialValues: {
      title: "",
      categoryId: "",
      completed: false,
    },

    validationSchema: esquemaLibro,

    onSubmit: async (valores, { resetForm }) => {
      try {
        const libroNuevo = {
          title: valores.title.trim(),
          categoryId: valores.categoryId,
          completed: valores.completed,
        };

        const libroCreado = await crearLibroApi(libroNuevo);
        dispatch(agregarLibroSlice(libroCreado));

        toast.success("Libro agregado");
        resetForm();
      } catch (error) {
        toast.error(obtenerMensajeError(error, "No se pudo agregar el libro"));
      }
    },
  });

  return (
    <div className="agregar">
      <h3>Agregar libro</h3>

      <Form onSubmit={formik.handleSubmit} noValidate>
        <div className="agregar-fila">
          <Form.Group className="agregar-titulo" controlId="title">
            <Form.Control
              type="text"
              name="title"
              placeholder="Título del libro"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.title && Boolean(formik.errors.title)}
            />
            <Form.Control.Feedback type="invalid">{formik.errors.title}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="categoryId">
            <Form.Select
              name="categoryId"
              value={formik.values.categoryId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
            >
              <option value="">Categoría</option>
              {listaCategorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{formik.errors.categoryId}</Form.Control.Feedback>
          </Form.Group>

          <Form.Check
            type="checkbox"
            id="completed"
            name="completed"
            label="Leído"
            checked={formik.values.completed}
            onChange={formik.handleChange}
          />

          <Button type="submit" disabled={formik.isSubmitting}>Agregar</Button>
        </div>
      </Form>
    </div>
  );
};

export default Agregar;
