import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  background: #F7CAC9;
  ${'' /* color: white; */}
  height: 100vh;
  font-family: 'Comic Sans', sans-serif;
  ${'' /* letter-spacing: 3px; */}
`;

const Message = styled.div`
  margin-top: 15px;
`

const DropzoneArea = styled.div`
  border: 2px dashed #cccccc;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
`;

const EmailInput = styled.input`
  ${'' /* margin-left: 10px; */}
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;

function App() {
  const [responseData, setResponseData] = useState('');
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [thumbnail, setThumbnail] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
    const videoUrl = URL.createObjectURL(acceptedFiles[0]);
    const video = document.createElement("video");
    video.src = videoUrl;

    // Add a slight delay before capturing the frame to ensure that video is loaded.
    setTimeout(() => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      setThumbnail(canvas.toDataURL());
    }, 2000);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'video/*',
    maxFiles: 1,
  });

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(emailValue));
    setEmail(emailValue);
  };

  const randomId = () => {
    //function that returns a random 10 digit number and letter string to be used as the id for the api request
    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return randomString;
  }
  const handleSubmit = async () => {
    if (!file || !isEmailValid) {
      alert('Please select a file and enter a valid email to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email);
    formData.append('id', randomId());

    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully');
      setResponseData(response.data)
    } catch (error) {
      alert('Error uploading file');
    }
  };

  return (
    <Container>
      <DropzoneArea {...getRootProps()}>
        <input {...getInputProps()} />
        {thumbnail ? (
          <img src={thumbnail} alt="Video thumbnail" style={{ maxWidth: '100%', maxHeight: '240px' }} />
        ) : (
          <p>Drag & drop a video here, or click to select a file</p>
        )}
      </DropzoneArea>
      <div style={{ margin: '10px 0' }}>
        {/* <label>
          Email: */}
          <EmailInput
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            style={{ borderColor: isEmailValid ? null : 'red' }}
          />
        {/* </label> */}
      </div>
      <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
      <Message>{responseData ? JSON.stringify(responseData) : ""}</Message>
    </Container>
  );
}

export default App;
