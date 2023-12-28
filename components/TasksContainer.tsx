"use client";
import React, { useState } from "react";
import AddTaskModal from "./modals/AddTaskModal";
import TaskCard from "./TaskCard";
import { usePathname } from "next/navigation";
import { BigLoadingSpinner } from "./LoadingSpinner";

const TasksContainer = ({ title, taskList, loading }: any) => {
  const [showTaskModal, setShowTaskModal] = useState<boolean>(false);
  const pathName = usePathname();

  return (
    <div className="flex flex-col px-8 relative gap-6 h-full">
      <div className="flex justify-between py-4">
        <div className="flex flex-col justify-between text-[26px] font-bold">
          <h1 className="whitespace-nowrap">{title}</h1>
          <div className="w-[50%] h-[4px] bg-green-400 rounded-[16px] mb-2"></div>
        </div>
        <div>
          <button
            className="h-[50px] w-[50px] rounded-full border-2 border-[#323232]  text-[#5c5c5c] hover:text-[#b3b3b3] hover:border-[#9a9a9a]"
            onClick={() => setShowTaskModal((prev) => !prev)}
          >
            <i className="fa-solid fa-plus text-[28px] "></i>
          </button>
        </div>
        {showTaskModal && (
          <>
            <div
              className="modal-wrapper absolute z-2 backdrop-blur-sm blur-sm bg-[#000000a7] top-0 left-0 bottom-0 right-0 rounded-2xl overflow-hidden"
              onClick={() => setShowTaskModal(false)}
            ></div>
            <div className="absolute top-[50%] left-[50%] -translate-x-2/4 -translate-y-2/4 z-10">
              <AddTaskModal setShowTaskModal={setShowTaskModal} />
            </div>
          </>
        )}
      </div>

      <div className="h-full overflow-y-scroll custom-scrollbar pb-4">
        {loading ? (
          <BigLoadingSpinner />
        ) : (
          <div className="w-full grid grid-cols-4 gap-4 2xl:grid-cols-5 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
            {taskList.length > 0 ? (
              taskList.map((curElm: any, index: any) => {
                return (
                  <TaskCard
                    key={index}
                    id={curElm._id}
                    title={curElm.taskTitle}
                    description={curElm.taskDescription}
                    status={curElm.taskStatus}
                    important={curElm.taskImportant}
                    date={curElm.updatedAt}
                  />
                );
              })
            ) : (
              <p className="font-bold text-[35px] absolute top-2/4 left-2/4 translate-x-[-50%] translate-y-[-50%] animate-pulse bg-gradient-to-r from-blue-500 via-green-500 to-indigo-400 bg-clip-text text-transparent z-0">
                {`Add ${title} to get started ...`}
              </p>
            )}
            {pathName === "/dashboard" && (
              <div className="overflow-hidden rounded-2xl max-md:hidden">
                <div className="flex items-center justify-center h-full bg-[#323232] hover:bg-[#1a1a1a] border-dashed border-[#404040] border-2 rounded-2xl px-3 py-4 gap-1 transition-all ease-in-out duration-200 overflow-scroll custom-scrollbar">
                  <button
                    className="flex items-center gap-4 px-3 py-4 text-[#919191] hover:text-white transition-all ease-in-out duration-200"
                    onClick={() => setShowTaskModal((prev) => !prev)}
                  >
                    <i className="fa-solid fa-plus text-[28px] "></i>Add New
                    Task
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksContainer;
