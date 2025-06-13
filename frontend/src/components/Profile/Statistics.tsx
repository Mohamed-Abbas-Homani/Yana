import { useEffect, useState } from "react";
import FlexBetween from "../UI/FlexBetween";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Statistics.css";
import { getCSSVariable } from "../../utils/style";
import { useNoteStats } from "../../hooks/useNoteStats";
import { useTranslation } from "react-i18next";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const Statistics = () => {
  const { t } = useTranslation();

  const [profileColor, setProfileColor] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<string>("");

  const { createdNotes, moodNotes, loading, error } = useNoteStats();

  useEffect(() => {
    setProfileColor(getCSSVariable("--profile-color"));
    setBackgroundColor(getCSSVariable("--background-profile-color"));
  }, []);

  if (loading) {
    return <p>{t("Loading")}...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Fixed weekday order
  const orderedWeekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Map createdNotes into fixed weekday order, fill missing with 0
  const orderedCreatedNotes = orderedWeekdays.map(
    (day) => createdNotes[day] ?? 0,
  );

  const creationData = {
    labels: orderedWeekdays,
    datasets: [
      {
        label: t("Created Notes"),
        data: orderedCreatedNotes,
        fill: false,
        borderColor: profileColor,
        tension: 0.1,
      },
    ],
  };

  const moodData = {
    labels: Object.keys(moodNotes),
    datasets: [
      {
        label: t("Notes by Mood"),
        data: Object.values(moodNotes),
        fill: false,
        borderColor: profileColor,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: t("Notes Stats"),
        color: profileColor,
        font: {
          size: 18,
        },
      },
      tooltip: {
        backgroundColor: "#333",
        titleColor: profileColor,
        bodyColor: profileColor,
      },
    },
    scales: {
      x: {
        ticks: {
          color: profileColor,
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: profileColor,
        },
        grid: {
          display: false,
        },
      },
    },
    backgroundColor: backgroundColor,
  };

  return (
    <FlexBetween
      width="61.8vw"
      height="100vh"
      direction="column"
      padding="0.81rem"
      className="stats-container"
    >
      <h3 className="stats-header" style={{ color: profileColor }}>
        {t("Stats")}
      </h3>
      <div
        style={{
          width: "89%",
          height: "49%",
          backgroundColor: backgroundColor,
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <Line data={creationData} options={chartOptions} />
        <Line data={moodData} options={chartOptions} />
      </div>
    </FlexBetween>
  );
};

export default Statistics;
