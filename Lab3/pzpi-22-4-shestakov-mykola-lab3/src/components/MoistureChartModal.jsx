import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { apiGet } from "../api"; // your API helper
import "./RegisterDeviceModal.css";
import "./MoistureChartModal.css";

export default function MoistureChartModal({ onClose, deviceId }) {
    const { t } = useTranslation();
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");

            const res = await apiGet("device/moisture-data", token, {
                deviceId: deviceId,
                logsCount: 10
            });
            if (res.ok) {
                const rawData = await res.json();
                const parsed = rawData.data.map(item => ({
                    time: new Date(item.logDateTime).toLocaleTimeString(),
                    moisture: item.moisture
                }));
                setData(parsed);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="modal-overlay">
            <div className="modal-content-chart">
                <h2>{t("device.moistureChartTitle")}</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="moisture" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
                <div className="modal-buttons">
                    <button type="button" onClick={onClose}>{t("button.close")}</button>
                </div>
            </div>
        </div>
    );
}