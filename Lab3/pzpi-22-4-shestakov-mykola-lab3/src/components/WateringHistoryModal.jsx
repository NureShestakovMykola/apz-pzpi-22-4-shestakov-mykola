import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { apiGet } from "../api"; // your API helper
import "./RegisterDeviceModal.css";
import "./WateringHistoryModal.css";
export default function WateringHistoryModal({ onClose, deviceId }) {
    const { t } = useTranslation();
    const [wateringDates, setWateringDates] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");

            const res = await apiGet("device/watering-data", token, {
                deviceId: deviceId
            });
            if (res.ok) {
                const data = await res.json();
                setWateringDates(data.data);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="modal-overlay">
            <div className="modal-content-chart">
                <h2>{t("device.wateringHistory")}</h2>
                <div className="watering-list">
                    {wateringDates.length === 0 ? (
                        <p>No waterings found.</p>
                    ) : (
                        <ul>
                            {wateringDates.map((dt, index) => (
                                <li key={index}>{new Date(dt).toLocaleString()}</li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="modal-buttons">
                    <button type="button" onClick={onClose}>{t("button.close")}</button>
                </div>
            </div>
        </div>
    );
}