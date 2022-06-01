import React from 'react';
import Dropzone from 'react-dropzone-uploader';

import 'react-dropzone-uploader/dist/styles.css';
import './Uploader.css';

// API endpoint : https://ckxm4p1ddg.execute-api.us-west-2.amazonaws.com/clearlake-getPresignedUrlTest

/**
 * Component for showing the upload area.
 * @returns {JSX.Element}
 */
const Uploader = () => {
    const API_ENDPOINT = "https://ckxm4p1ddg.execute-api.us-west-2.amazonaws.com/clearlake-getPresignedUrlTest";
    const axios = require('axios').default;

    const handleChangeStatus = ({ meta, remove }, status) => {
        console.log(status, meta);
    }
  
    const handleSubmit = async (files) => {
        console.log(files);
        
        for (let i = 0; i < files.length; i++) {
          const f = files[i];
          let parsedFileName = f['file'].name.toLowerCase().split("_");
          let fileName;
          console.log(parsedFileName);

          if ((parsedFileName[0] === "met") || (parsedFileName[0] === "clearlake")) {
            fileName = parsedFileName[0] +"/"+ parsedFileName[1] +"/"+ f['file'].name;
          } else if ((parsedFileName[0] === "streams")) {
            fileName = parsedFileName[0] +"/"+ parsedFileName[1] +"/"+ parsedFileName[2] +"/" + f['file'].name;
          } else {
            fileName = f['file'].name;
          }

          // GET request: presigned URL
          // make access request 
          const response = await axios({
              method: "POST",
              url: API_ENDPOINT,
              headers: { 
                'Content-Type': 'text/plain'
              },
              data: {
                fileName: fileName
              }
          });

          console.log("Response: ", response);

          // PUT request: upload file to S3
          // put the file into bucket

          const result = await fetch(response.data.uploadURL, {
              method: "PUT",
              headers: {
                  "Content-Type": "text/csv"
              },
              body: f['file']
          });

          console.log('Result: ', result);
          f.remove();
        }

    }
    return (
      <div className='drop-container'>
        <Dropzone
          onChangeStatus={handleChangeStatus}
          onSubmit={handleSubmit}
          maxFiles={5}
          accept='text/csv'
          inputContent={(files, extra) => (extra.reject ? 'CSV files only' : 'Drag CSV Files')}
          disabled={files => files.some(f => ['preparing', 'getting_upload_params', 'uploading'].includes(f.meta.status))}
          styles={{
            dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },
            inputLabel: (files, extra) => (extra.reject ? { color: 'red' } : {}),
          }}
          // multiple={true}
          // canCancel={true}
          // inputContent="Drop A File"
        >
          
        </Dropzone>  
      </div>
    )
  }
  
  <Uploader />

export default Uploader