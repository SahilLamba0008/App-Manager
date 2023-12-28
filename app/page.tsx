"use client";
import React, { useState } from "react";
import Signup from "../components/authentication/Signup";
import Login from "../components/authentication/Login";
import Image from "next/image";

const Page = () => {
  const [loginForm, setLoginForm] = useState<boolean>(false);

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between w-full h-full ">
        <div className="flex-1 h-full text-center">
          {/* Background Container */}
          <Image
            src={"/images/form-bg.png"}
            alt={"Background"}
            height={1600}
            width={2560}
            className="object-cover h-full w-full"
          />
        </div>
        {loginForm ? (
          <Login setLoginForm={setLoginForm} />
        ) : (
          <Signup setLoginForm={setLoginForm} />
        )}
      </div>
    </div>
  );
};

export default Page;
