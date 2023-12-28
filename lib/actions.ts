"use server";
import user from "@/models/user";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import dbConnect from "./dbconnect";
import {
  emailIsValid,
  extractTokenPayload,
  fullNameIsValid,
  generateToken,
  hashPassword,
} from "@/utils/functions";
import userTasks from "@/models/userTasks";
import { revalidatePath } from "next/cache";

dbConnect();
// console.log(global.mongoConnection);

/*------- Sign Up user Action -------*/
export const handleSignUpAction = async (
  prevState: any,
  formData: FormData
): Promise<FormDataErrors> => {
  // await dbConnect();
  const rawFormData = {
    Name: formData.get("name"),
    Email: formData.get("email"),
    Password: formData.get("password"),
    Confirm_Password: formData.get("confirm-password"),
  };

  const { Name, Email, Password, Confirm_Password } = rawFormData;
  const errors: Partial<FormDataErrors> = {};

  /*------- User Input Validation -------*/
  if (!fullNameIsValid(Name)) {
    errors.name =
      "* Name should not be empty or contain special characters only";
  }

  if (!emailIsValid(Email)) {
    errors.email = "* Please enter a valid email address eg. test123@gmail.com";
  }

  if (Password !== Confirm_Password) {
    errors.confirm_password =
      "* Passwords do not match. Please re-enter them correctly";
  }

  const userExist = await user.findOne({ email: Email });
  if (userExist) {
    errors.email = "* User with this email already exist";
  }

  /*------- if any error is there return it -------*/
  if (Object.keys(errors).length > 0) {
    return { ...prevState, ...errors };
  }

  const hashedPassword = await hashPassword(Password);

  const userData = {
    name: Name?.toString()
      .toLowerCase()
      .replace(/(?:^|\s)\S/g, (char: any) => char.toUpperCase()),
    email: Email?.toString().toLowerCase(),
    password: hashedPassword,
    image: "",
  };

  await user.create(userData);

  // console.log("Signup Successful", formData);
  // console.log("Validation Successful");

  const userObj = await user.findOne({ email: Email });
  const userToken = generateToken(userObj._id);

  const oneDay = 24 * 60 * 60 * 1000;
  cookies().set("userToken", userToken, { expires: Date.now() + oneDay });

  redirect("/dashboard");
  // return {};
};

/*------- Log In user Action -------*/
export const handleLogInAction = async (
  prevState: any,
  formData: FormData
): Promise<FormDataErrors> => {
  // await dbConnect();
  const errors: Partial<FormDataErrors> = {};

  const rawFormData = {
    Email: formData.get("email"),
    Password: formData.get("password"),
  };

  console.log(
    "Email: ",
    formData.get("email"),
    "  Password: ",
    formData.get("password")
  );
  
  const { Email, Password } = rawFormData;
  if (!emailIsValid(Email)) {
    errors.email = "* Please enter a valid email address eg. test123@gmail.com";
  }

  if (Object.keys(errors).length > 0) {
    return { ...prevState, ...errors };
  }
  try {
    var userExist = await user.findOne({ email: Email }); // declared var to access with in the block
    // console.log("Existing user object :", userExist);

    if (!userExist) {
      errors.email = null;
      errors.userExist = "* User with this email doesn't exist";
    } else {
      const storedPassword = userExist.password;

      const matchPassword = await bcrypt.compare(
        Password as string,
        storedPassword
      );

      if (!matchPassword) {
        errors.userExist = null;
        errors.wrongPassword = "* Password for this email is incorrect";
      }
    }
  } catch (error) {
    // console.log(error);
  }

  if (Object.keys(errors).length > 0) {
    return { ...prevState, ...errors };
  }

  const userId = userExist?._id;
  const userToken = generateToken(userId);

  const oneDay = 24 * 60 * 60 * 1000;
  cookies().set("userToken", userToken, { expires: Date.now() + oneDay });

  console.log("Login Successful");
  redirect("/dashboard");
};

