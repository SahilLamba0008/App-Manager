"use client";
import React, { useRef, useState } from "react";
import ForgetPassword from "./ForgetPassword";
import { handleSignUpAction } from "@/lib/actions";
import { useFormState } from "react-dom";
import LoadingSpinner from "../LoadingSpinner";

const Signup = ({ setLoginForm }: any) => {
  //From Action State
  const initialFormErrorsState: FormDataErrors = {
    name: null,
    confirm_password: null,
    email: null,
    userExist: null,
  };

  const [state, formAction] = useFormState(
    handleSignUpAction,
    initialFormErrorsState
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [passwordType, setPasswordType] = useState<string>("password");
  const [confirmPasswordType, setConfirmPasswordType] =
    useState<string>("password");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const signupForm = useRef<HTMLFormElement>(null);

  // Function to Hide/Un-hide password
  const handlePasswordClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const targetId = event.currentTarget.id;
    if (targetId === "password-btn") {
      setShowPassword((prevState) => !prevState);
      setPasswordType(`${passwordType === "password" ? "text" : "password"}`);
    } else {
      setShowConfirmPassword((prevState) => !prevState);
      setConfirmPasswordType(
        `${confirmPasswordType === "password" ? "text" : "password"}`
      );
    }
  };

  // Function to change the from type [Login / Sign-up]
  const handleFormChange = () => {
    setLoginForm((prevState: boolean) => !prevState);
  };

  return (
    <div className="form flex-1">
      <h1 className="font-bold font-Poppins text-[40px] w-fit mx-auto mb-8">
        Sign up
      </h1>
      <form
        action={async (formData) => {
          setLoading((prev) => !prev);
          await formAction(formData);
          if (signupForm.current) {
            signupForm.current.reset();
          }
          setLoading((prev) => !prev);
        }}
        className="w-[65%] min-w-[300px] mx-auto px-4 flex flex-col gap-6"
      >
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Full Name"
          className="w-full min-h-[45px] border-b-[1px] bg-[#2B2B2B] outline-none px-4 rounded-lg"
          required
        />
        <div className="-mt-4 flex justify-between text-[16px]">
          <p className="text-red-400">{state.name}</p>
        </div>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email Address"
          className="w-full min-h-[45px] border-b-[1px] bg-[#2B2B2B] outline-none px-4 rounded-lg"
          required
        />
        <div className="-mt-4 flex justify-between text-[16px]">
          <p className="text-red-400">{state.email}</p>
        </div>
        <div className="w-full relative">
          <input
            type={passwordType}
            name="password"
            id="password"
            placeholder="Password"
            className="w-full min-h-[45px] border-b-[1px] bg-[#2B2B2B] outline-none px-4 rounded-lg"
            required
          />
          <button
            type="button"
            className="absolute right-3 translate-y-2/4 w-6"
            id="password-btn"
            onClick={handlePasswordClick}
          >
            <i
              className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
            ></i>
          </button>
        </div>
        <div className="w-full relative">
          <input
            type={confirmPasswordType}
            name="confirm-password"
            id="confirm-password"
            placeholder="Confirm Password"
            className="w-full min-h-[45px] border-b-[1px] bg-[#2B2B2B] outline-none px-4 rounded-lg"
            required
          />
          <button
            type="button"
            className="absolute right-3 translate-y-2/4 w-6"
            id="confirm-password-btn"
            onClick={handlePasswordClick}
          >
            <i
              className={`fa-solid ${
                showConfirmPassword ? "fa-eye-slash" : "fa-eye"
              }`}
            ></i>
          </button>
        </div>
        <div className="-mt-4 flex justify-between text-[16px]">
          <p className="text-red-400">{state.confirm_password}</p>
        </div>
        <div className="-mt-4 flex justify-between text-[16px]">
          <p className="text-red-400">{state.userExist}</p>
        </div>
        <ForgetPassword />
        <button
          type="submit"
          className="font-Poppins min-h-[45px] font-bold rounded-lg w-full bg-white active:bg-gray-200 text-black drop-shadow-md"
        >
          {loading ? <LoadingSpinner /> : <p>Sign up</p>}
        </button>
      </form>
      <div className="w-fit mx-auto text-[#5F5F5F] font-Poppins mt-10">
        Already have account ?
        <button onClick={handleFormChange}>
          <span className="font-Poppins font-bold ml-2 text-white">Log in</span>
        </button>
      </div>
    </div>
  );
};

export default Signup;
