"use client";
import React, { useEffect, useState } from "react";
import TasksContainer from "../TasksContainer";
const DoItNow = ({ taskList }: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <>
      <TasksContainer
        title={"Pending Tasks"}
        taskList={taskList}
        loading={loading}
      />
    </>
  );
};

export default DoItNow;
