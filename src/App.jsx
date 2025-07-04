import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import VoiceCallForm from './Components/VoiceCallForm'
// import UploadAnnouncement from './Components/UploadAnnouncement'
// import VoiceCallGatewayApp from "./Components/profile"
import NetworkStatusChecker from './Components/NetworkStatusChecker';
import APIPage from "./Components/API";
import Dashboard from './Components/Dashboard';
import "../src/App.css"

const App = () => {
  return (
    <Router>
      <NetworkStatusChecker></NetworkStatusChecker>
      <Routes>
        <Route path="/" element={<APIPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/upload" element={<UploadAnnouncement />} />
        <Route path="/profile" element={< VoiceCallForm/>} />
        <Route path="/apiui" element={< VoiceCallGatewayApp/>} /> */}
        {/* You can add more routes here */}
      </Routes>
    </Router>
  )
}

export default App
