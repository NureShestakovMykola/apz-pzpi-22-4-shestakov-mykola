import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../api";
import { useTranslation } from "react-i18next";
import RegisterDeviceModal from "../components/RegisterDeviceModal";
import './DeviceListPage.css'; // Importing CSS for this page

export default function DeviceListPage() {
    const { t } = useTranslation();
    const [devices, setDevices] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const fetchDevices = async () => {
        if (!token) {
            navigate("/login");
        }

        const res = await apiGet("device/all", token);

        if (res.ok) {
            const data = await res.json();
            setDevices(data.data);
        }
    };

    useEffect(() => {
        fetchDevices();
    }, []);

    const handleRegisterSubmit = async (deviceData) => {
        if (!token) {
            navigate("/login");
        }

        const res = await apiPost("device/create", deviceData, token);
        if (res.ok) {
            const data = await res.json();
            const id = data.data;
            navigate(`/devices/${id}`);
        }
    };

    return (
        <div className="device-list-container">
            <h1 className="page-title">{t("deviceList.title")}</h1>
            <button className="register-button" onClick={() => setShowModal(true)}>
                {t("deviceList.registerButton")}
            </button>
            <ul className="device-list">
                {devices.map((device) => (
                    <li key={device.id} className="device-item">
                        <Link to={`/devices/${device.id}`} className="device-link">
                            {device.name}
                        </Link>
                    </li>
                ))}
            </ul>

            {showModal && (
                <RegisterDeviceModal
                    onClose={() => setShowModal(false)}
                    onSubmit={handleRegisterSubmit}
                />
            )}
        </div>
    );
}