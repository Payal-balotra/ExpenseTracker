import React, { useState } from "react";
import EmojiPicker from 'emoji-picker-react';
import { LuImage, LuX } from "react-icons/lu";

const EmojiPickerPopup = ({ icon, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      {/* Trigger button */}
      <div
        className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition"
        onClick={() => setIsOpen(true)}
      >
        <div className="text-3xl">
          {icon ? (
            <img src={icon} alt="icon" className="w-10 h-10 object-contain" />
          ) : (
            <LuImage className="w-10 h-10 text-slate-500" />
          )}
        </div>
        <p className="mt-2 text-sm text-slate-600">
          {icon ? "Change Icon" : "Pick Icon"}
        </p>
      </div>

      {/* Popup */}
      {isOpen && (
        <div className="absolute z-50 mt-2 right-0 bg-white border border-slate-200 rounded-xl shadow-lg p-3">
          {/* Close button */}
          <div className="flex justify-end">
            <button
              className="p-1 rounded-full hover:bg-slate-100 transition"
              onClick={() => setIsOpen(false)}
            >
              <LuX className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Emoji picker */}
          <EmojiPicker
            open={isOpen}
            onEmojiClick={(emoji) => {
              onSelect(emoji?.imageUrl || "");
              setIsOpen(false); // close after select
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerPopup;
