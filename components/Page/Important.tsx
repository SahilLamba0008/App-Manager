"use client";
import React, { useEffect, useState } from "react";
import TasksContainer from "../TasksContainer";
const Important = ({ taskList }: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <>
      <TasksContainer
        title={"Important Tasks"}
        taskList={taskList}
        loading={loading}
      />
    </>
  );
};

export default Important;
