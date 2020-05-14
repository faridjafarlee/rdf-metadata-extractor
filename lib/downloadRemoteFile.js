const http = require('http');
const https = require('https');
const fs = require('fs');

function downloadRemoteFile(url, destination, onHeaders, onData) {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(destination);

    let transport = https;
    if (url.startsWith('http://')) transport = http;
    if (!url.startsWith('http')) throw new Error('Non HTTP(S) URL');
    
    const request = transport.get(url, (response) =>{
      response.pipe(writeStream);
      
      const onError = (error) => {
        writeStream.close();
        fs.unlink(destination, (err) => {});
        reject(error);
      };
      response.on('error', onError);
      writeStream.on('error', onError);
      
      writeStream.on('finish', () => {
        writeStream.close();
        resolve(destination);
      });
  
      if (onData) {
        response.on('data', onData);
      }
    });
  
    if (onHeaders) {
      request.on('response', (response) => {
        if(response.headers) {
          onHeaders(response.headers);
        }
      });
    }
  });
}

module.exports = downloadRemoteFile;