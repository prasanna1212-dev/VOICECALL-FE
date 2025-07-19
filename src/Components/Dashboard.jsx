import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Input, Card, Button, Modal, TimePicker, Select } from "antd";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, } from "chart.js";
import { FiPhoneCall, FiArrowLeft, FiRefreshCcw, FiClock } from "react-icons/fi";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import { BiTimeFive } from "react-icons/bi";
import { FiDownload } from "react-icons/fi"; 
import "../styles/Dashboard.css";
import ReactApexChart from "react-apexcharts";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const { Option } = Select;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const navigate = useNavigate();

  // states for schedule
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dailyTime, setDailyTime] = useState(null);
  const [weeklyDay, setWeeklyDay] = useState("Monday");
  const [weeklyTime, setWeeklyTime] = useState(null);
  const [monthlyDate, setMonthlyDate] = useState(1);
  const [monthlyTime, setMonthlyTime] = useState(null);
  const [savingSchedule, setSavingSchedule] = useState(false);

  // Fetch existing schedule from backend on mount
  const fetchSchedule = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/report`);
      if (!res.ok) throw new Error("Failed to fetch schedule");
      const data = await res.json();
      // Assuming backend returns { dailyTime: "HH:mm", weeklyDay: "Monday", weeklyTime: "HH:mm", monthlyDate: 1-31, monthlyTime: "HH:mm" }
      setDailyTime(data.dailyTime ? dayjs(data.dailyTime, "HH:mm") : null);
      setWeeklyDay(data.weeklyDay || "Monday");
      setWeeklyTime(data.weeklyTime ? dayjs(data.weeklyTime, "HH:mm") : null);
      setMonthlyDate(data.monthlyDate || 1);
      setMonthlyTime(data.monthlyTime ? dayjs(data.monthlyTime, "HH:mm") : null);
    } catch (err) {
      console.error(err);
      toast.error("Could not load report schedule");
    }
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

    // Filter logs, calculate stats as before...
    const answeredLogs = logs.filter((log) => log.report === "Answered");
    const missedLogs = logs.filter((log) => log.report !== "Answered");
    const avgDuration = answeredLogs.length
      ? (
          answeredLogs.reduce((acc, log) => acc + (parseInt(log.duration) || 0), 0) /
          answeredLogs.length
        ).toFixed(1)
      : 0;
  
    const reportStats = logs.reduce((acc, log) => {
      acc[log.report] = (acc[log.report] || 0) + 1;
      return acc;
    }, {});

 // Fetch logs function (memoized to avoid recreation)
 const fetchLogs = useCallback(async () => {
    try {
      setLoadingLogs(true);
      const response = await fetch(`${API_BASE_URL}/api/proxy/voicebroadcast/logs`);
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoadingLogs(false);
    }
  }, []);

  // Auto refresh every 10 seconds & update current datetime every 1 second
  useEffect(() => {
    fetchLogs();
    const refreshInterval = setInterval(fetchLogs, 10000); // refresh data every 10 seconds
    const dateTimeInterval = setInterval(() => setCurrentDateTime(new Date()), 1000); // update clock every second
    return () => {
      clearInterval(refreshInterval);
      clearInterval(dateTimeInterval);
    };
  }, [fetchLogs]);


// Save schedule handler
const handleSaveSchedule = async () => {
  if (!dailyTime || !weeklyTime || !monthlyTime) {
    toast.error("Please select all times");
    return;
  }
  setSavingSchedule(true);
  try {
    const payload = {
      dailyTime: dailyTime.format("HH:mm"),
      weeklyDay,
      weeklyTime: weeklyTime.format("HH:mm"),
      monthlyDate,
      monthlyTime: monthlyTime.format("HH:mm"),
    };
    const res = await fetch(`${API_BASE_URL}/api/report-schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to save schedule");
    await toast.success("Report schedule saved successfully");
    setIsModalVisible(false);
  } catch (err) {
    console.error(err);
    toast.error("Failed to save report schedule");
  } finally {
    setSavingSchedule(false);
  }
};

