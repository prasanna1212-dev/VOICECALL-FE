import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";

const UploadAnnouncement = () => {
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [announcementId, setAnnouncementId] = useState("");
  const [announcementName, setAnnouncementName] = useState("");

  const handleUpload = async () => {
    if (!audioUrl || !audioUrl.endsWith(".mp3") && !audioUrl.endsWith(".wav")) {
      toast.error("Please provide a valid .mp3 or .wav URL");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://voicecall.lionsms.com/api/voice/upload_announcement.php",
        null,
        {
          params: {
            username: "u24441",
            token: "yAueB7",
            announcement_path: audioUrl,
          },
        }
      );

      const result = response.data;
      if (result.status === "success") {
        toast.success("Audio uploaded successfully!");
        setAnnouncementId(result.data.announcement_id);
        setAnnouncementName(result.data.announcement_name);
      } else {
        toast.error(`Upload failed: ${result.desc}`);
      }
    } catch (err) {
      console.error("Upload error:", err.message);
      toast.error("Failed to upload announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, width: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h6" mb={2}>Upload Voice Announcement</Typography>
      <TextField
        label="Audio File URL (mp3/wav)"
        fullWidth
        value={audioUrl}
        onChange={(e) => setAudioUrl(e.target.value)}
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={loading}
        fullWidth
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : "Upload Announcement"}
      </Button>

      {announcementId && (
        <Box mt={3}>
          <Typography variant="subtitle1" color="success.main">
            ✅ Uploaded Successfully!
          </Typography>
          <Typography>Announcement ID: <b>{announcementId}</b></Typography>
          <Typography>File Name: <b>{announcementName}</b></Typography>
        </Box>
      )}
    </Paper>
  );
};

export default UploadAnnouncement;
