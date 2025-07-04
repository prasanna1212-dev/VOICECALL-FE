import React, { useState, useEffect } from "react";
import { Button, Input, Select, Typography, Row, Col, Space, Empty, Table, message } from "antd";
import KgislLogo from "../assets/kgisl_logo.png";
import APIimg from "../assets/api1.png";
import toast, { Toaster } from "react-hot-toast";
import "../styles/API.css";

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function API() {
    const announcementMap = {
        "1englishmens.mp3": "686348",
        "1Malayalam.mp3": "686347",
        "1Malayalammens.mp3": "686346",
        "3tamilmens.mp3(1)": "686345",
        "3tamil.mp3": "686344",
        "3Malayalammens.mp3":"686343",
        "3Malayalam.mp3":"686342",
        "3tamilmens.mp3":"686341",
        "3englishmens.mp3":"686340",
        "2tamilmens.mp3":"686339",
        "2tamil.mp3":"686338",
        "2Malayalammens.mp3":"686337",
        "2Malayalam.mp3":"686336",
        "2englishmens.mp3":"686335",
        "1tamilmens.mp3":"686334",
        "1tamil.mp3":"686333"
      };
  const [formData, setFormData] = useState({
    plan: "",
    announcementId: "",
    callerId: "",
    waitTime: "",
    contactNumbers: "",
  });

  const [apiUrl, setApiUrl] = useState("");
  const [phpCode, setPhpCode] = useState("");
  const [jsonBody, setJsonBody] = useState("");
  const [note, setNote] = useState("");
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [pageSize, setPageSize] = useState(10);

  const getFilteredLogs = () => {
    return logs.filter((log) => {
      // Filter by "report" field now instead of "status"
      const reportMatch = filteredStatus ? log.report === filteredStatus : true;
 
      // Filter by search text across all fields
      const searchMatch = searchText
        ? Object.values(log).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
          )
        : true;
 
      return reportMatch && searchMatch;
    });
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

//   const handleGenerate = () => {
//     const { announcementId, contactNumbers } = formData;

//     const announcementMap = {
//       "kg1.mp3": "686026",
//     };

//     const resolvedAnnouncementId = announcementMap[announcementId];
//     const baseUrl = "${API_BASE_URL}/api/proxy/voice-broadcast";
//     const query = `contactNumbers=${encodeURIComponent(contactNumbers)}&announcementId=${encodeURIComponent(resolvedAnnouncementId)}`;
//     const finalUrl = `${baseUrl}?${query}`;

//     const php = `$announcementId = urlencode("${resolvedAnnouncementId}");
// $contactNumbers = urlencode("${contactNumbers}");

// $api = "${finalUrl}";`;

//     setApiUrl(finalUrl);
//     setPhpCode(php);
//     setJsonBody(JSON.stringify({
//       announcementId: resolvedAnnouncementId,
//       contactNumbers
//     }, null, 2));
//   };
const handleGenerate = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const { plan, announcementId, contactNumbers } = formData;
    if (!plan) {
      toast.error("Please select a Plan.");
      return;
    }
    if (plan === "Voice Call Logs") {
      const systemuniqueid = "2132563_4_3049-u24489"; // Can be made user input too
      const reportUrl = `http://172.16.32.125:5001/api/proxy/voicebroadcast/report?systemuniqueid=${systemuniqueid}`;
  
      const reportJson = {
        status: "success",
        systemuniqueid: systemuniqueid,
        report: {
          systemuniqueid: systemuniqueid,
          contact_number: "8825615742",
          createdAt: "2025-04-04T13:54:16.835Z",
          currentRetryCount: 0,
          dtmf: "1",
          duration: "1",
          ivrExecuteFlow: "#1",
          report: "Answered",
          status: "Dialed",
          time_connect: "04-Apr-2025 7:24:17 PM",
          time_end: "04-Apr-2025 7:24:18 PM",
          time_start: "04-Apr-2025 7:24:15 PM",
        }
      };
  
      const php = `$systemuniqueid = urlencode("${systemuniqueid}");
  $api = "http://172.16.32.125:5001/api/proxy/voicebroadcast/report?systemuniqueid=$systemuniqueid";`;
  
      setApiUrl(reportUrl);
      setNote(`NOTE: Please do find the "systemuniqueid" from the Post request JSON body of voice call trigger.`);
      setPhpCode(php);
      setJsonBody(JSON.stringify(reportJson, null, 2));
      toast.success("API Details for Voice Call Logs generated successfully!");
    } else if (plan === "API-Trans-Ans-Static") {
      if (!announcementId) {
        toast.error("Please select an Audio File.");
        return;
      }
 
      if (!contactNumbers.trim()) {
        toast.error("Please enter at least one Contact Number.");
        return;
      }
  
      const resolvedAnnouncementId = announcementMap[announcementId];
      const baseUrl = "http://172.16.32.125:5001/api/proxy/voice-broadcast";
      const query = `contactNumbers=${encodeURIComponent(contactNumbers)}&announcementId=${encodeURIComponent(resolvedAnnouncementId)}`;
      const finalUrl = `${baseUrl}?${query}`;
  
      const php = `$announcementId = urlencode("${resolvedAnnouncementId}");
  $contactNumbers = urlencode("${contactNumbers}");
  
  $api = "${finalUrl}";`;
  
      setApiUrl(finalUrl);
      setPhpCode(php);
      setJsonBody(JSON.stringify({
        contact_number: "8825615742",
        system_api_uniqueid: "2135330_1",
        unique_id: "2132563_4_3049-u24489"
      }, null, 2));      
      toast.success("API Details for Voice Call Trigger generated successfully!");
    }
  };  
  

  // 🟢 Fetch logs from API
  useEffect(() => {
    let interval;
    const fetchLogs = async () => {
      
      try {
        setLoadingLogs(true);
        const response = await fetch(`${API_BASE_URL}/api/proxy/voicebroadcast/logs`);
        const data = await response.json();
        setLogs(data);
      } catch (err) {
        console.error("Failed to fetch logs", err);
        message.error("Failed to load logs");
      } finally {
        setLoadingLogs(false);
      }
    };

    fetchLogs();
  interval = setInterval(fetchLogs, 10000);
   return () => clearInterval(interval);
  }, []);

  // 🟢 Table columns
  const columns = [
    {
      title: "Unique ID",
      dataIndex: "systemuniqueid",
      key: "systemuniqueid",
    },
    {
      title: "Contact Number",
      dataIndex: "contact_number",
      key: "contact_number",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
        title: "Report",
        dataIndex: "report",
        key: "report",
        render: (report) => {
          let styles = {
            backgroundColor: "#d9d9d9", // Default gray color
            color: "#fff",
            padding: "2px 8px",
            borderRadius: 4,
            fontSize: 12,
            whiteSpace: "nowrap", // Prevents text wrapping
            display: "inline-block", // Ensures it stays in one line
          };
      
          if (report === "Answered") styles.backgroundColor = "#28a745"; // Green
          else if (report === "Failed") styles.backgroundColor = "#d32f2f"; // Orange
          else if (report === "Busy") styles.backgroundColor = "#ff9800"; // Red
          else if (report === "No Answer") styles.backgroundColor = "#607d8b"; // Dark Gray
      
          return <span style={styles}>{report || "-"}</span>;
        }
      },      
    {
      title: "Start",
      dataIndex: "time_start",
      key: "time_start",
      render: (value) => value || "-"
    },
    {
      title: "Connect",
      dataIndex: "time_connect",
      key: "time_connect",
      render: (value) => value || "-"
    },
    {
      title: "End",
      dataIndex: "time_end",
      key: "time_end",
      render: (value) => value || "-"
    },
    {
      title: "DTMF",
      dataIndex: "dtmf",
      key: "dtmf",
      render: (value) => value || "-"
    },
    {
      title: "Duration (s)",
      dataIndex: "duration",
      key: "duration",
      render: (value) => value || "0"
    },
  ];
  

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", width: "100vw" }}>
        <Toaster position="top-center" reverseOrder={false} />
      {/* Top Bar */}
      {/* Top Bar with Dashboard Button */}
    <div style={{
      background: "#002B5B",
      padding: "10px 30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      <img src={KgislLogo} alt="KGiSL Logo" style={{ height: 36 }} />
      <button
        onClick={() => window.location.href = "/dashboard"}
        className="dashboard-button"
      >
        View Dashboard
      </button>
    </div>

      {/* Content Area */}
      <div style={{ flex: 1, padding: 24 }}>
        <Row gutter={24} style={{ height: "100%" }}>
          {/* Left Content */}
          <Col span={12}>
            <div style={{ background: "#fff", borderRadius: 8, height: "100%" }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
                <img src={APIimg} alt="API Icon" style={{ width: 40, marginRight: 12 }} />
                <p className="voice-api-title">VOICE BROADCAST API</p>
              </div>

              <Space direction="vertical" style={{ width: "100%" }}>
                {/* Form */}
                <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                  <div style={{ flex: 1 }}>
                    <label>Plan</label>
                    <Select
                    placeholder="Select Plan"
                    style={{ width: "100%" }}
                    onChange={(value) => handleChange("plan", value)}
                    value={formData.plan}
                    allowClear
                    >
                    <Option value="API-Trans-Ans-Static">Voice Call Trigger</Option>
                    <Option value="Voice Call Logs">Voice Call Logs</Option>
                    </Select>
                  </div>
                  {formData.plan === "API-Trans-Ans-Static" && (
                    <>
                        <div style={{ flex: 1 }}>
                        <label>Select Audio</label>
                        <Select
                            placeholder="Select Announcement"
                            style={{ width: "100%" }}
                            value={formData.announcementId}
                            onChange={(value) => handleChange("announcementId", value)}
                            allowClear
                            
                        >
                            {Object.keys(announcementMap).map((file) => (
                                <Option key={file} value={file}>
                                {file}
                                </Option>
                            ))}
                        </Select>
                        </div>

                        <div style={{ flex: 2 }}>
                        <label>Contact Numbers</label>
                        <TextArea
                            rows={1}
                            style={{ width: "100%" }}
                            value={formData.contactNumbers}
                            onChange={(e) => handleChange("contactNumbers", e.target.value)}
                            placeholder="Comma (,) separated"
                            allowClear
                        />
                        </div>
                    </>
                    )}
                </div>

                <div style={{ marginBottom: 24 }}>
                  <Button type="primary" className="voice-call-generate-api-button" onClick={handleGenerate}>
                    Generate API Details
                  </Button>
                </div>

                {apiUrl && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
                    <div style={{
                      backgroundColor: "#f5faff",
                      border: "1px solid #d9d9d9",
                      borderRadius: 8,
                      padding: 16,
                      width: "100%",
                      color: "#595959"
                    }}>
                        {formData.plan === "Voice Call Logs" && (
                            <p style={{ fontStyle: "italic", color: "#888" }}>{note}</p>
                        )}
                      <Title level={5} style={{ marginBottom: 12, color: "#002b5b" }}>Generated API Endpoint:</Title>
                      <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{apiUrl}</pre>
                    </div>
                    <div style={{
                      backgroundColor: "#f5faff",
                      border: "1px solid #d9d9d9",
                      borderRadius: 8,
                      padding: 16,
                      width: "100%",
                      color: "#595959"
                    }}>
                      <Title level={5} style={{ marginBottom: 12, color: "#002b5b" }}>Sample JSON Response Body:</Title>
                      <pre style={{ margin: 0 }}>{jsonBody}</pre>
                    </div>

                    <div style={{
                      backgroundColor: "#f5faff",
                      border: "1px solid #d9d9d9",
                      borderRadius: 8,
                      padding: 16,
                      width: "100%",
                      color: "#595959"
                    }}>
                      <Title level={5} style={{ marginBottom: 12, color: "#002b5b" }}>Example: PHP</Title>
                      <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{phpCode}</pre>
                    </div>
                  </div>
                )}
              </Space>
            </div>
          </Col>

          {/* Right Content - Logs */}
          <Col span={12}>
            <div style={{
              height: "100%",
              padding: 24,
              border: "1px solid #d9d9d9",
              borderRadius: 8,
              background: "#fff",
              overflowY: "auto"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <Space>
                  <Input.Search
                    placeholder="Search for info..."
                    allowClear
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 200 }}
                  />
                  <Select
                    allowClear
                    placeholder="Filter by Status"
                    style={{ width: 160 }}
                    onChange={(value) => setFilteredStatus(value)}
                  >
                    <Option value="Dialed">Dialed</Option>
                    <Option value="Failed">Failed</Option>
                    <Option value="Answered">Answered</Option>
                    <Option value="No Answer">No Answer</Option>
                    <Option value="Busy">Busy</Option>
                  </Select>
                </Space>
                <div>
                  <span style={{ marginRight: 8 }}>
                    Showing 1–{Math.min(pageSize, getFilteredLogs().length)} of {getFilteredLogs().length} results
                  </span>
                  <Select
                    defaultValue={10}
                    style={{ width: 100 }}
                    onChange={(value) => setPageSize(value)}
                  >
                    <Option value={10}>10 / page</Option>
                    <Option value={25}>25 / page</Option>
                    <Option value={50}>50 / page</Option>
                    <Option value={100}>100 / page</Option>
                  </Select>
                </div>
              </div>
              {logs.length > 0 ? (
                <Table
                columns={columns}
                dataSource={getFilteredLogs()}
                rowKey="systemuniqueid"
                pagination={{ pageSize,
                  showSizeChanger: false
                 }}
                loading={loadingLogs}
                size="middle"
              />              
              ) : (
                <Empty description="No logs found" />
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
