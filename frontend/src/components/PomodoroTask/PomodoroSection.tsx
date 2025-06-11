import { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Activity,
  Clock,
  Target,
} from "lucide-react";
import styled from "styled-components";
import {
  PomodoroTimer,
  usePomodoroTaskStore,
} from "../../services/pomodoroTaskStore";
import useStore from "../../services/store";
import { useTranslation } from "react-i18next";

// Styled Components
const PomodoroContainer = styled.div`
  width: 40vw;
  height: 100vh;
  padding: 1.25rem;
  background: var(--background-color);
  box-shadow:
    inset 7px 7px 13px color-mix(in srgb, var(--background-color) 89%, #000000),
    inset -7px -7px 13px color-mix(in srgb, var(--background-color) 97.5%, #fff);
  border-radius: 0 13px 13px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  position: relative;
`;

const PomodoroHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--color);
  }
`;

const SettingsButton = styled.button`
  background: transparent;
  border: none;
  color: var(--color);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  box-shadow:
    3px 3px 5px color-mix(in srgb, var(--background-color) 89%, #000000),
    -3px -3px 5px color-mix(in srgb, var(--background-color) 97.5%, #fff);
  transition: all 0.2s;

  &:hover {
    box-shadow:
      inset 3px 3px 5px color-mix(in srgb, var(--background-color) 89%, #000000),
      inset -3px -3px 5px
        color-mix(in srgb, var(--background-color) 97.5%, #fff);
  }
`;

const PomodoroSettings = styled.div`
  background: var(--background-color);
  border-radius: 8px;
  padding: 0.96rem;
  box-shadow:
    inset 3px 3px 6px color-mix(in srgb, var(--background-color) 89%, #000000),
    inset -3px -3px 6px color-mix(in srgb, var(--background-color) 97.5%, #fff);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
`;

const SettingGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  label {
    font-size: 0.9rem;
    color: var(--color);
    font-weight: 500;
  }

  input {
    width: 3.75rem;
    padding: 0.375rem 0.5rem;
    border: 1px solid color-mix(in srgb, var(--color) 30%, transparent);
    border-radius: 4px;
    background: transparent;
    color: var(--color);
    outline: none;
    text-align: center;
  }
`;

const SettingsButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.32rem;
`;

const SaveSettings = styled.button`
  background: var(--primary-color);
  color: var(--color);
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 500;
  flex: 1;
  transition: all 0.2s;
  font-size: 0.85rem;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px
      color-mix(in srgb, var(--primary-color) 50%, transparent);
  }
`;

const ResetCountButton = styled.button`
  background: var(--danger-color);
  color: var(--color);
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 500;
  flex: 1;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  font-size: 0.85rem;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px color-mix(in srgb, #e74c3c 50%, transparent);
  }
`;

const TimerDisplay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CircularTimer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TimerSvg = styled.svg`
  transform: rotate(-90deg);
  filter: drop-shadow(
    0 2px 4px color-mix(in srgb, var(--background-color) 80%, #000000)
  );
`;

const ProgressCircle = styled.circle`
  transition: stroke-dashoffset 1s linear;
`;

const TimerContent = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const TimeDisplay = styled.div`
  font-size: 40px;
  font-weight: bold;
  color: var(--color);
  margin-bottom: 0.32rem;
  text-shadow: 0 1px 2px
    color-mix(in srgb, var(--background-color) 90%, #000000);
`;

const SessionType = styled.div`
  margin-top: 0.5rem;
  font-size: 16px;
  color: color-mix(in srgb, var(--color) 70%, transparent);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
`;

const PomodoroControls = styled.div`
  display: flex;
  gap: 0.94rem;
  margin-top: 0.625rem;
`;

const ControlButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--background-color);
  border: none;
  color: var(--color);
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 50%;
  box-shadow:
    5px 5px 10px color-mix(in srgb, var(--background-color) 89%, #000000),
    -5px -5px 10px color-mix(in srgb, var(--background-color) 97.5%, #fff);
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.125rem;
  height: 3.125rem;

  &:hover {
    box-shadow:
      inset 5px 5px 10px
        color-mix(in srgb, var(--background-color) 89%, #000000),
      inset -5px -5px 10px
        color-mix(in srgb, var(--background-color) 97.5%, #fff);
  }

  &.primary {
    background: var(--primary-color);
    color: var(--color);
    box-shadow:
      2px 2px 5px color-mix(in srgb, var(--primary-color) 50%, #000000),
      -2px -2px 5px color-mix(in srgb, var(--primary-color) 80%, #fff);

    &:hover {
      box-shadow:
        inset 5px 5px 10px color-mix(in srgb, var(--primary-color) 70%, #000000),
        inset -5px -5px 10px color-mix(in srgb, var(--primary-color) 90%, #fff);
    }
  }
`;

const PomodoroStats = styled.div`
  text-align: center;
  color: var(--color);
  font-size: 0.9rem;
  margin-top: 0.625rem;

  p {
    margin: 0;
    padding: 0.5rem 1rem;
    background: var(--background-color);
    border-radius: 20px;
    box-shadow:
      inset 3px 3px 6px color-mix(in srgb, var(--background-color) 89%, #000000),
      inset -3px -3px 6px
        color-mix(in srgb, var(--background-color) 97.5%, #fff);
  }
`;

const StatusBar = styled.div`
  position: absolute;
  bottom: 2.5rem;
  left: 0;
  right: 0;
  height: 1.5rem;
  background: var(--background-color);
  border-radius: 0 0 13px 0;
  box-shadow:
    inset 2px 2px 4px color-mix(in srgb, var(--background-color) 92%, #000000),
    inset -2px -2px 4px color-mix(in srgb, var(--background-color) 98%, #fff);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.75rem;
  font-size: 0.75rem;
  color: color-mix(in srgb, var(--color) 75%, transparent);
  border-top: 1px solid color-mix(in srgb, var(--color) 15%, transparent);
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.15rem;

  svg {
    width: 0.55rem;
    height: 0.55rem;
  }
`;

const SessionIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 500;
`;

const SessionDot = styled.div`
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background: ${(props) => props.color || "#e0e0e0"};
  box-shadow: 0 0 4px ${(props) => props.color || "#e0e0e0"}40;
`;

const PomodoroSection = () => {
  const { t } = useTranslation();

  const {
    pomodoroSettings,
    pomodoroState,
    setPomodoroSettings,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    resetCompletedPomodoros,
  } = usePomodoroTaskStore();

  const [showSettings, setShowSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState(pomodoroSettings);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = PomodoroTimer.getInstance();
    timer.setStore(usePomodoroTaskStore, useStore);
    timer.initAudio2();
    timer.syncTime();

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

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

  const handleResetCount = () => {
    if (window.confirm(t("confirmResetCount"))) {
      resetCompletedPomodoros();
    }
  };

  const getNextSession = () => {
    if (pomodoroState.currentSession === "work") {
      const nextPomodoroCount = pomodoroState.completedPomodoros + 1;
      return nextPomodoroCount % pomodoroSettings.longBreakInterval === 0
        ? t("longBreak")
        : t("break");
    }
    return t("work");
  };

  const getTotalWorkTime = () => {
    return pomodoroState.completedPomodoros * pomodoroSettings.workTime;
  };

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset =
    circumference - (getProgress() / 100) * circumference;

  return (
    <PomodoroContainer>
      <PomodoroHeader>
        <h2>{t("pomodoroTimer")}</h2>
        <SettingsButton onClick={() => setShowSettings(!showSettings)}>
          <Settings size={16} />
        </SettingsButton>
      </PomodoroHeader>

      {showSettings && (
        <PomodoroSettings>
          <SettingGroup>
            <label>{t("workTime")}:</label>
            <input
              value={tempSettings.workTime}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  workTime: Number(e.target.value),
                })
              }
            />
          </SettingGroup>
          <SettingGroup>
            <label>{t("breakTime")}:</label>
            <input
              value={tempSettings.breakTime}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  breakTime: Number(e.target.value),
                })
              }
            />
          </SettingGroup>
          <SettingGroup>
            <label>{t("longBreakTime")}:</label>
            <input
              value={tempSettings.longBreakTime}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  longBreakTime: Number(e.target.value),
                })
              }
            />
          </SettingGroup>
          <SettingGroup>
            <label>{t("longBreakInterval")}:</label>
            <input
              value={tempSettings.longBreakInterval}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  longBreakInterval: Number(e.target.value),
                })
              }
            />
          </SettingGroup>
          <SettingsButtonGroup>
            <SaveSettings onClick={handleSaveSettings}>
              {t("saveSettings")}
            </SaveSettings>
            <ResetCountButton onClick={handleResetCount}>
              {t("resetCount")}
            </ResetCountButton>
          </SettingsButtonGroup>
        </PomodoroSettings>
      )}

      <TimerDisplay>
        <CircularTimer>
          <TimerSvg width="200" height="200">
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="color-mix(in srgb, var(--color) 20%, transparent)"
              strokeWidth="8"
              fill="none"
            />
            <ProgressCircle
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
            />
          </TimerSvg>
          <TimerContent>
            <TimeDisplay>{formatTime(pomodoroState.timeLeft)}</TimeDisplay>
            <SessionType>
              {pomodoroState.currentSession === "work"
                ? t("work")
                : pomodoroState.currentSession === "break"
                  ? t("break")
                  : t("longBreak")}
            </SessionType>
          </TimerContent>
        </CircularTimer>
      </TimerDisplay>

      <PomodoroControls>
        <ControlButton
          onClick={pomodoroState.isRunning ? pausePomodoro : startPomodoro}
          className="primary"
        >
          {pomodoroState.isRunning ? <Pause size={20} /> : <Play size={20} />}
        </ControlButton>
        <ControlButton onClick={resetPomodoro}>
          <RotateCcw size={20} />
        </ControlButton>
      </PomodoroControls>

      <PomodoroStats>
        <p>
          {t("completedPomodoros")}: {pomodoroState.completedPomodoros}
        </p>
      </PomodoroStats>

      <StatusBar>
        <StatusItem>
          <Clock />
          {currentTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </StatusItem>

        <SessionIndicator>
          <StatusItem>
            <Activity />
            {pomodoroState.isRunning ? t("running") : t("paused")}
          </StatusItem>
          <SessionDot color={getSessionColor()} />
        </SessionIndicator>

        <StatusItem>
          <Target />
          {t("next")}: {getNextSession()}
        </StatusItem>

        <StatusItem>
          {t("workTimeLabel")}: {getTotalWorkTime()}m
        </StatusItem>
      </StatusBar>
    </PomodoroContainer>
  );
};

export default PomodoroSection;
