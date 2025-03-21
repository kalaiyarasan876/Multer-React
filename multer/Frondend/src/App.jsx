import React, { useState } from "react";
import axios from "axios";

const api_url = "http://localhost:5000/Upload/Files";



const App = () => {
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Handle file selection
  const handleChange = (event) => {
    const files = Array.from(event.target.files);
    const updatedFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFileList((prevFiles) => [...prevFiles, ...updatedFiles]);
  };

  // Handle image preview
  const handlePreview = (file) => {
    setPreviewImage(file.preview);
    setPreviewTitle(file.file.name);
    setPreviewOpen(true);
  };

  // Remove selected image
  const handleRemove = (index) => {
    setFileList(fileList.filter((_, i) => i !== index));
  };

  // Handle file upload
  const handleUpload = async () => {
    if (fileList.length === 0) {
      setMessage("Please select at least one file to upload.");
      setTimeout(() => window.location.reload(), 2000);
      return;
    }

    setUploading(true);

    const formData = new FormData();
    fileList.forEach(({ file }) => {
      formData.append("images", file);
    });

    try {
      // if (response.data.result) {}
      const response = await axios.post(api_url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      console.log(response);
      setMessage("Files uploaded successfully!");
      setFileList([]);
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      console.log(err);
      setMessage("Upload failed. Please try again.", { message });
      //setTimeout(() => window.location.reload(), 2000);
    } finally {
      setUploading(false);
     // setTimeout(() => window.location.reload(), 2000);
    }
  };

  return (
    <>

      <div class="card" style={{ height: '100vh' }}>
        <div className="container mt-5">
          <h2 className="mb-4 text-center text-primary  text-capitalize fw-bold">React Multiple Image Upload with Preview</h2>
<hr/>
          <div className="mb-3 text-center">
            <input
              type="file"
              multiple
              className="form-control w-50 mx-auto"
              style={{ padding: "4px", fontSize: "14px" }}
              onChange={handleChange}
            />
          </div>

          <div className="row g-3 mt-3">
            {fileList.map((file, index) => (
              <div key={index} className="col-md-3">
                <div className="card shadow-sm bg-body-tertiary rounded">
                  <img
                    src={file.preview}
                    alt={`Preview ${index}`}
                    className="card-img-top"
                    style={{ height: "100px", objectFit: "cover", cursor: "pointer" }}
                    onClick={() => handlePreview(file)}
                  />
                  <div className="card-body p-8 text-center">
                    <small className="text-muted">{file.file.name}</small>
                    <button
                      className="btn btn-sm btn-danger ms-5 "
                      onClick={() => handleRemove(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>



          <div className="text-center mt-4">
            <button className="btn btn-primary btn-sm" onClick={handleUpload} disabled={uploading}>
              {uploading ? (
                <>
                  <span className="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
                  <span role="status"> Uploading...</span>
                </>
              ) : (
                "Upload Files"
              )}
            </button>
          </div>

          {previewOpen && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{previewTitle}</h5>
                    <button type="button" className="btn-close" onClick={() => setPreviewOpen(false)}></button>
                  </div>
                  <div className="modal-body text-center">
                    <img src={previewImage} alt="Preview" className="img-fluid" />
                  </div>
                </div>
              </div>
            </div>
          )}



          <div className="text-center mt-4">
            {message && <div className="alert alert-info">{message}</div>}
          </div>
        </div>


      </div>

    </>
  );

};


export default App;
