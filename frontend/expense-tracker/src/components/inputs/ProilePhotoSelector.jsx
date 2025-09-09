import React, { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProilePhotoSelector = ({ setImg }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file); // for backend 
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setImg(null);
    setPreviewUrl(null);
  };

  const chooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex justify-center mb-6 relative">
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {!previewUrl ? (
        <div className="w-20 h-20 rounded-full bg-slate-200 flex justify-center items-center cursor-pointer relative">
          <LuUser className="text-4xl text-gray-500" />
          <button 
            type="button" 
            onClick={chooseFile} 
            className="w-8 h-8 flex items-center justify-center bg-purple-500 text-white rounded-full absolute -bottom-1 -right-1 shadow-lg hover:bg-blue-700"
          >
            <LuUpload className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative w-20 h-20">
          <img 
            src={previewUrl} 
            alt="Profile Photo" 
            className="w-20 h-20 rounded-full object-cover" 
          />
          <button 
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 shadow-lg hover:bg-red-600" 
            type="button" 
            onClick={handleRemovePhoto}
          >
            <LuTrash className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProilePhotoSelector;
