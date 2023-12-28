"use client";
import { revalidate } from "@/lib/actions";
import axios from "axios";
import { usePathname } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

const DeleteWarningModal = ({ setShowDeleteWarningModal, taskId }: any) => {
  const pathName = usePathname();

  const deleteCompletedTask = async () => {
    try {
      const response = await fetch(`/api/taskslist/completed?id=${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Task deleted successfully");
      } else {
        toast.error("Failed to delete task");
      }
      revalidate(pathName);
      setShowDeleteWarningModal((prev: boolean) => !prev);
    } catch (error) {
      toast.error("Failed to delete task");
      // console.log("Error deleting task", error);
      setShowDeleteWarningModal((prev: boolean) => !prev);
    }
  };

  const makePendingCompletedTask = async () => {
    try {
      // console.log("makePendingCompletedTask", taskId);
      const response = await fetch(`/api/taskslist/completed?id=${taskId}`, {
        method: "PATCH",
      });

      if (response.ok) {
        toast.success("Task updated successfully");
      } else {
        toast.error("Failed to update task");
      }
      revalidate(pathName);
      setShowDeleteWarningModal((prev: boolean) => !prev);
    } catch (error) {
      toast.error("Failed to update task");
      // console.log("Error updating task", error);
      setShowDeleteWarningModal((prev: boolean) => !prev);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col w-[450px] bg-[#181818] rounded-xl border-2 border-[#323232] absolute top-[50%] left-[50%] pt-8 pb-4 -translate-x-2/4 -translate-y-2/4">
      <p className="text-[20px] font-bold">
        Are you sure you want to delete this?
      </p>
      <button
        className="flex items-center justify-center h-[30px] w-[30px] rounded-full border-2 border-[#323232] text-[#5c5c5c] hover:text-[#b3b3b3] hover:border-[#9a9a9a] absolute top-2 right-2 text-[20px] font-bold"
        onClick={() => setShowDeleteWarningModal((prev: any) => !prev)}
      >
        <i className="fa-solid fa-xmark"></i>
      </button>
      <div className="flex items-center justify-center gap-4 my-4">
        <button
          className="px-4 bg-green-500 active:bg-green-600 border-b-4 border-green-900 py-1 rounded-lg text-center cursor-pointer transition-all duration-450 ease-in-out"
          onClick={deleteCompletedTask}
        >
          Yes
        </button>
        <button
          className="px-4 bg-red-500 border-b-4 active:bg-red-600 border-red-900 py-1 rounded-lg text-center cursor-pointer transition-all duration-450 ease-in-out"
          onClick={() => setShowDeleteWarningModal((prev: any) => !prev)}
        >
          No
        </button>
        <button
          className="px-4  bg-gradient-to-r from-blue-500 via-green-500 to-indigo-400 border-b-4 active:bg-gradient-to-br border-green-900 py-1 rounded-lg text-center cursor-pointer transition-all duration-500 ease-in-out white-space-nowrap font-bold"
          onClick={makePendingCompletedTask}
        >
          Make it Pending !
        </button>
      </div>
    </div>
  );
};

export default DeleteWarningModal;
