import { useEffect, useState } from "react";
import FlexBetween from "../UI/FlexBetween";
import { Line } from "react-chartjs-2"; // Importing the Line chart from react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js"; // Importing required chart.js components
import "./Statistics.css";
import { getCSSVariable } from "../../utils/style";
import { useNoteStats } from "../../hooks/useNoteStats"; // Import the custom hook

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const [profileColor, setProfileColor] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<string>("");

  const { createdNotes, moodNotes, loading, error } = useNoteStats(); // Call the custom hook

  useEffect(() => {
    // Get CSS variables on component mount
    setProfileColor(getCSSVariable("--profile-color"));
    setBackgroundColor(getCSSVariable("--background-profile-color"));
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Data for the creation chart (Created notes per day of the week)
  const creationData = {
    labels: Object.keys(createdNotes), // X-axis labels (days of the week)
    datasets: [
      {
        label: "Created Notes", // Dataset label
        data: Object.values(createdNotes),
        fill: false, // Don't fill the area under the line
        borderColor: profileColor,
        tension: 0.1, // Line smoothness
      },
    ],
  };

  // Data for the mood chart (Notes per mood)
  const moodData = {
    labels: Object.keys(moodNotes), // X-axis labels (moods)
    datasets: [
      {
        label: "Notes by Mood", // Dataset label
        data: Object.values(moodNotes),
        fill: false, // Don't fill the area under the line
        borderColor: profileColor,
        tension: 0.1, // Line smoothness
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Notes Stats",
        color: profileColor,
        font: {
          size: 18,
        },
      },
      tooltip: {
        backgroundColor: "#333", // Dark background for tooltips
        titleColor: profileColor, // Light title color for tooltips
        bodyColor: profileColor, // Light body text color for tooltips
      },
    },
    scales: {
      x: {
        ticks: {
          color: profileColor, // Light color for x-axis labels
        },
        grid: {
          display: false, // Remove grid lines for the x-axis
        },
      },
      y: {
        ticks: {
          color: profileColor, // Light color for y-axis labels
        },
        grid: {
          display: false, // Remove grid lines for the y-axis
        },
      },
    },
    backgroundColor: backgroundColor, // Background color of the chart area (using dynamic background color)
  };

  return (
    <FlexBetween
      width="610px"
      height="100%"
      direction="column"
      padding="13px"
      className="stats-container"
    >
      <h3 className="stats-header" style={{ color: profileColor }}>Stats</h3> {/* Set header text color */}
      <div style={{ width: "89%", height: "300px", backgroundColor: backgroundColor, padding: "10px", borderRadius: "8px" }}>
        <Line data={creationData} options={chartOptions} /> {/* Chart for created notes per weekday */}
        <Line data={moodData} options={chartOptions} /> {/* Chart for notes by mood */}
      </div>
    </FlexBetween>
  );
};

export default Statistics;
