"use client";
import React, { useEffect, useRef, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import { usePathname, useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { handleUpdateTaskAction, revalidate } from "@/lib/actions";

const TaskUpdateModal = ({
  setShowTaskUpdateModal,
  title,
  description,
  status,
  important,
  taskId,
}: any) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const pathName = usePathname();
  // console.log("updatetask modal pathName : ", pathName);

  const [titleValue, setTitleValue] = useState<string>(title);
  const [descriptionValue, setDescriptionValue] = useState<string>(description);
  const [statusValue, setStatusValue] = useState<boolean>(status);
  const [importantValue, setImportantValue] = useState<boolean>(important);
  const updateTaskForm = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (statusValue === false) {
      setSelectedOption("Pending");
    } else {
      setSelectedOption("Completed");
    }
  }, [statusValue]);

  const initialStateErrors: UpdateTaskFormErrors = {
    title: null,
    description: null,
  };
  const [state, formAction] = useFormState(
    handleUpdateTaskAction,
    initialStateErrors
  );

  const handleOptionChange = (event: any) => {
    const value = event.target.value;
    // console.log(value);
    setSelectedOption(value);
  };

  return (
    <div>
      <div className="bg-[#181818] rounded-xl border-2 border-[#323232] absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4">
        <div className="flex justify-between items-center px-4 pt-4">
          <div className="flex flex-col justify-between text-[18px] font-bold decoration-">
            <h1 className="whitespace-nowrap">Update tasks details</h1>
            <div className="w-[50%] h-[4px] bg-gradient-to-r from-green-700 via-green-500 to-blue-700 rounded-[16px]"></div>
          </div>
          <button
            className="flex items-center justify-center h-[40px] w-[40px] rounded-full border-2 border-[#323232] text-[#5c5c5c] hover:text-[#b3b3b3] hover:border-[#9a9a9a]"
            onClick={() => setShowTaskUpdateModal((prev: boolean) => !prev)}
          >
            <i className="fa-solid fa-xmark text-[24px]"></i>
          </button>
        </div>
        <form
          className="p-6 w-[65%] min-w-[300px] mx-auto flex flex-col gap-6"
          action={async (formData) => {
            setLoading((prev) => !prev);
            await formAction(formData);
            if (updateTaskForm.current) {
              updateTaskForm.current.reset();
            }
            setLoading((prev) => !prev);
            revalidate(pathName);
            setTimeout(() => {
              setShowTaskUpdateModal((prev: boolean) => !prev);
            }, 500);
          }}
        >
          {/* Hidden Input for TaskId : helps updating the task using form server actions */}
          <input type="text" name="taskId" hidden value={taskId} />{" "}
          <input
            type="text"
            name="task_title"
            id="task_title"
            placeholder="Task Title"
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
            className="w-full min-h-[45px] border-b-[3px] border-[#3f3f3f] bg-[#2B2B2B] outline-none px-4 rounded-lg"
            required
          />
          <div className="-mt-4 -mb-4 flex justify-between text-[12px]">
            <p className="text-red-400">{state?.title && state.title}</p>
          </div>
          <textarea
            name="task_description"
            id="task_description"
            placeholder="Enter task description . . ."
            value={descriptionValue}
            onChange={(e) => setDescriptionValue(e.target.value)}
            className="w-full min-h-[145px] border-b-[3px] border-[#3f3f3f] bg-[#2B2B2B] outline-none px-4 pt-1 rounded-lg resize-none"
            required
          />
          <div className="-mt-4 -mb-4 flex justify-between text-[12px]">
            <p className="text-red-400">
              {state?.description && state.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <label
                htmlFor="task_status_false"
                className={`${
                  selectedOption === "Pending"
                    ? "bg-red-500 border-b-4 border-red-900"
                    : "bg-gray-500 border-b-4 border-gray-900"
                } py-1 rounded-lg px-2 text-center cursor-pointer transition-all duration-450 ease-in-out`}
              >
                Pending
              </label>
              <input
                type="radio"
                name="task_status"
                id="task_status_false"
                value="Pending"
                className="hidden"
                checked={selectedOption === "Pending"}
                onChange={handleOptionChange}
              />
            </div>
            <div>
              <label
                htmlFor="task_status_true"
                className={`${
                  selectedOption === "Completed"
                    ? "bg-green-500 border-b-4 border-green-900"
                    : "bg-gray-500 border-b-4 border-gray-900"
                } py-1 rounded-lg px-2 text-center cursor-pointer transition-all duration-450 ease-in-out`}
              >
                Completed
              </label>
              <input
                type="radio"
                name="task_status"
                id="task_status_true"
                value="Completed"
                className="hidden"
                checked={selectedOption === "Completed"}
                onChange={handleOptionChange}
              />
            </div>
          </div>
          <div className="flex gap-2 w-fit">
            <input
              type="checkbox"
              name="check_important"
              id="check_important"
              className="w-[25px] h-[25px] cursor-pointer shadow-md checked:shadow-blue-400"
              checked={importantValue ? true : false}
              onChange={() => setImportantValue((prev) => !prev)}
            />
            <label
              htmlFor="check_important"
              className="font-bold text-blue-500"
            >
              Mark as Important
            </label>
          </div>
          <button
            type="submit"
            className="font-Poppins min-h-[45px] font-bold rounded-lg w-full bg-white active:bg-gray-200 text-black drop-shadow-md hover:bg-white/70 transition-all duration-200 hover:text-white/70"
          >
            {loading ? <LoadingSpinner /> : <p>Update Task</p>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskUpdateModal;
