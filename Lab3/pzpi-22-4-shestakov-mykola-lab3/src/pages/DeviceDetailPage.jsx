import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiGet } from "../api";
import { useTranslation } from "react-i18next";
import './DeviceDetailPage.css'; // Importing CSS for this page
import MoistureChartModal from "../components/MoistureChartModal";
import WateringHistoryModal from "../components/WateringHistoryModal";

export default function DeviceDetailPage() {
    const { t } = useTranslation();
    const { id } = useParams();  // Get the device ID from the URL
    const [device, setDevice] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [showWateringHistoryModal, setShowWateringHistoryModal] = useState(false);
    const [showMoistureChartModal, setShowMoistureChartModal] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchImage = async () => {
            const res = await apiGet(`Device/${id}/image`, token);
            if (res.ok) {
                const blob = await res.blob();
                setImageUrl(URL.createObjectURL(blob));
            }
        };

        const fetchDeviceDetails = async () => {
            if (!token) {
                const navigate = useNavigate();
                navigate("/login");
            }

            const res = await apiGet(`device/${id}`, token);

            if (res.ok) {
                const data = await res.json();
                console.log("Data:", data);
                setDevice(data.data);

                if (data.data.imageExtension != null) {
                    fetchImage();
                }
            }
        };

        fetchDeviceDetails();
    }, [id]);

    if (!device) return <div>{t("loading")}</div>;

    return (
        <div className="device-detail-container">
            <h1 className="device-name">{device.name}</h1>

            <div className="device-details">
                <div className="device-image">
                    {imageUrl ? (
                        <img src={imageUrl} alt={device.name} className="image" />
                    ) : (
                        <div className="no-image">{t("device.noImage")}</div>
                    )}
                </div>

                <div className="device-info">
                    <p><strong>{t("device.description")}:</strong> {device.description || t("device.noDescription")}</p>
                    <p><strong>{t("device.automaticWatering")}:</strong> {device.automaticWatering ? t("device.enabled") : t("device.disabled")}</p>
                    <p><strong>{t("device.currentMoisture")}:</strong> {device.currentMoisture}</p>
                    <p><strong>{t("device.currentTemperature")}:</strong> {device.currentTemperature}</p>
                    <p><strong>{t("device.waterLevel")}:</strong> {device.waterLevel}</p>
                    <p><strong>{t("device.lastWatering")}:</strong> {device.lastWatering ? new Date(device.lastWatering).toLocaleString() : t("device.notAvailable")}</p>
                </div>
            </div>

            <div className="action-buttons">
                <Link to={`/devices/${device.id}/edit`} className="action-button">
                    {t("button.edit")}
                </Link>
                <button className="action-button" onClick={() => setShowWateringHistoryModal(true)}>{t("button.wateringHistory")}</button>
                <button className="action-button" onClick={() => setShowMoistureChartModal(true)}>{t("button.soilMoistureHistory")}</button>
            </div>

            {showMoistureChartModal && <MoistureChartModal
                onClose={() => setShowMoistureChartModal(false)}
                deviceId={id}
            />}
            {showWateringHistoryModal && <WateringHistoryModal
                onClose={() => setShowWateringHistoryModal(false)}
                deviceId={id}
            />}
        </div>
    );
}