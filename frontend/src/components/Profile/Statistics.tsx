import { useEffect, useState } from "react";
import FlexBetween from "../UI/FlexBetween";
import { Line } from "react-chartjs-2"; // Importing the Line chart from react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js"; // Importing required chart.js components
import "./Statistics.css";
import { getCSSVariable } from "../../utils/style";

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

  useEffect(() => {
    // Get CSS variables on component mount
    setProfileColor(getCSSVariable("--profile-color"));
    setBackgroundColor(getCSSVariable("--background-color"));
  }, []);

  // Data for the chart (Created notes per day of the week)
  const data = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], // X-axis labels (days of the week)
    datasets: [
      {
        label: "Created Notes", // Dataset label
        data: [5, 12, 8, 10, 20, 15, 7], // Sample data for each day (replace with actual data)
        fill: false, // Don't fill the area under the line
        borderColor: profileColor,
        tension: 0.1, // Line smoothness
      },
    ],
  };

  // Options for the chart with dynamic colors and no grid lines
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Created Notes Per Weekday", // Title of the chart
        color: profileColor, // Title color (using dynamic profile color)
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
        <Line data={data} options={options} />
        <Line data={data} options={options} />

      </div>
    </FlexBetween>
  );
};

export default Statistics;
