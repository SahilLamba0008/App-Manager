"use client";
import { handleUpdateUserProfileAction, revalidate } from "@/lib/actions";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { useFormState } from "react-dom";
import UserImageModal from "./UserImageModal";
import LoadingSpinner from "../LoadingSpinner";
import { usePathname } from "next/navigation";

const UpdateUserProfileModal = ({
  Name,
  UserImage,
  setShowUpdateUserProfileModal,
  md,
}: any) => {
  const [userName, setUserName] = useState<string>(Name);
  const [showUserImage, setShowUserImage] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<any>("");
  const updateUserForm = useRef<HTMLFormElement>(null);
  const pathName = usePathname();

  const initialState = {
    nameError: null,
    imageError: null,
  };

  const [state, formAction] = useFormState(
    handleUpdateUserProfileAction,
    initialState
  );

  // console.log(loading);
  return (
    <>
      <div
        className="modal-wrapper absolute z-10 backdrop-blur-sm blur-sm bg-[#000000a7] top-0 left-0 bottom-0 right-0 rounded-2xl overflow-hidden h-full w-full"
        onClick={() => setShowUpdateUserProfileModal(false)}
      ></div>
      {showUserImage && (
        <UserImageModal
          setShowUserImage={setShowUserImage}
          UserImage={UserImage}
        />
      )}
      <div
        className={`bg-[#181818] rounded-xl border-2 border-[#323232] absolute top-2/4 left-2/4 -translate-x-2/4 ${
          md ? " translate-y-[20%] " : " -translate-y-2/4 "
        } z-10`}
      >
        <form
          className="p-6 min-w-[300px] mx-auto flex flex-col gap-6"
          action={async (formData) => {
            setLoading((prev) => !prev);
            await formAction(formData); //* loading state not working without await
            if (updateUserForm.current) {
              updateUserForm.current.reset();
            }
            revalidate(pathName);
            setLoading((prev) => !prev);
            setTimeout(() => {
              setShowUpdateUserProfileModal((prev: boolean) => !prev);
            }, 500);
          }}
        >
          <div className="flex gap-4">
            <div
              className="w-[85px] h-[85px] rounded-lg overflow-hidden flex items-center justify-center border-8 border-double border-[#393939] cursor-pointer relative"
              onClick={() => setShowUserImage((prev) => !prev)}
            >
              <Image
                src={UserImage !== "" ? UserImage : "/images/no_user.png"}
                alt="user profile"
                height={500}
                width={500}
                className="object-cover w-full h-full overflow-hidden"
              />
            </div>
            <p className="text-[24px] font-bold">{Name}</p>
            <button
              className="flex items-center justify-center h-[40px] w-[40px] rounded-full border-2 border-[#323232] text-[#5c5c5c] hover:text-[#b3b3b3] hover:border-[#9a9a9a] absolute right-2 top-2"
              onClick={() =>
                setShowUpdateUserProfileModal((prev: any) => !prev)
              }
            >
              <i className="fa-solid fa-xmark text-[24px]"></i>
            </button>
          </div>
          <div className="w-full">
            <label htmlFor="user_image" className="">
              Change Photo :
            </label>
            <input
              type="file"
              accept="image/*"
              id="user_image"
              name="user_image"
              className="block w-full h-[45px] file:h-[35px] py-1 file:rounded-r-full file:px-4 file:bg-gradient-to-br file:from-[#343434] file:to-[#222222] file:outline-none file:border-none file:text-white file:text-[16px] text-md border-b-[3px] rounded-lg file:cursor-pointer text-green-400 outline-none bg-[#2B2B2B] border-[#3f3f3f] placeholder-gray-400"
            />
          </div>
          <input type="hidden" name="user_base64" value={image} />
          <div className="w-full">
            <label htmlFor="user_name" className="">
              Update Name :
            </label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              className="w-full min-h-[45px] border-b-[3px] border-[#3f3f3f] bg-[#2B2B2B] outline-none px-4 rounded-lg"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            />
          </div>
          <button
            type="submit"
            className="font-Poppins min-h-[45px] font-bold rounded-lg w-full bg-white active:bg-gray-200 text-black drop-shadow-md hover:bg-white/70 transition-all duration-200 hover:text-white/70"
          >
            {loading ? <LoadingSpinner /> : <p>Update Profile</p>}
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateUserProfileModal;
