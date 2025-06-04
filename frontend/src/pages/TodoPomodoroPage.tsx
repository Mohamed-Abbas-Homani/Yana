import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import Page from "../components/UI/Page";
import "../components/PomodoroTask/TodoPomodoro.css";
import TodoSection from "../components/PomodoroTask/TodoSection";
import {
  PomodoroTimer,
  usePomodoroTaskStore,
} from "../services/pomodoroTaskStore";
import useStore from "../services/store";

const PomodoroSection: React.FC = () => {
  const {
    pomodoroSettings,
    pomodoroState,
    setPomodoroSettings,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
  } = usePomodoroTaskStore();

  const [showSettings, setShowSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState(pomodoroSettings);

  // Initialize timer and request notification permission
  useEffect(() => {
    const timer = PomodoroTimer.getInstance();
    timer.setStore(usePomodoroTaskStore, useStore);
    timer.initAudio();

    // Sync time when component mounts
    timer.syncTime();

    // Cleanup on unmount
    return () => {
      // Don't stop the timer when component unmounts
      // This allows it to continue running in the background
    };
  }, []);

  // Re-sync time when the component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const timer = PomodoroTimer.getInstance();
        timer.syncTime();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getSessionColor = () => {
    switch (pomodoroState.currentSession) {
      case "work":
        return "#e74c3c";
      case "break":
        return "#2ecc71";
      case "longBreak":
        return "#3498db";
      default:
        return "#e74c3c";
    }
  };

  const getProgress = () => {
    const totalTime = (() => {
      switch (pomodoroState.currentSession) {
        case "work":
          return pomodoroSettings.workTime * 60;
        case "break":
          return pomodoroSettings.breakTime * 60;
        case "longBreak":
          return pomodoroSettings.longBreakTime * 60;
        default:
          return pomodoroSettings.workTime * 60;
      }
    })();

    return ((totalTime - pomodoroState.timeLeft) / totalTime) * 100;
  };

  const handleSaveSettings = () => {
    setPomodoroSettings(tempSettings);
    setShowSettings(false);
    resetPomodoro();
  };

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset =
    circumference - (getProgress() / 100) * circumference;

  return (
    <div className="pomodoro-section">
      <div className="pomodoro-header">
        <h2>Pomodoro Timer</h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="settings-btn"
        >
          <Settings size={16} />
        </button>
      </div>

      {showSettings && (
        <div className="pomodoro-settings">
          <div className="setting-group">
            <label>Work Time (min):</label>
            <input
              type="number"
              value={tempSettings.workTime}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  workTime: Number(e.target.value),
                })
              }
            />
          </div>
          <div className="setting-group">
            <label>Break Time (min):</label>
            <input
              type="number"
              value={tempSettings.breakTime}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  breakTime: Number(e.target.value),
                })
              }
            />
          </div>
          <div className="setting-group">
            <label>Long Break (min):</label>
            <input
              type="number"
              value={tempSettings.longBreakTime}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  longBreakTime: Number(e.target.value),
                })
              }
            />
          </div>
          <div className="setting-group">
            <label>Long Break Interval:</label>
            <input
              type="number"
              value={tempSettings.longBreakInterval}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  longBreakInterval: Number(e.target.value),
                })
              }
            />
          </div>
          <button onClick={handleSaveSettings} className="save-settings">
            Save Settings
          </button>
        </div>
      )}

      <div className="timer-display">
        <div className="circular-timer">
          <svg width="200" height="200" className="timer-svg">
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="#e0e0e0"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke={getSessionColor()}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 100 100)"
              className="progress-circle"
            />
          </svg>
          <div className="timer-content">
            <div className="time-display">
              {formatTime(pomodoroState.timeLeft)}
            </div>
            <div className="session-type">
              {pomodoroState.currentSession === "work"
                ? "Work"
                : pomodoroState.currentSession === "break"
                  ? "Break"
                  : "Long Break"}
            </div>
          </div>
        </div>
      </div>

      <div className="pomodoro-controls">
        <button
          onClick={pomodoroState.isRunning ? pausePomodoro : startPomodoro}
          className="control-btn primary"
        >
          {pomodoroState.isRunning ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button onClick={resetPomodoro} className="control-btn">
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="pomodoro-stats">
        <p>Completed Pomodoros: {pomodoroState.completedPomodoros}</p>
      </div>
    </div>
  );
};

const TodoPomodoroPage: React.FC = () => {
  const { addTodoList, todoLists, pomodoroState } = usePomodoroTaskStore();
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

export default TodoPomodoroPage;
