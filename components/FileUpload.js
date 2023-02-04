import React from "react";
import axios from "axios";
import { CloudArrowUp } from 'react-bootstrap-icons';

const http = axios.create({
//  baseURL: "http://localhost:8080",
  headers: {
    "Content-type": "multipart/form-data"
  }
});


const upload = (url, name, file, onUploadProgress) => {
  let formData = new FormData();
  formData.append(name, file);
 // let host = getHost();
  return http.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};

const UploadFiles = ({url, name, label, title, setData, setMessage}) => {
  const doUpload = (event) => {
    let file = event.target.files[0];
      setMessage('uploading ...');
      upload(url, name, file, (event) => {
    })
    .then((response) => {
      setData(response)
      setMessage(false);
    })
    .catch(() => {
      setMessage('Error uploading file');
    });
  };

  return (
    <div className="upload">
            <label className="btn btn-default btn-file" title={title}>
             {label == 'icon'? <div className="upload"><CloudArrowUp /></div> : label}  <input type="file" hidden  id="uploadfile" name="file" onChange={doUpload}/>
            </label>
    </div>
  );

};

export default UploadFiles;
