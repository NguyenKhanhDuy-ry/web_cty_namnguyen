import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import api from "../services/api";

const MAX_FILES = 20;
const MAX_SIZE = 10 * 1024 * 1024;

const ImageUploader = ({ value = [], onChange }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const selectedUrls = useMemo(() => Array.isArray(value) ? value.filter(Boolean) : [], [value]);

  const combinedFiles = useMemo(() => {
  const localPreviews = files.map((file) => ({
  originalFile: file,
  url: URL.createObjectURL(file),
  name: file.name,
  isLocal: true
}));
    const existingImages = selectedUrls.map((url) => ({ url, name: "Ảnh đã tải lên", isLocal: false }));
    return [...existingImages, ...localPreviews];
  }, [files, selectedUrls]);

  useEffect(() => {
    // Cleanup object URLs to prevent memory leaks
    return () => {
      files.forEach((file) => URL.revokeObjectURL(URL.createObjectURL(file)));
    };
  }, [files]);

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    setError("");

    if (fileRejections.length > 0) {
      const message = fileRejections[0].errors[0].message;
      setError(message);
      return;
    }

    if (!acceptedFiles.length) {
      return;
    }

    const nextFiles = [...files, ...acceptedFiles].slice(0, MAX_FILES);
    setFiles(nextFiles);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": []
    },
    maxSize: MAX_SIZE,
    multiple: true
  });

  const handleUpload = async () => {
    if (!files.length) {
      setError("Vui lòng chọn ít nhất một ảnh trước khi tải lên.");
      return;
    }

    if (selectedUrls.length + files.length > MAX_FILES) {
      setError(`Tối đa ${MAX_FILES} ảnh cho mỗi sản phẩm.`);
      return;
    }

    setUploading(true);
    setError("");
    setProgress(0);

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      const token = localStorage.getItem("admin_token");
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: (event) => {
          if (event.total) {
            setProgress(Math.round((event.loaded * 100) / event.total));
          }
        }
      });
      console.log(response.data);

      if (response.data?.success) {
        const uploadedUrls = response.data.urls || [];
        const nextValue = [...selectedUrls, ...uploadedUrls].slice(0, MAX_FILES);

        if (onChange) {
          onChange(nextValue);
        }

        setFiles([]);
        setProgress(100);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Đã xảy ra lỗi khi tải ảnh lên.";
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const removeLocalFile = (fileToRemove) => {
    setFiles((currentFiles) => currentFiles.filter((file) => file !== fileToRemove.originalFile));
  };

  const removeExistingImage = (imageUrl) => {
    if (!onChange) return;
    onChange(selectedUrls.filter((url) => url !== imageUrl));
  };

  return (
    <div className="image-uploader">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "is-active" : ""}`}
        style={styles.dropzone}
      >
        <input {...getInputProps()} />
        <p>Kéo và thả ảnh vào đây, hoặc nhấn để chọn tệp</p>
        <small>Hỗ trợ: JPG, PNG, WEBP • Tối đa {MAX_SIZE / 1024 / 1024}MB mỗi ảnh • Tối đa {MAX_FILES} ảnh</small>
      </div>

      {combinedFiles.length > 0 ? (
        <div style={styles.previewList}>
          {combinedFiles.map((file, index) => (
            <div key={file.isLocal ? `${file.name}-${index}` : file.url} style={styles.previewItem}>
              <img src={file.url} alt={file.name} style={styles.previewImage} />
              {file.isLocal && <span>{file.name}</span>}
              <button
                type="button"
                onClick={() => (file.isLocal ? removeLocalFile(file) : removeExistingImage(file.url))}
                style={styles.removeButton}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {error ? <p style={{ color: "#d9534f", marginTop: 8 }}>{error}</p> : null}
      {uploading ? <p style={{ marginTop: 8 }}>Đang tải lên... {progress}%</p> : null}

      <button type="button" onClick={handleUpload} disabled={uploading || !files.length} style={styles.button}>
        {uploading ? "Đang tải lên..." : "Tải ảnh lên"}
      </button>
    </div>
  );
};

const styles = {
  dropzone: {
    border: "2px dashed #5b7cff",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    marginBottom: "10px",
    background: "#f7f9ff"
  },
  previewList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: "10px",
    marginBottom: "10px"
  },
  previewItem: {
    position: "relative",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    overflow: "hidden",
    padding: "6px",
    background: "#fff"
  },
  previewImage: {
    width: "100%",
    height: "90px",
    objectFit: "cover",
    borderRadius: "6px"
  },
  removeButton: {
    position: "absolute",
    top: "8px",
    right: "8px",
    border: "none",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    cursor: "pointer"
  },
  button: {
    padding: "10px 16px",
    cursor: "pointer",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#fff"
  }
};

export default ImageUploader;