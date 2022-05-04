import React from 'react';
import Dropzone from 'react-dropzone-uploader';

import 'react-dropzone-uploader/dist/styles.css';
import './Uploader.css';

// "{\"uploadURL\":\"https://clearlake-file-upload.s3.us-west-2.amazonaws.com/7192008.jpg?AWSAccessKeyId=ASIA6HUOTMWY76HBVATT&Content-Type=image%2Fjpeg&Expires=1646980139&Signature=PDSBLfmN%2FZ1jUeIXfRc%2BRF7M4Nw%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEJf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDd8lcMECv0D%2FS9m%2B3vkLDkIWCw%2FFdS4aiAZK5wjC8a2gIgQqfRJodkt0lOIWOfrenCeDBuehuzqlk2h17MQAfVT3gqogIIEBAAGgw5Nzg0Nzc4Njg0NjUiDM%2BVBnzBeBGMc6V1BSr%2FAar90tr5C8RW4WlEuRkwgQ7ls%2BdKsz00%2FNHCYuaQdX5KzmsU%2FSacLsnuuSGXpOwuisulwGwsMT2gpiMyNHD%2BHHxAqZSAqT2lZAioUG6gUDgdq7CtkszJT0TDl%2F13vpaNMx3u4qj0IZuMNnHvXgQRBx54ZjAMdMfUgSoBjjnDgONBliN%2BlkuksNnRFhLpTxuhg8L%2BZARCh41QppIkifUOeq0GGN0McC51m%2F2mdB8pBvXw8hfpVMUWrc6iuA4xVtSf98U3rYPDu28rjSzyyIjbo7BhaEbZBTfi5KOsWJzuVAV4SQQEVcchhaUHEmZiYJ0HXEPZbiMC8jymkKSyP%2BB7kTD%2B1auRBjqaAfjfUeJV7LamgwKH%2FzYQKtBOlBv6ivZHBmMPyzvKPPJjc%2F7cyWw0h0rQVa9uUBIJ529GQl7h34wMQdOuF7xhrIwQJOXkP%2FGtXhBrJj6hrpj07cYqBpSyR3GcGmeLXZGD8d5NID5fMv3fqUXbfpueK8JaH9W2KWjKKAr6Lg6RCMfoIbapwA2B7tb2NnaHhNmG27wwIvpUXfWJmKI%3D\",\"Key\":\"7192008.jpg\"}"
// API endpoint : https://swkt2vo9q1.execute-api.us-west-2.amazonaws.com/default/clearlake-getPresignedFileURL

const Uploader = () => {
    const API_ENDPOINT = "https://swkt2vo9q1.execute-api.us-west-2.amazonaws.com/default/clearlake-getPresignedFileURL";
    const axios = require('axios').default;

    const handleChangeStatus = ({ meta, remove }, status) => {
        console.log(status, meta);
    }
  
    const handleSubmit = async (files) => {
        console.log(files);
        
        for (let i = 0; i < 5; i++) {
          const f = files[i];
          let parsedFileName = f['file'].name.toLowerCase().split("_");
          let fileName;
          console.log(parsedFileName);

          if ((parsedFileName[0] == "met") || (parsedFileName[0] == "streams") || (parsedFileName[0] == "clearlake")) {
            fileName = parsedFileName[0] +"/"+ parsedFileName[1] +"/"+ f['file'].name
          } else {
            fileName = f['file'].name
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

          console.log("Response: ", response)

          // PUT request: upload file to S3
          // put the file into bucket

          const result = await fetch(response.data.uploadURL, {
              method: "PUT",
              headers: {
                  "Content-Type": "text/csv"
              },
              body: f['file']
          })

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