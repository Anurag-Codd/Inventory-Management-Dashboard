import { useState } from "react";
import { useAddMultipleProductsMutation } from "../store/api/productApi";
import toast from "react-hot-toast";
import style from "./MultiProduct.module.css";
import { X } from "lucide-react";
import Button from "./Button";

const MultiProduct = ({ onClose }) => {
  const [file, setfile] = useState(null);
  const [addMultipleProducts, { isLoading ,error}] = useAddMultipleProductsMutation();

  const handleDrop = (e) => {
    e.preventDefault();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setfile(file);
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setfile(file);
      }
    }
  };

  const handleUpload = async () => {
    if (file) {
      try {
        const formData = new FormData();
      formData.append("file", file);
      await addMultipleProducts(formData).unwrap();
      toast.success("file uploaded");
      onClose();
      } catch (err) {
        toast.error(error.data.error)
        
      }
    }
  };

  return (
    <div className={style.container} onClick={onClose}>
      <div
        className={`${style.card} ${style.uploadCard}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={style.uploadHeader}>
          <h3>CSV Upload</h3>
          <button className={style.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p className={style.uploadSubtitle}>Add your documents here</p>

        <div
          className={style.uploadArea}
          onDragEnter={(e) => e.preventDefault()}
          onDragLeave={(e) => e.preventDefault()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className={style.uploadIcon}>📁</div>
          <p>Drag your file(s) to start uploading</p>
          <p className={style.orText}>OR</p>
          <label className={style.browseBtn}>
            Browse files
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
          </label>
        </div>

        {file && (
          <div className={style.filePreview}>
            <div className={style.fileInfo}>
              <span className={style.csvIcon}>CSV</span>
              <div className={style.fileDetails}>
                <span className={style.fileName}>{file.name}</span>
                <span className={style.fileSize}>
                  {(file.size / 1024).toFixed(1)}KB
                </span>
              </div>
              <button
                className={style.removeFile}
                onClick={() => setfile(null)}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        <div className={style.uploadActions}>
          <Button className={style.cancelBtn} onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpload}>
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MultiProduct;
