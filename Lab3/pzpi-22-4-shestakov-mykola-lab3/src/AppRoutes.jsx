import { Routes, Route, useLocation } from "react-router-dom";
import AuthHeader from "./components/AuthHeader";
import MainHeader from "./components/MainHeader";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import DeviceListPage from "./pages/DeviceListPage";
import DeviceDetailPage from "./pages/DeviceDetailPage";
import EditDevicePage from "./pages/EditDevicePage";
import AccountPage from "./pages/AccountPage";
import EditAccountPage from "./pages/EditAccountPage";
import NotificationsPage from "./pages/NotificationsPage";

export default function AppRoutes() {
    const location = useLocation();
    const isAuthPage = ["/login", "/register"].includes(location.pathname);

    return (
        <>
            {isAuthPage ? <AuthHeader /> : <MainHeader />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/devices" element={<DeviceListPage />} />
                <Route path="/devices/:id" element={<DeviceDetailPage />} />
                <Route path="/devices/:id/edit" element={<EditDevicePage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/account/edit" element={<EditAccountPage />} />
                <Route path="/notifications" element={<NotificationsPage /> } />
            </Routes>
        </>
    );
}