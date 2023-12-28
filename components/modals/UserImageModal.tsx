import Image from "next/image";
import React from "react";

const UserImageModal = ({ setShowUserImage, UserImage }: any) => {
  return (
    <div className="fixed top-2/4 left-2/4 -translate-x-2/4 md:-translate-y-2/4 h-[85vh] w-[75vw] bg-[#000000] z-20 border-[#343434] border-4 rounded-lg">
      <button
        className="flex items-center justify-center h-[40px] w-[40px] rounded-full border-2 border-[#323232] text-[#5c5c5c] hover:text-[#b3b3b3] hover:border-[#9a9a9a] 
        absolute right-2 top-2 z-20"
        onClick={() => setShowUserImage((prev: boolean) => !prev)}
      >
        <i className="fa-solid fa-xmark text-[24px]"></i>
      </button>
      <div className="w-full h-full flex justify-center items-center overflow-hidden relative">
        <Image
          src={UserImage !== "" ? UserImage : "/images/no_user.png"}
          alt=""
          height={1080}
          width={1080}
          className="object-contain w-full h-full"
        />
      </div>
    </div>
  );
};

export default UserImageModal;
