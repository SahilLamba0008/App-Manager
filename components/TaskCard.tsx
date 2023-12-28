"use client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import DeleteWarningModal from "./modals/DeleteWarningModal";
import TaskUpdateModal from "./modals/TaskUpdateModal";
import { revalidate } from "@/lib/actions";

const TaskCard = ({ id, title, description, status, important, date }: any) => {
  const [showDeleteWarningModal, setShowDeleteWarningModal] =
    useState<boolean>(false);
  const [showTaskUpdateModal, setShowTaskUpdateModal] =
    useState<boolean>(false);
  const pathName = usePathname();

  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const handleTaskDelete = async () => {
    // console.log("task deleting with name : ", title, id, pathName);
    try {
      let response;
      const params = new URLSearchParams({ id });
      // console.log("Entered Try Block of delete");
      if (pathName === "/dashboard") {
        response = await fetch(`/api/taskslist?id=${id}`, {
          method: "DELETE",
          cache: "no-store",
        });
      } else if (pathName === "/dashboard/important") {
        response = await fetch(`/api/taskslist/important?id=${id}`, {
          method: "PATCH",
          cache: "no-store",
        });
      } else if (pathName === "/dashboard/doitnow") {
        response = await fetch(`/api/taskslist/doitnow?id=${id}`, {
          method: "PATCH",
          cache: "no-store",
        });
      } else if (pathName === "/dashboard/completed") {
        response = await fetch(`/api/taskslist/completed?id=${id}`, {
          method: "DELETE",
          cache: "no-store",
        });
      }

      const data = await response?.json();
      // console.log("Delete request data :", data);
      // window.location.reload();
      toast.success("Task deleted successfully");
      revalidate(pathName);
    } catch (error) {
      // console.log(error);
      toast.error("Failed to delete task");
    }
  };

  const handleDeleteWarning = () => {
    // console.log("handleDeleteWarning");
    setShowDeleteWarningModal(!showDeleteWarningModal);
  };

  return (
    <div className="overflow-hidden rounded-2xl">
      {/* Only to hide the scrollbar overflow on dashboard */}
      <div className="w-full  bg-[#323232] border-[#404040] border-2 rounded-2xl px-3 py-4 flex flex-col gap-1 hover:bg-[#1a1a1a] transition-all ease-in-out duration-200 custom-scrollbar overflow-scroll">
        <div className="text-[22px] font-bold overflow-hidden text-ellipsis whitespace-nowrap border-b-2 border-[#404040]">
          {title}
        </div>
        <div className="text-[14px] h-[40px] line-clamp-2 overflow-hidden">
          {description}
        </div>
        <div className="flex justify-between flex-wrap gap-2 text-gray-500 px-1 text-[14px]">
          <div>{formattedDate}</div>
          <div>{formattedTime}</div>
        </div>
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div
            className={`font-bold ${
              status
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            } w-fit px-3 py-1 rounded-full cursor-pointer  transition-all ease-in-out duration-200`}
          >
            {status ? "Completed" : "Pending"}
          </div>
          <div className="flex gap-3 text-[#babaca] font-bold bg-black/50 hover:bg-black/80 w-fit px-3 py-1 rounded-full cursor-pointer  transition-all ease-in-out duration-200">
            <button
              className="hover:text-yellow-500 active:text-yellow-800 transition-all ease-in-out duration-200"
              onClick={() => setShowTaskUpdateModal((prev) => !prev)}
            >
              <i className="fa-solid fa-note-sticky"></i>
            </button>
            <button
              className="hover:text-red-500 active:text-red-800 transition-all ease-in-out duration-200 "
              onClick={
                pathName === "/dashboard/completed"
                  ? handleDeleteWarning
                  : handleTaskDelete
              }
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
      {showTaskUpdateModal && (
        <>
          <div
            className="modal-wrapper absolute z-2 backdrop-blur-sm blur-sm bg-[#000000a7] top-0 left-0 bottom-0 right-0 rounded-2xl overflow-hidden"
            onClick={() => setShowTaskUpdateModal(false)}
          ></div>
          <TaskUpdateModal
            setShowTaskUpdateModal={setShowTaskUpdateModal}
            title={title}
            description={description}
            status={status}
            important={important}
            taskId={id}
          />
        </>
      )}
      {showDeleteWarningModal && (
        <>
          <div
            className="modal-wrapper absolute z-2 backdrop-blur-sm blur-sm bg-[#000000a7] top-0 left-0 bottom-0 right-0 rounded-2xl overflow-hidden"
            onClick={() => setShowDeleteWarningModal(false)}
          ></div>
          <DeleteWarningModal
            setShowDeleteWarningModal={setShowDeleteWarningModal}
            taskId={id}
          />
        </>
      )}
    </div>
  );
};

export default TaskCard;