const handleDownloadReport = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/proxy/voicebroadcast/report-overall`);
      const data = await response.json();
  
      if (data.status === "success" && data.url) {
        const fileResponse = await fetch(data.url);
        const blob = await fileResponse.blob();
  
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "Voice_Log_Report_Overall.pdf"; // force file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl); // cleanup
      } else {
        console.error("Failed to fetch report URL");
      }
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  // Days of week options for weekly schedule
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Dates for monthly schedule (1 to 28, 29, 30, 31)
  const datesOfMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Format date nicely
  const formattedDate = currentDateTime.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = currentDateTime.toLocaleTimeString();

  // 5 unique colors - fixed palette to avoid repeats
  const uniqueColors = [
    "#1abc9c", // turquoise
    "#e67e22", // orange
    "#9b59b6", // purple
    "#34495e", // dark blue-gray
    "#e74c3c", // red
  ];

  const labels = Object.keys(reportStats);

  const radialBarOptions = {
    chart: {
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        track: {
          strokeWidth: "30%", // thicker background track
        },
        dataLabels: {
          name: {
            fontSize: "16px",
            color: "#333",
            offsetY: -10,
          },
          value: {
            fontSize: "22px",
            color: "#111",
            offsetY: 10,
            formatter: (val) => (val ? val : "0"),
          },
          total: {
            show: true,
            label: "Total",
            formatter: () => Object.values(reportStats).reduce((a, b) => a + b, 0),
            fontSize: "20px",
            color: "#555",
          },
        },
        hollow: {
          size: "35%",
        },
      },
    },
    colors: labels.map((_, idx) => uniqueColors[idx % uniqueColors.length]),
    labels: labels,
    stroke: {
      lineCap: "round",
    },
  };
  
  // The series is the values (counts) for each report type
  const radialBarSeries = Object.values(reportStats);  

  const answeredDurations = logs
  .filter((log) => log.report === "Answered")
  .map((log) => parseInt(log.duration || 0));

const answeredTimes = logs
  .filter((log) => log.report === "Answered")
  .map((log) => log.time_start || "N/A");

const gradientLineSeries = [
  {
    name: "Answered Duration",
    data: answeredDurations,
  },
];

const gradientLineOptions = {
  chart: {
    type: "area",
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    width: 3,
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.6,
      opacityTo: 0,
      stops: [0, 90, 100],
      colorStops: [
        {
          offset: 0,
          color: "#43a047",
          opacity: 1,
        },
        {
          offset: 50,
          color: "#1e88e5",
          opacity: 0.7,
        },
        {
          offset: 100,
          color: "#8e24aa",
          opacity: 0,
        },
      ],
    },
  },
  xaxis: {
    categories: answeredTimes,
    labels: {
      rotate: -45,
      style: { fontSize: "11px" },
    },
    title: {
      text: "Start Time",
      style: { fontWeight: 500 },
    },
  },
  yaxis: {
    title: {
      text: "Duration (s)",
      style: { fontWeight: 500 },
    },
    min: 0,
  },
  tooltip: {
    y: {
      formatter: (val) => `${val} seconds`,
    },
  },
  colors: ["#43a047"],
};
  
  const columns = [
    {
      title: "Unique ID",
      dataIndex: "systemuniqueid",
    },
    {
      title: "Contact Number",
      dataIndex: "contact_number",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Report",
      dataIndex: "report",
      render: (report) => {
        const colors = {
          Answered: "#28a745",
          Failed: "#d32f2f",
          Busy: "#ff9800",
          "No Answer": "#607d8b",
        };
        return (
          <span
            style={{
              backgroundColor: colors[report] || "#ccc",
              color: "#fff",
              padding: "2px 8px",
              borderRadius: 4,
              fontSize: 12,
              whiteSpace: "nowrap",
            }}
          >
            {report || "-"}
          </span>
        );
      },
    },
    {
      title: "Start",
      dataIndex: "time_start",
      render: (value) => value || "-",
    },
    {
      title: "Connect",
      dataIndex: "time_connect",
      render: (value) => value || "-",
    },
    {
      title: "End",
      dataIndex: "time_end",
      render: (value) => value || "-",
    },
    {
      title: "DTMF",
      dataIndex: "dtmf",
      render: (value) => value || "-",
    },
    {
      title: "Duration (s)",
      dataIndex: "duration",
      render: (value) => value || "0",
    },
  ];

  const filteredLogs = logs.filter((log) =>
    Object.values(log).some((val) =>
      val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="dashboard-entire-container" style={{ padding: "20px", backgroundColor: "#f9fafc" }}>
        {/* Top bar with current date/time & refresh */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          padding: 10,
          backgroundColor: "#ffffff",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
         {/* Left Side: Back Button + Clock Widget */}
         <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <FiArrowLeft
            size={22}
            onClick={() => navigate("/")}
            style={{ cursor: "pointer", color: "#1e88e5" }}
            title="Go back"
          />
            <div className="timer-container">
            <div className="time-box">
                <div className="time-value">{currentDateTime.toLocaleDateString(undefined, { weekday: "short" }).toUpperCase()}</div>
                <div className="time-label">DAY</div>
            </div>
            <div className="time-separator">:</div>
            <div className="time-box">
                <div className="time-value">{String(currentDateTime.getHours()).padStart(2, '0')}</div>
                <div className="time-label">HOURS</div>
            </div>
            <div className="time-separator">:</div>
            <div className="time-box">
                <div className="time-value">{String(currentDateTime.getMinutes()).padStart(2, '0')}</div>
                <div className="time-label">MINUTES</div>
            </div>
            <div className="time-separator">:</div>
            <div className="time-box">
                <div className="time-value">{String(currentDateTime.getSeconds()).padStart(2, '0')}</div>
                <div className="time-label">SECONDS</div>
            </div>
            </div>
        </div>

        {/* Right: Refresh button and Mail Scheduling button */}
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            icon={<FiRefreshCcw />}
            onClick={fetchLogs}
            loading={loadingLogs}
            style={{ fontWeight: "600" }}
          >
            Refresh
          </Button>
          <Button
            type="default"
            icon={<FiClock />}
            onClick={() => setIsModalVisible(true)}
            style={{ fontWeight: "600" }}
          >
            Mail Scheduling
          </Button> 
          {/*<Button
            type="default"
            icon={<FiDownload />}
            onClick={handleDownloadReport}
            style={{ fontWeight: "600" }}
          >
            Download Report
          </Button>*/}
        </div>
      </div>
    <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        <div className="dashboard-stat-card">
            <div className="dashboard-card-header">
            <div>
                <p className="dashboard-label">Total Calls</p>
                <h2>{logs.length}</h2>
                {/* <span className="dashboard-subtext positive">▲ 12.5% from yesterday</span> */}
            </div>
            <div className="dashboard-icon bg-blue">
                <FiPhoneCall size={24} color="#1e88e5" />
            </div>
            </div>
        </div>

        <div className="dashboard-stat-card">
            <div className="dashboard-card-header">
            <div>
                <p className="dashboard-label">Answered</p>
                <h2>{answeredLogs.length}</h2>
                {/* <span className="dashboard-subtext positive">▲ 3.2% from yesterday</span> */}
            </div>
            <div className="dashboard-icon bg-green">
                <HiOutlineCheckCircle size={24} color="#43a047" />
            </div>
            </div>
        </div>
    

        <div className="dashboard-stat-card">
            <div className="dashboard-card-header">
            <div>
                <p className="dashboard-label">Missed</p>
                <h2>{missedLogs.length}</h2>
                {/* <span className="dashboard-subtext negative">▼ 1.1% from yesterday</span> */}
            </div>
            <div className="dashboard-icon bg-red">
                <HiOutlineXCircle size={24} color="#e53935" />
            </div>
            </div>
        </div>
        <div className="dashboard-stat-card">
            <div className="dashboard-card-header">
            <div>
                <p className="dashboard-label">Avg Call Duration</p>
                <h2>{avgDuration} s</h2>
                <span className="dashboard-subtext">based on answered</span>
            </div>
            <div className="dashboard-icon bg-purple">
                <BiTimeFive size={24} color="#8e24aa" />
            </div>
            </div>
        </div>
        </div>
        <div style={{ display: "flex", gap: "24px", marginBottom: 32 }}>
        <Card title="Call Summary (Answered, Failed, etc.)" style={{ flex: 1 }}>
            {radialBarSeries.length > 0 ? (
                <ReactApexChart
                options={radialBarOptions}
                series={radialBarSeries}
                type="radialBar"
                height={250}
                />
            ) : (
                <p>No data to display</p>
            )}
            </Card>

            <Card title="Answered Call Duration Over Time" style={{ flex: 2 }}>
            <ReactApexChart
                options={gradientLineOptions}
                series={gradientLineSeries}
                type="area"
                height={250}
            />
            </Card>
            </div>

      <Card title="Call Logs">
        <Input.Search
          placeholder="Search logs..."
          allowClear
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: 16, width: 300 }}
        />
        <Table
          dataSource={filteredLogs}
          columns={columns}
          rowKey="systemuniqueid"
          loading={loadingLogs}
          pagination={{ pageSize: 10 }}
        />
      </Card>
      {/* Scheduling Modal */}
      <Modal
        title="Mail Scheduling"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSaveSchedule}
        confirmLoading={savingSchedule}
        okText="Save"
      >
        <div style={{ marginBottom: 16 }}>
          <h4>Daily Report Time</h4>
          <TimePicker
            value={dailyTime}
            onChange={(time) => setDailyTime(time)}
            format="HH:mm"
            style={{ width: "100%" }}
            placeholder="Select time for daily report"
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <h4>Weekly Report Day & Time</h4>
          <Select
            value={weeklyDay}
            onChange={(day) => setWeeklyDay(day)}
            style={{ width: "100%", marginBottom: 8 }}
          >
            {daysOfWeek.map((day) => (
              <Option key={day} value={day}>
                {day}
              </Option>
            ))}
          </Select>
          <TimePicker
            value={weeklyTime}
            onChange={(time) => setWeeklyTime(time)}
            format="HH:mm"
            style={{ width: "100%" }}
            placeholder="Select time for weekly report"
          />
        </div>

        <div>
          <h4>Monthly Report Date & Time</h4>
          <Select
            value={monthlyDate}
            onChange={(date) => setMonthlyDate(date)}
            style={{ width: "100%", marginBottom: 8 }}
          >
            {datesOfMonth.map((date) => (
              <Option key={date} value={date}>
                {date}
              </Option>
            ))}
          </Select>
          <TimePicker
            value={monthlyTime}
            onChange={(time) => setMonthlyTime(time)}
            format="HH:mm"
            style={{ width: "100%" }}
            placeholder="Select time for monthly report"
          />
        </div>
      </Modal>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Dashboard;
