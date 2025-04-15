// import React, { useState } from "react";
// import { Routes, Route, useNavigate } from "react-router-dom";
// import {
//   Layout,
//   Menu,
//   Button,
//   Avatar,
//   Space,
//   Dropdown,
// } from "antd";
// import {
//   HomeOutlined,
//   ApiOutlined,
//   CreditCardOutlined,
//   SettingOutlined,
//   UserOutlined,
//   LockOutlined,
//   PoweroffOutlined,
// } from "@ant-design/icons";
// import "../styles/sidebar.css";
// import VoiceCallForm from "./VoiceCallForm";
// import kgislogo from "../assets/kgisl_logo.png";
// import APIPage from "../Components/API";

// const { Header, Content } = Layout;

// export default function VoiceCallGatewayApp() {
//   const [activeTab, setActiveTab] = useState("1");
//   const navigate = useNavigate();

//   const menuDropdown = () => (
//     <Menu
//       items={[
//         { label: "Option 1", key: "1" },
//         { label: "Option 2", key: "2" },
//       ]}
//     />
//   );

//   return (
//     <Layout style={{ minHeight: "100vh" }}>
//       {/* Top Floating Navbar */}
//       <Header
//         style={{
//           background: "#1D2641",
//           padding: "0 32px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           position: "fixed",
//           top: 0,
//           left: 0,
//           right: 0,
//           zIndex: 1000,
//           height: 64,
//         }}
//       >
//         {/* Left Side: Logo + Menu */}
//         <Space size="large" style={{ flex: 1 }}>
//           <img
//             src={kgislogo} // Put your logo inside public folder
//             alt="KGISL Logo"
//             style={{
//               height: 20,
//               objectFit: "contain"
//             }}
//           />
//           <Menu
//             mode="horizontal"
//             selectedKeys={[activeTab]}
//             onClick={({ key }) => setActiveTab(key)}
//             theme="dark"
//             style={{
//               background: "transparent",
//               borderBottom: "none",
//               flex: 1,
//             }}
//             items={[
//               {
//                 key: "1",
//                 icon: <HomeOutlined />,
//                 label: "Compose",
//               },
//               {
//                 key: "2",
//                 icon: <ApiOutlined />,
//                 label: "Reports",
//               },
//               {
//                 key: "3",
//                 icon: <CreditCardOutlined />,
//                 label: "Campaign Invoice",
//               },
//               {
//                 key: "4",
//                 icon: <SettingOutlined />,
//                 label: "Reschedule",
//               },
//             ]}
//           />
//         </Space>

//         {/* Right Side: Profile & Avatars */}
//         <Space size="middle">
//           <Dropdown overlay={menuDropdown()} trigger={["click"]}>
//             <Button type="text" style={{ color: "white" }}>Profile</Button>
//           </Dropdown>
//           <Button type="text" style={{ color: "white" }} onClick={() => navigate("/api-ui")}>
//             API
//           </Button>
//           <Dropdown overlay={menuDropdown()} trigger={["click"]}>
//             <Button type="text" style={{ color: "white" }}>My Plans</Button>
//           </Dropdown>
//           <Dropdown overlay={menuDropdown()} trigger={["click"]}>
//             <Button type="text" style={{ color: "white" }}>Settings</Button>
//           </Dropdown>
//           <Dropdown overlay={menuDropdown()} trigger={["click"]}>
//             <Button type="text" style={{ color: "white" }}>Credits</Button>
//           </Dropdown>
//           <Avatar size="small" icon={<UserOutlined />} style={{ background: "#52c41a" }} />
//           <Avatar size="small" icon={<LockOutlined />} style={{ background: "#1890ff" }} />
//           <Avatar size="small" icon={<PoweroffOutlined />} style={{ background: "#ff4d4f" }} />
//         </Space>
//       </Header>

