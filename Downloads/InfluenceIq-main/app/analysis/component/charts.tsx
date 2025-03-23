"use client"

import { Bar, Line, Pie, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
)

// Define interfaces for chart data props
interface BarChartProps {
  data?: any
}

interface LineChartProps {
  data?: any
}

interface PieChartProps {
  data?: any
}

interface DonutChartProps {
  data?: any
}

interface AreaChartProps {
  data?: any
}

export function BarChart({ data: propData }: BarChartProps) {
  // Default data if no props are provided
  const defaultData = {
    labels: ["13-17", "18-24", "25-34", "35+"],
    datasets: [
      {
        label: "Age Distribution",
        data: [5, 30, 50, 15],
        backgroundColor: [
          "rgba(99, 102, 241, 0.5)",
          "rgba(99, 102, 241, 0.6)",
          "rgba(99, 102, 241, 0.7)",
          "rgba(99, 102, 241, 0.8)",
        ],
        borderColor: ["rgb(99, 102, 241)", "rgb(99, 102, 241)", "rgb(99, 102, 241)", "rgb(99, 102, 241)"],
        borderWidth: 1,
      },
    ],
  }

  // Use provided data or fallback to default
  const chartData = propData ? {
    labels: propData.labels || defaultData.labels,
    datasets: propData.datasets || defaultData.datasets
  } : defaultData

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  }

  return <Bar data={chartData} options={options} />
}

export function LineChart({ data: propData }: LineChartProps) {
  // Default data if no props are provided
  const defaultData = {
    labels: ["Mar 1", "Mar 3", "Mar 3", "Mar 6", "Mar 10"],
    datasets: [
      {
        label: "Engagement Rate (%)",
        data: [5.5, 1.0, 1.6, 5.3, 2.1],
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.5)",
        tension: 0.3,
      },
    ],
  }

  // Use provided data or fallback to default
  const chartData = propData ? {
    labels: propData.labels || defaultData.labels,
    datasets: propData.datasets || defaultData.datasets
  } : defaultData

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  }

  return <Line data={chartData} options={options} />
}

export function PieChart({ data: propData }: PieChartProps) {
  // Default data if no props are provided
  const defaultData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [20, 80],
        backgroundColor: ["rgba(99, 102, 241, 0.7)", "rgba(244, 114, 182, 0.7)"],
        borderColor: ["rgb(99, 102, 241)", "rgb(244, 114, 182)"],
        borderWidth: 1,
      },
    ],
  }

  // Use provided data or fallback to default
  const chartData = propData ? {
    labels: propData.labels || defaultData.labels,
    datasets: propData.datasets || defaultData.datasets
  } : defaultData

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  }

  return <Pie data={chartData} options={options} />
}

export function DonutChart({ data: propData }: DonutChartProps) {
  // Default data if no props are provided
  const defaultData = {
    labels: ["Entertainment", "Lifestyle", "Fashion"],
    datasets: [
      {
        data: [60, 25, 15],
        backgroundColor: ["rgba(99, 102, 241, 0.7)", "rgba(16, 185, 129, 0.7)", "rgba(245, 158, 11, 0.7)"],
        borderColor: ["rgb(99, 102, 241)", "rgb(16, 185, 129)", "rgb(245, 158, 11)"],
        borderWidth: 1,
      },
    ],
  }

  // Use provided data or transform the provided data to chart format
  let chartData = defaultData;
  
  if (propData) {
    try {
      const labels = [];
      const dataValues = [];
      const backgroundColors = [
        "rgba(99, 102, 241, 0.7)", // Purple
        "rgba(16, 185, 129, 0.7)", // Green
        "rgba(245, 158, 11, 0.7)", // Orange
        "rgba(239, 68, 68, 0.7)",  // Red
        "rgba(59, 130, 246, 0.7)"  // Blue
      ];
      const borderColors = [
        "rgb(99, 102, 241)", 
        "rgb(16, 185, 129)", 
        "rgb(245, 158, 11)",
        "rgb(239, 68, 68)",
        "rgb(59, 130, 246)"
      ];

      // Add primary category if it exists
      if (propData.primary && propData.primary.name) {
        labels.push(propData.primary.name);
        const value = parseInt((propData.primary.percentage || "0%").replace("%", ""));
        dataValues.push(value);
      }

      // Add secondary categories if they exist
      if (propData.secondary && Array.isArray(propData.secondary)) {
        propData.secondary.forEach((category: any) => {
          if (category.name) {
            labels.push(category.name);
            const value = parseInt((category.percentage || "0%").replace("%", ""));
            dataValues.push(value);
          }
        });
      }

      // Only update chart data if we have labels and values
      if (labels.length > 0 && dataValues.length > 0) {
        chartData = {
          labels,
          datasets: [
            {
              data: dataValues,
              backgroundColor: backgroundColors.slice(0, labels.length),
              borderColor: borderColors.slice(0, labels.length),
              borderWidth: 1,
            },
          ],
        };
      }
    } catch (error) {
      console.error("Error processing category data for DonutChart:", error);
      // Fallback to default data if there's an error
    }
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
  }

  return <Doughnut data={chartData} options={options} />
}

export function AreaChart({ data: propData }: AreaChartProps) {
  // Default data if no props are provided
  const defaultData = {
    labels: ["Mar 1", "Mar 3", "Mar 5", "Mar 7", "Mar 10"],
    datasets: [
      {
        fill: true,
        label: "Engagement Rate (%)",
        data: [5.5, 1.0, 1.6, 5.3, 2.1],
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        tension: 0.3,
      },
    ],
  }

  // Use provided data or transform the provided data to chart format
  let chartData = defaultData;
  
  if (propData) {
    try {
      // If data has dates and rates arrays
      if (propData.dates && propData.rates && 
          Array.isArray(propData.dates) && Array.isArray(propData.rates)) {
        chartData = {
          labels: propData.dates,
          datasets: [
            {
              fill: true,
              label: "Engagement Rate (%)",
              data: propData.rates.map((rate: string) => parseFloat((rate || "0%").replace("%", ""))),
              borderColor: "rgb(99, 102, 241)",
              backgroundColor: "rgba(99, 102, 241, 0.2)",
              tension: 0.3,
            }
          ]
        };
      }
    } catch (error) {
      console.error("Error processing trend data for AreaChart:", error);
      // Fallback to default data if there's an error
    }
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return <Line data={chartData} options={options} />
}

