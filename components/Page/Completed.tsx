"use client";
import React, { useEffect, useState } from "react";
import TasksContainer from "@/components/TasksContainer";

export default function Completed({ taskList }: any) {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <>
      <TasksContainer
        title={"Completed Tasks"}
        taskList={taskList}
        loading={loading}
      />
    </>
  );
}
