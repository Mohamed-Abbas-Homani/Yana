import React, { useEffect } from "react";
import Page from "../components/UI/Page";
import "../components/PomodoroTask/TodoPomodoro.css";
import TodoSection from "../components/PomodoroTask/TodoSection";
import { usePomodoroTaskStore } from "../services/pomodoroTaskStore";
import useStore from "../services/store";
import PomodoroSection from "../components/PomodoroTask/PomodoroSection";

const PomodoroTaskPage: React.FC = () => {
  const { addTodoList, todoLists } = usePomodoroTaskStore();
  const { setUserAction, setLastPage } = useStore();
  useEffect(() => {
    // Initialize with a default list if none exists
    if (todoLists.length === 0) {
      addTodoList("My Tasks");
    }
  }, [addTodoList, todoLists.length]);

  useEffect(() => {
    setLastPage(location.pathname);
    setUserAction("neutral");
  }, []);

  return (
    <Page>
      <div className="todo-pomodoro-container">
        <TodoSection />
        <PomodoroSection />
      </div>
    </Page>
  );
};

export default PomodoroTaskPage;
