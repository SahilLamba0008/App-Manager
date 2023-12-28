import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const emailIsValid = (email: FormDataEntryValue | null) => {
  const tempEmail = email?.toString().trim();
  const regexEmail =
    /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;

  if (tempEmail !== undefined) return regexEmail.test(tempEmail);
};
export const fullNameIsValid = (name: FormDataEntryValue | null) => {
  const tempName = name?.toString();
  const regexName = /[0-9@#$%^&*()\-_]+/;
  const regexSpaces = /^\s+$/;

  if (tempName !== undefined)
    return !regexName.test(tempName) && !regexSpaces.test(tempName);
};

export const hashPassword = async (password: FormDataEntryValue | null) => {
  const tempPassword = password?.toString();

  let hashedPassword;
  if (tempPassword) {
    hashedPassword = await bcrypt.hash(tempPassword, 10);
  }

  return hashedPassword;
};
export const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: "3d",
  });
};

export const extractTokenPayload = async (token: string) => {
  const { value }: any = cookies().get("userToken");
  const { id } = (await jwt.verify(value, process.env.JWT_SECRET!)) as any;
  return id;
};
