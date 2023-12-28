"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingSpinner, { LoadingSkeleton } from "./LoadingSpinner";
import UpdateUserProfileModal from "./modals/UpdateUserProfileModal";

const Navbar = ({ user }: any) => {
  const pathName = usePathname();
  const [selectedTab, setSelectedTab] = useState<string>(pathName);
  const [loadingSignOut, setLoadingSignOut] = useState<boolean>(false);
  const [loadingName, setLoadingName] = useState<boolean>(true);
  const [openMenu, setOpenMenu] = useState(false);
  const [showUpdateUserProfileModal, setShowUpdateUserProfileModal] =
    useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setLoadingName(false);
  }, []);

  const handleSignOut = async () => {
    setSelectedTab("signOut");
    setLoadingSignOut((prev) => !prev);
    try {
      const response = await axios.get("/api/signout");
      // console.log(response.data);
      router.push("/");
      setLoadingSignOut((prev) => !prev);
    } catch (error) {
      toast.error("Failed to sign out user");
      // console.log(error);
      setLoadingSignOut((prev) => !prev);
    }
  };

  let currentDate = new Date().toJSON().slice(0, 10);

  return (
    <div className="w-full h-full flex justify-between items-center min-w-[190px] px-6 py-2 relative">
      <div>
        <button onClick={() => setOpenMenu(!openMenu)}>
          <i
            className={`fa-solid ${
              openMenu ? "fa-xmark" : "fa-bars"
            } text-[24px]`}
          ></i>
        </button>
      </div>
      <div
        className={`w-full ${
          openMenu ? "block" : "hidden"
        } bg-[#212121] border-2 border-[#a0a0a0] rounded-2xl drop-shadow-2xl absolute top-0 left-0 translate-y-[30%] z-10 overflow-hidden`}
      >
        <ul className="flex flex-col text-[18px] gap-2 font-bold w-full text-left whitespace-nowrap">
          <Link href={"/dashboard"}>
            <li
              className={`min-h-[30px] pl-6 py-2 text-[#5c5c5c] cursor-pointer bg-[#323232]/0 border-r-4 border-green-500/0 ${
                selectedTab === "/dashboard"
                  ? "bg-[#323232]/100 text-white border-green-500/100"
                  : ""
              } transition-all ease-in-out duration-600`}
              onClick={() => setSelectedTab("/dashboard")}
            >
              <span className="w-[40px] inline-block">
                <i className="fa-solid fa-house w-[15px] mr-1"></i>
              </span>
              All Tasks
            </li>
          </Link>
          <Link href={"/dashboard/important"}>
            <li
              className={`min-h-[30px] pl-6 py-2 text-[#5c5c5c] cursor-pointer bg-[#323232]/0 border-r-4 border-green-500/0 ${
                selectedTab === "/dashboard/important"
                  ? "bg-[#323232]/100 text-white border-green-500/100"
                  : ""
              } transition-all ease-in-out duration-600`}
              onClick={() => setSelectedTab("/dashboard/important")}
            >
              <span className="w-[40px] inline-block">
                <i className="fa-solid fa-list w-[20px] mr-1"></i>
              </span>
              Important
            </li>
          </Link>
          <Link href={"/dashboard/completed"}>
            <li
              className={`min-h-[30px] pl-6 py-2 text-[#5c5c5c] cursor-pointer bg-[#323232]/0 border-r-4 border-green-500/0  ${
                selectedTab === "/dashboard/completed"
                  ? "bg-[#323232]/100 text-white border-green-500/100"
                  : ""
              } transition-all ease-in-out duration-600`}
              onClick={() => setSelectedTab("/dashboard/completed")}
            >
              <span className="w-[40px] inline-block">
                <i className="fa-solid fa-check w-[20px] mr-1"></i>
              </span>
              Completed
            </li>
          </Link>
          <Link href={"/dashboard/doitnow"}>
            <li
              className={`min-h-[30px] pl-6 py-2 text-[#5c5c5c] cursor-pointer bg-[#323232]/0 border-r-4 border-green-500/0  ${
                selectedTab === "/dashboard/doitnow"
                  ? "bg-[#323232]/100 text-white border-green-500/100"
                  : ""
              } transition-all ease-in-out duration-600`}
              onClick={() => setSelectedTab("/dashboard/doitnow")}
            >
              <span className="w-[40px] inline-block">
                <i className="fa-solid fa-clipboard w-[20px] mr-1"></i>
              </span>
              Do it Now
            </li>
          </Link>
          <li
            className={`relavtive min-h-[30px] pl-6 py-2 text-[#5c5c5c] cursor-pointer border-r-4 border-green-500/0 active:text-green-500 active:bg-[#323232]/100  transition-all ease-in-out duration-900 ${
              selectedTab === "signOut"
                ? "bg-[#323232]/100 text-white border-green-500/100"
                : ""
            } `}
            onClick={handleSignOut}
          >
            {loadingSignOut ? (
              <LoadingSpinner />
            ) : (
              <div>
                <span className="w-[40px] inline-block">
                  <i className="fa-solid fa-arrow-right-from-bracket w-[20px] mr-1"></i>
                </span>
                <p className="inline">Sign Out</p>
              </div>
            )}
          </li>
        </ul>
      </div>
      <div className="flex flex-row-reverse items-center gap-2">
        <div className="h-[40px] w-[40px] shrink-0 relative rounded-[10%] overflow-hidden">
          {loadingName ? (
            <LoadingSkeleton />
          ) : (
            <Image
              src={user?.image === "" ? "/images/no_user.png" : user?.image}
              alt="profile"
              height={100}
              width={100}
              className="object-cover w-full h-full cursor-pointer"
              onClick={() => setShowUpdateUserProfileModal((prev) => !prev)}
            />
          )}
        </div>
        <div>
          {loadingName ? (
            <div className="w-[90px] h-[20px] mb-2">
              <LoadingSkeleton />
            </div>
          ) : (
            <h1 className="font-bold text-[20px]">{user?.name}</h1>
          )}
          <p className="text-[12px] text-right -mt-1 text-gray-400">
            {currentDate}
          </p>
        </div>
      </div>
      {showUpdateUserProfileModal && (
        <UpdateUserProfileModal
          Name={user?.name}
          UserImage={user?.image}
          setShowUpdateUserProfileModal={setShowUpdateUserProfileModal}
          md={true}
        />
      )}
    </div>
  );
};

export default Navbar;