//       {/* Main Content Area */}
//       <Content style={{ marginTop: 64, padding: 24, background: "#f0f2f5", minHeight: "calc(100vh - 64px)" }}>
//       <Routes>
//         <Route path="/" element={
//           <>
//             {activeTab === "1" && <VoiceCallForm />}
//             {activeTab === "2" && <div>Reports Component</div>}
//             {activeTab === "3" && <div>Campaign Invoice Component</div>}
//             {activeTab === "4" && <div>Reschedule Component</div>}
//           </>
//         } />
//         <Route path="/api-ui" element={<APIPage />} />
//       </Routes>
//       </Content>
//     </Layout>
//   );
// }


import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Space,
  Dropdown,
} from "antd";
import {
  HomeOutlined,
  ApiOutlined,
  CreditCardOutlined,
  SettingOutlined,
  UserOutlined,
  LockOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import "../styles/sidebar.css";
import VoiceCallForm from "./VoiceCallForm";
import kgislogo from "../assets/kgisl_logo.png";

const { Header, Content } = Layout;

export default function VoiceCallGatewayApp() {
  const [activeTab, setActiveTab] = useState("1");
  const navigate = useNavigate();

  const menuDropdown = () => (
    <Menu
      items={[
        { label: "Option 1", key: "1" },
        { label: "Option 2", key: "2" },
      ]}
    />
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#1D2641",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 64,
        }}
      >
        <Space size="large" style={{ flex: 1 }}>
          <img
            src={kgislogo}
            alt="KGISL Logo"
            style={{ height: 20, objectFit: "contain" }}
          />
          <Menu
            mode="horizontal"
            selectedKeys={[activeTab]}
            onClick={({ key }) => setActiveTab(key)}
            theme="dark"
            style={{
              background: "transparent",
              borderBottom: "none",
              flex: 1,
            }}
            items={[
              {
                key: "1",
                icon: <HomeOutlined />,
                label: "Compose",
              },
              {
                key: "2",
                icon: <ApiOutlined />,
                label: "Reports",
              },
              {
                key: "3",
                icon: <CreditCardOutlined />,
                label: "Campaign Invoice",
              },
              {
                key: "4",
                icon: <SettingOutlined />,
                label: "Reschedule",
              },
            ]}
          />
        </Space>

        <Space size="middle">
          <Dropdown overlay={menuDropdown()} trigger={["click"]}>
            <Button type="text" style={{ color: "white" }}>Profile</Button>
          </Dropdown>
          <Button type="text" style={{ color: "white" }} onClick={() => navigate("/apiui")}>
            API
          </Button>
          <Dropdown overlay={menuDropdown()} trigger={["click"]}>
            <Button type="text" style={{ color: "white" }}>My Plans</Button>
          </Dropdown>
          <Dropdown overlay={menuDropdown()} trigger={["click"]}>
            <Button type="text" style={{ color: "white" }}>Settings</Button>
          </Dropdown>
          <Dropdown overlay={menuDropdown()} trigger={["click"]}>
            <Button type="text" style={{ color: "white" }}>Credits</Button>
          </Dropdown>
          <Avatar size="small" icon={<UserOutlined />} style={{ background: "#52c41a" }} />
          <Avatar size="small" icon={<LockOutlined />} style={{ background: "#1890ff" }} />
          <Avatar size="small" icon={<PoweroffOutlined />} style={{ background: "#ff4d4f" }} />
        </Space>
      </Header>

      <Content style={{ marginTop: 64, padding: 24, background: "#f0f2f5", minHeight: "calc(100vh - 64px)" }}>
        {
          // Render active tab content inside root route
          activeTab === "1" && <VoiceCallForm />
        }
        {activeTab === "2" && <div>Reports Component</div>}
        {activeTab === "3" && <div>Campaign Invoice Component</div>}
        {activeTab === "4" && <div>Reschedule Component</div>}

        {/* Show nested route outlet (for `/api` etc) */}
        <Outlet />
      </Content>
    </Layout>
  );
}
