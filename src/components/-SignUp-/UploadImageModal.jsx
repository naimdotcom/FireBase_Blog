"use client";
import { CloudArrowUp, Trash } from "phosphor-react";
import { KeepModalComponent } from "../KeepComponent/KeepModal";
import { Info } from "phosphor-react";
import { useCallback, useEffect, useState } from "react";

import {
  Upload,
  UploadBody,
  UploadFooter,
  UploadIcon,
  UploadText,
  Button,
  toast,
} from "keep-react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

export const UploadImageModal = ({ setImageUrl }) => {
  const [IsModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const storage = getStorage();

  const uploadImages = () => {
    const storageRef = ref(storage, `profileImages/${files[0].name}`);

    const uploadTask = uploadBytesResumable(storageRef, files[0]);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setImageUrl(downloadURL);
        });
        toast("Image Uploaded", {
          description: "Image uploaded successfully",
        });
      }
    );
  };

  const handelOnRemove = () => {
    setFiles([]);
    setPreviewImage(null);
  };

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);

  useEffect(() => {
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
  }, [files]);
  return (
    <div>
      <Button
        variant="outline"
        color="secondary"
        className="w-full self-start"
        onClick={(e) => {
          e.preventDefault();
          setIsModalOpen(true);
        }}
      >
        <CloudArrowUp size={20} className="mr-1.5" />
        Upload
      </Button>
      <KeepModalComponent
        isOpen={IsModalOpen}
        setIsOpen={setIsModalOpen}
        className={`w-96`}
      >
        <Upload horizontal options={{ onDrop, multiple: false }}>
          <UploadBody className="w-full">
            <UploadIcon>
              <img src={previewImage ? previewImage : ""} alt="folder" />
            </UploadIcon>
            <UploadText>
              <p className="text-body-3 font-medium text-metal-600">
                Choose File to Upload
              </p>
              <p className="text-body-4 font-normal text-metal-400">
                PDF and JPG formats
              </p>
            </UploadText>
          </UploadBody>
          <UploadFooter isFileExists={files.length > 0} className="w-full">
            <p className="my-2 flex items-center gap-1 text-body-4 font-normal text-metal-600 dark:text-metal-300">
              <Info size={16} />
              Uploaded Files
            </p>
            <ul className="space-y-4">
              {files?.map((file) => (
                <li
                  key={file?.name}
                  className="flex items-center justify-between border-l-4 border-l-metal-100 bg-metal-25 px-4 py-2.5 text-left text-body-4 font-normal capitalize text-metal-600 dark:border-l-metal-600 dark:bg-metal-800 dark:text-metal-300 space-x-2"
                >
                  <p>{file?.name}</p>
                  <Trash size={16} onClick={handelOnRemove} color="red" />
                </li>
              ))}
              <button
                className="px-4 py-2.5 rounded-full bg-metal-100 w-full "
                onClick={uploadImages}
              >
                upload
              </button>
            </ul>
          </UploadFooter>
        </Upload>
      </KeepModalComponent>
    </div>
  );
};
