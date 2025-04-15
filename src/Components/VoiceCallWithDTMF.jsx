import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VoiceCallWithDTMF = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const username = "your_username";
  const token = "your_token";

  const uploadAnnouncement = async () => {
    try {
      const res = await axios.post("http://voicecall.lionsms.com/api/voice/upload_announcement.php", null, {
        params: {
          username,
          token,
          announcement_path: audioUrl,
        },
      });

      const result = res.data;
      if (result.status === "success") {
        const announcementId = result.data.announcement_id;
        toast.success("Audio uploaded!");
        return announcementId;
      } else {
        toast.error(result.desc);
        return null;
      }
    } catch (err) {
      toast.error("Upload failed: " + err.message);
      return null;
    }
  };

  const triggerCall = async (announcementId) => {
    try {
      const res = await axios.post("http://172.30.6.12:5008/api/voicecall", {
        contact_number: phoneNumber,
        announcement_id: announcementId,
      });

      const uniqueId = res.data.data?.[0]?.unique_id;
      toast.success("Call triggered!");

      // ✅ Wait 20s and then fetch DTMF result
      setTimeout(() => {
        fetchDTMFReport(uniqueId);
      }, 20000);
    } catch (err) {
      toast.error("Call trigger failed: " + err.message);
    }
  };

  const fetchDTMFReport = async (uniqueId) => {
    try {
      const res = await axios.get("http://172.30.6.12:5008/api/voicecall/report", {
        params: { unique_ids: uniqueId },
      });

      const dtmf = res.data?.data?.[uniqueId]?.data?.dtmf;
      const report = res.data?.data?.[uniqueId]?.data?.report;

      if (!dtmf) {
        toast.warning("No key press detected.");
      } else {
        toast.info(`User pressed: ${dtmf}`);
        handleDTMFLogic(dtmf);
      }

      console.log("Report:", report);
    } catch (err) {
      toast.error("Failed to fetch DTMF: " + err.message);
    }
  };

  const handleDTMFLogic = (dtmf) => {
    if (dtmf === "1") {
      toast.success("✅ Approved!");
      // Trigger backend logic here
    } else if (dtmf === "0") {
      toast.error("❌ Rejected!");
      // Trigger backend logic here
    } else {
      toast.info("Key pressed: " + dtmf);
    }
  };

  const handleSubmit = async () => {
    if (!audioUrl || !phoneNumber) {
      toast.warning("Phone and audio URL are required!");
      return;
    }

    setLoading(true);
    const announcementId = await uploadAnnouncement();
    if (announcementId) {
      await triggerCall(announcementId);
    }
    setLoading(false);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh" p={4}>
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h6" mb={2}>Voice Call with DTMF Logic</Typography>
        <TextField
          label="Phone Number"
          fullWidth
          margin="normal"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <TextField
          label="Audio URL (MP3/WAV)"
          fullWidth
          margin="normal"
          value={audioUrl}
          onChange={(e) => setAudioUrl(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Send Voice Call"}
        </Button>
      </Paper>
      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default VoiceCallWithDTMF;
