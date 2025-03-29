import { createSlice } from "@reduxjs/toolkit";
import { IconType } from "react-icons";

interface Stat {
  title: string;
  value: string;
  iconName: string;
  trend: { value: string; isPositive: boolean };
}

interface Activity {
  id: string;
  title: string;
  project: string;
  duration: string;
  time: string;
  status: "completed" | "in-progress" | "paused";
}

interface Project {
  id: string;
  name: string;
  progress: number;
  hoursLogged: string;
  color: string;
}

interface TimeDistribution {
  label: string;
  hours: number;
  color: string;
}

interface DashboardState {
  stats: Stat[];
  activities: Activity[];
  projects: Project[];
  timeDistribution: TimeDistribution[];
}

const initialState: DashboardState = {
  stats: [
    {
      title: "Total Hours",
      value: "32.5h",
      iconName: "FaClock",
      trend: { value: "12%", isPositive: true },
    },
    {
      title: "Projects",
      value: "8",
      iconName: "FaProjectDiagram",
      trend: { value: "2", isPositive: true },
    },
    {
      title: "This Week",
      value: "18.2h",
      iconName: "FaCalendarAlt",
      trend: { value: "5%", isPositive: false },
    },
    {
      title: "Average Daily",
      value: "4.6h",
      iconName: "FaHourglassHalf",
      trend: { value: "8%", isPositive: true },
    },
  ],
  activities: [
    {
      id: "1",
      title: "Website Redesign",
      project: "Client XYZ",
      duration: "2h 15m",
      time: "Today, 10:30 AM",
      status: "completed",
    },
    {
      id: "2",
      title: "Backend Development",
      project: "Internal Project",
      duration: "1h 45m",
      time: "Today, 2:00 PM",
      status: "in-progress",
    },
    {
      id: "3",
      title: "Client Meeting",
      project: "Client ABC",
      duration: "45m",
      time: "Yesterday, 3:30 PM",
      status: "completed",
    },
    {
      id: "4",
      title: "Bug Fixing",
      project: "Mobile App",
      duration: "3h 20m",
      time: "Yesterday, 11:00 AM",
      status: "paused",
    },
  ],
  projects: [
    {
      id: "1",
      name: "Website Redesign",
      progress: 75,
      hoursLogged: "12.5h",
      color: "bg-blue-600",
    },
    {
      id: "2",
      name: "Mobile App Development",
      progress: 45,
      hoursLogged: "8.2h",
      color: "bg-purple-600",
    },
    {
      id: "3",
      name: "Internal Dashboard",
      progress: 90,
      hoursLogged: "6.8h",
      color: "bg-green-600",
    },
  ],
  timeDistribution: [
    { label: "Website Redesign", hours: 12.5, color: "#2563eb" },
    { label: "Mobile App", hours: 8.2, color: "#9333ea" },
    { label: "Internal Dashboard", hours: 6.8, color: "#16a34a" },
    { label: "Client Meetings", hours: 3.5, color: "#f59e0b" },
    { label: "Other", hours: 1.5, color: "#6b7280" },
  ],
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
});

export const selectDashboard = (state: { dashboard: DashboardState }) =>
  state.dashboard;
export default dashboardSlice.reducer;