/*------- Add User Tasks Action -------*/
export const handleAddTaskAction = async (
  prevState: any,
  formData: FormData
): Promise<AddTaskFormErrors> => {
  const errors: Partial<AddTaskFormErrors> = {};

  let rawFormData = {
    title: formData.get("task_title"),
    description: formData.get("task_description"),
    status: formData.get("task_status"),
    important: formData.get("check_important"),
  };

  let { title, description, status, important }: any = rawFormData;
  function capitalizeFirstLetter(string: any) {
    let words = string.trim().split(/\s+/);

    for (let i = 0; i < words.length; i++) {
      words[i] =
        words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }

    return words.join(" ");
  }

  title = capitalizeFirstLetter(rawFormData.title);

  if (title.length === 0) {
    errors.title = "* Title should not be empty";
  } else if (title.length > 100) {
    errors.title = "* Title should not exceed 100 characters";
  }

  if (description.length === 0) {
    errors.description = "* Description should not be empty";
  } else if (description.length > 500) {
    errors.description = "* Description should not exceed 500 characters";
  }

  const tokenValue = cookies().get("userToken");
  const { value }: any = tokenValue;

  const userId = await extractTokenPayload(value);
  // console.log(userId);

  if (Object.keys(errors).length > 0) {
    return { ...prevState, ...errors };
  }

  const taskData = {
    user_id: userId,
    taskTitle: title,
    taskDescription: description,
    taskStatus: status === "Completed",
    taskImportant: important ? true : false,
  };

  userTasks.create(taskData);
  revalidatePath("/dashboard", "page");
  // console.log(rawFromData, title, description);
  return {
    success: "Task added successfully",
  };
};

/*------- Update User Tasks Action -------*/
export const handleUpdateTaskAction = async (
  prevState: any,
  formData: FormData
): Promise<AddTaskFormErrors> => {
  const errors: Partial<AddTaskFormErrors> = {};

  let rawFormData = {
    taskId: formData.get("taskId"),
    title: formData.get("task_title"),
    description: formData.get("task_description"),
    status: formData.get("task_status"),
    important: formData.get("check_important"),
  };

  let { taskId, title, description, status, important }: any = rawFormData;
  function capitalizeFirstLetter(string: any) {
    let words = string.trim().split(/\s+/);

    for (let i = 0; i < words.length; i++) {
      words[i] =
        words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }

    return words.join(" ");
  }

  title = capitalizeFirstLetter(rawFormData.title);

  if (title.length === 0) {
    errors.title = "* Title should not be empty";
  } else if (title.length > 100) {
    errors.title = "* Title should not exceed 100 characters";
  }

  if (description.length === 0) {
    errors.description = "* Description should not be empty";
  } else if (description.length > 500) {
    errors.description = "* Description should not exceed 500 characters";
  }

  if (Object.keys(errors).length > 0) {
    return { ...prevState, ...errors };
  }

  const taskData = {
    taskTitle: title,
    taskDescription: description,
    taskStatus: status === "Completed",
    taskImportant: important ? true : false,
  };

  try {
    const taskObj = await userTasks.findOneAndUpdate(
      { _id: taskId },
      { $set: taskData },
      { new: true }
    );
    // console.log("Updated task:", taskObj);
  } catch (error) {
    // console.error("Error updating task:", error);
  }
  // console.log(rawFromData, title, description);
  return {};
};

export const handleUpdateUserProfileAction = async (
  prevState: any,
  formData: FormData
): Promise<UpdateUserProfileErrors> => {
  const errors: Partial<UpdateUserProfileErrors> = {};

  const rawFormData = {
    name: formData.get("user_name"),
    image: formData.get("user_image"),
    base64: formData.get("user_base64"),
  };

  const { name, image }: any = rawFormData;

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
  if (image.size > MAX_IMAGE_SIZE) {
    errors.imageError = "* Image size should not exceed 2MB";
  }

  if (name.length === 0 || name.length > 100) {
    errors.nameError =
      "* Name should not be empty and should not exceed 100 characters";
  }

  if (!fullNameIsValid(name)) {
    errors.nameError =
      "* Name should not be empty or contain special characters only";
  }

  if (Object.keys(errors).length > 0) {
    return { ...prevState, ...errors };
  }

  try {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "task-manager-app");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/davcwgys3/image/upload",
      {
        method: "post",
        body: data,
      }
    );

    const responseData = await response.json();
    const imageUrl = responseData.url;
    // console.log("Cloudinary Image URL inside:", imageUrl);

    const userData = {
      name: name
        ?.toString()
        .toLowerCase()
        .replace(/(?:^|\s)\S/g, (char: any) => char.toUpperCase()),
      image: imageUrl,
    };

    // console.log("UserData:", userData);

    const tokenValue = cookies().get("userToken");
    const { value }: any = tokenValue;

    const userId = await extractTokenPayload(value);
    console.log(userId);

    const userObj = await user.findOneAndUpdate(
      { _id: userId },
      { $set: userData },
      { new: true }
    );
    // console.log(userObj);
  } catch (error) {
    // console.error("Error:", error);
  }

  return {};
};

export async function revalidate(pathName: string) {
  // console.log("revalidate server action path ----> ", pathName);
  revalidatePath(pathName);
}
