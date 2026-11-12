import { useEffect, useId, useState } from "react";
import { toast } from "react-toastify";
import { uploadImage, deleteImage } from "../services/imageService.js";
import { obtenerMensajeError } from "../utils/utils.js";

const SubirImagen = ({ handleImgURL, handleImgPublicId, resetKey }) => {
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState("");
  const [imagenSubida, setImagenSubida] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputId = useId();

  useEffect(() => {
    setArchivo(null);
    setPreview("");
    setImagenSubida(null);
    handleImgURL("");
    handleImgPublicId("");
  }, [resetKey]);

  useEffect(() => {
    if (!preview) return;
    return () => {
      URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (evento) => {
    const seleccionado = evento.target.files?.[0];
    if (!seleccionado) return;

    setArchivo(seleccionado);
    setPreview(URL.createObjectURL(seleccionado));
  };

  const quitarSeleccion = () => {
    setArchivo(null);
    setPreview("");
    handleImgURL("");
    handleImgPublicId("");
  };

  const handleUpload = async () => {
    if (!archivo) return;

    setLoading(true);

    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
        reader.readAsDataURL(archivo);
      });

      const resultado = await uploadImage(base64);

      setImagenSubida(resultado);
      handleImgURL(resultado.secure_url);
      handleImgPublicId(resultado.public_id);
    } catch (error) {
      toast.error(obtenerMensajeError(error, "No se pudo subir la imagen"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!imagenSubida?.public_id) return;

    setLoading(true);

    try {
      await deleteImage(imagenSubida.public_id);
      setImagenSubida(null);
      quitarSeleccion();
    } catch (error) {
      toast.error(obtenerMensajeError(error, "No se pudo eliminar la imagen"));
    } finally {
      setLoading(false);
    }
  };

  const deshabilitado = loading || Boolean(imagenSubida);

  return (
    <div className="subir-imagen">
      <h4>Foto de perfil</h4>

      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={deshabilitado}
        hidden
      />

      <label htmlFor={inputId} className={`boton-archivo ${deshabilitado ? "deshabilitado" : ""}`}>
        Seleccionar archivo
      </label>

      {preview && <img src={preview} alt="Vista previa" className="preview-imagen" />}

      {archivo && !imagenSubida && (
        <div className="acciones-imagen">
          <button type="button" className="principal" onClick={handleUpload} disabled={loading}>
            {loading ? "Subiendo..." : "Subir imagen"}
          </button>
          <button type="button" onClick={quitarSeleccion} disabled={loading}>
            Quitar selección
          </button>
        </div>
      )}

      {imagenSubida && (
        <div className="acciones-imagen">
          <p>Imagen subida. Tocá "Guardar cambios" para que quede en tu perfil.</p>
          <button type="button" className="peligro" onClick={handleDelete} disabled={loading}>
            {loading ? "Eliminando..." : "Descartar imagen"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SubirImagen;
