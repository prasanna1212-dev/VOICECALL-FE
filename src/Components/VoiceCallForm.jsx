import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    Input,
    Button,
    Card,
    Typography,
    Table,
    Tag,
    Space,
    Spin,
    message,
} from "antd";
import { PhoneOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const { Title } = Typography;

const VoiceCallForm = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [storedLogs, setStoredLogs] = useState([]);
    const [pendingIds, setPendingIds] = useState([]);
    const pendingIdsRef = useRef([]);

    useEffect(() => {
        fetchStoredLogs();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (pendingIdsRef.current.length > 0) {
                pendingIdsRef.current.forEach((id) => fetchReport(id));
                pendingIdsRef.current = [];
                setPendingIds([]);
            }
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    //   const handleSend = async () => {
    //     const trimmed = phoneNumber.trim();
    //     if (!trimmed || trimmed.length < 8) {
    //       message.warning("Please enter a valid phone number");
    //       return;
    //     }

    //     setLoading(true);
    //     try {
    //       const res = await axios.post("http://172.30.6.12:5008/api/voicecall", {
    //         contact_number: trimmed,
    //       });

    //       const data = res.data;
    //       if (data.status === "success") {
    //         message.success(data.desc || "Call sent successfully!");
    //         const uniqueId = data.data?.[0]?.unique_id;
    //         if (uniqueId) {
    //           const updatedIds = [...new Set([...pendingIdsRef.current, uniqueId])];
    //           pendingIdsRef.current = updatedIds;
    //           setPendingIds(updatedIds);

    //           setTimeout(() => {
    //             fetchReport(uniqueId);
    //           }, 40000);
    //         }
    //       } else {
    //         message.error(`Error (${data.code}): ${data.desc}`);
    //       }
    //     } catch (error) {
    //       message.error("Failed to send call: " + error.message);
    //     } finally {
    //       setLoading(false);
    //     }
    //   };

    //   const fetchStoredLogs = async () => {
    //     try {
    //       const res = await axios.get("http://172.30.6.12:5008/api/voicecall/logs");
    //       if (res.data.status === "success") {
    //         const uniqueMap = new Map();
    //         for (const log of res.data.data) {
    //           uniqueMap.set(log.uniqueId, log);
    //         }
    //         setStoredLogs(Array.from(uniqueMap.values()));
    //       }
    //     } catch (error) {
    //       console.error("Log fetch error:", error.message);
    //     }
    //   };


    //   const fetchReport = async (uniqueId) => {
    //     try {
    //       const res = await axios.get("http://172.30.6.12:5008/api/voicecall/report", {
    //         params: { unique_ids: uniqueId },
    //       });

    //       const result = res.data;
    //       const reportData = result?.data?.[uniqueId]?.data;
    //       if (reportData) {
    //         const {
    //           status,
    //           report,
    //           duration,
    //           time_start,
    //           time_connect,
    //           time_end,
    //           contact_number,
    //           currentRetryCount,
    //           dtmf,
    //           ivrExecuteFlow,
    //         } = reportData;

    //         setStoredLogs((prevLogs) => {
    //             const updatedLogsMap = new Map(prevLogs.map(log => [log.uniqueId, log]));

    //             updatedLogsMap.set(uniqueId, {
    //               uniqueId,
    //               contact_number,
    //               status,
    //               report,
    //               time_start,
    //               time_connect,
    //               time_end,
    //               duration,
    //               retry_count: currentRetryCount,
    //               dtmf,
    //               ivrExecuteFlow,
    //             });

    //             return Array.from(updatedLogsMap.values());
    //           });


    //         message.info(`Updated: ${report} (${duration}s)`);
    //         setTimeout(fetchStoredLogs, 1000);
    //       }
    //     } catch (err) {
    //       console.error("Fetch report failed:", err.message);
    //     }
    //   };



    //----------

    const handleSend = async () => {
        const trimmed = phoneNumber.trim();
        if (!trimmed || trimmed.length < 8) {
            toast.warning("Please enter a valid phone number");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post("http://172.30.6.12:5008/api/voicecall", {
                contact_number: trimmed,
            });

            const data = res.data;
            if (data.status === "success") {
                toast.success(data.desc || "Call sent successfully!");

                const uniqueId = data.data?.[0]?.unique_id;
                if (uniqueId) {
                    const updatedIds = [...new Set([...pendingIdsRef.current, uniqueId])];
                    pendingIdsRef.current = updatedIds;
                    setPendingIds(updatedIds);

                    // ✅ Schedule the fetchReport after 20 seconds
                    setTimeout(() => {
                        fetchReport(uniqueId);
                    }, 40000); // 20,000 ms = 20 seconds
                }
            } else {
                toast.error(`Error (${data.code}): ${data.desc}`);
            }
        } catch (error) {
            toast.error("Failed to send call: " + error.message);
        } finally {
            setLoading(false);
        }
    };


    const fetchStoredLogs = async () => {
        try {
            const res = await axios.get("http://172.30.6.12:5008/api/voicecall/logs");
            if (res.data.status === "success") {
                setStoredLogs(res.data.data);
            }
        } catch (error) {
            console.error("Log fetch error:", error.message);
        }
    };

    const fetchReport = async (uniqueId) => {
        try {
            const res = await axios.get("http://172.30.6.12:5008/api/voicecall/report", {
                params: { unique_ids: uniqueId },
            });

            const result = res.data;
            const reportData = result?.data?.[uniqueId]?.data;
            if (reportData) {
                const {
                    status,
                    report,
                    duration,
                    time_start,
                    time_connect,
                    time_end,
                    contact_number,
                    currentRetryCount,
                    dtmf,
                    ivrExecuteFlow,
                } = reportData;

                setStoredLogs((prevLogs) => {
                    const filtered = prevLogs.filter((log) => log.uniqueId !== uniqueId);
                    return [
                        {
                            uniqueId,
                            contact_number,
                            status,
                            report,
                            time_start,
                            time_connect,
                            time_end,
                            duration,
                            retry_count: currentRetryCount,
                            dtmf,
                            ivrExecuteFlow,
                        },
                        ...filtered,
                    ];

                });

                toast.info(`Updated: ${report} (${duration}s)`);
            }
        } catch (err) {
            console.error("Fetch report failed:", err.message);
        }
    };


    const renderReportTag = (report) => {
        if (!report || report === "Dialed") {
            return <Tag icon={<ClockCircleOutlined />} color="warning">Pending</Tag>;
        } else if (report === "Answered") {
            return <Tag icon={<CheckCircleOutlined />} color="success">Answered</Tag>;
        } else if (["Busy", "Failed", "No Answer"].includes(report)) {
            return <Tag icon={<CloseCircleOutlined />} color="error">{report}</Tag>;
        } else {
            return <Tag>{report}</Tag>;
        }
    };

    const columns = [
        { title: "Unique ID", dataIndex: "uniqueId", key: "uniqueId" },
        { title: "Contact Number", dataIndex: "contact_number", key: "contact_number" },
        { title: "Status", dataIndex: "status", key: "status" },
        {
            title: "Report",
            dataIndex: "report",
            key: "report",
            render: (_, record) => renderReportTag(record.report),
        },
        { title: "Start", dataIndex: "time_start", key: "time_start" },
        { title: "Connect", dataIndex: "time_connect", key: "time_connect" },
        { title: "End", dataIndex: "time_end", key: "time_end" },
        { title: "DTMF", dataIndex: "dtmf", key: "dtmf", render: val => val || "-" },
        { title: "Duration (s)", dataIndex: "duration", key: "duration", render: val => val || "-" },
    ];

    return (
        <>
        <ToastContainer/>
        <div style={{ padding: "2rem" }}>
            <Card
                title={<Title level={4}><PhoneOutlined /> Trigger Voice Call</Title>}
                bordered={false}
                style={{ maxWidth: 450, margin: "0 auto", marginBottom: "2rem" }}
            >
                <Input
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    style={{ marginBottom: "1rem" }}
                />
                <Button
                    type="primary"
                    icon={<PhoneOutlined />}
                    onClick={handleSend}
                    loading={loading}
                    block
                >
                    Send Voice Call
                </Button>
            </Card>

            {storedLogs.length > 0 && (
                <Card
                    title={<Title level={5}>📞 Stored Voice Call Logs</Title>}
                    bordered
                >
                    <Table
                        columns={columns}
                        dataSource={storedLogs}
                        rowKey="uniqueId"
                        pagination={{ pageSize: 8 }}
                        scroll={{ x: "max-content" }}
                    />
                </Card>
            )}
        </div>
        </>
    );
};

export default VoiceCallForm;


