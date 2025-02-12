import React, { useState, useRef } from "react";

import { IKContext, IKImage, IKUpload } from "imagekitio-react";

const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_API_ENDPOINT;
console.log("🚀 ~ urlEndpoint:", urlEndpoint);
const publicKey = import.meta.env.VITE_IMAGE_KIT_KEY;
console.log("🚀 ~ publicKey:", publicKey);
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_URL;
console.log("🚀 ~ BACKEND_API_URL:", BACKEND_API_URL);
const authenticator = async () => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/upload`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};
const Upload = ({ setImg }) => {
  const uploadIcon = useRef(null);
  const onError = (err) => {
    console.log("Error", err);
    setImg((prev) => ({ ...prev, error: err?.message }));
  };

  const onSuccess = (res) => {
    console.log("Success", res);
    setImg((prev) => ({ ...prev, isLoading: false, db: res }));
  };

  const onUploadProgress = (progress) => {
    console.log("Progress", progress);
  };

  const onUploadStart = (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      console.log("Start", e);
      setImg((prev) => ({
        ...prev,
        isLoading: true,
        aiData: {
          inlineData: {
            data: fileReader.result.split(",")[1],
            mimeType: file.type,
          },
        },
      }));
    };
    fileReader.readAsDataURL(file);
  };
  return (
    <div>
      <IKContext
        urlEndpoint={urlEndpoint}
        publicKey={publicKey}
        authenticator={authenticator}
      >
        <IKUpload
          fileName="test-upload.png"
          onError={onError}
          onSuccess={onSuccess}
          useUniqueFileName={true}
          onUploadStart={onUploadStart}
          onUploadProgress={onUploadProgress}
          className="hidden"
          // style={{ display: "none" }}
          ref={uploadIcon}
        />
        <label onClick={() => uploadIcon.current.click()}>
          <img className="cursor-pointer w-5 " src="/attachment.png" alt="" />
        </label>
      </IKContext>
    </div>
  );
};

export default Upload;
