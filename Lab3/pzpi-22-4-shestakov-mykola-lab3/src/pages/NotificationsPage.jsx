import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { apiGet } from "../api";
import "./NotificationsPage.css";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            const res = await apiGet("notification/all", token);
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.data);
            }
        };
        fetchData();
    }, []);

    const renderText = (notification) => {
        const created = new Date(notification.created).toLocaleString();

        switch (notification.type) {
            case 0:
                return `${created} - ${t("notifications.advice")}: ${notification.adviceText}`;
            case 1:
                return t("notifications.watered", {
                    created,
                    deviceName: notification.deviceName
                });
            case 2:
                return t("notifications.lowWater", {
                    created,
                    deviceName: notification.deviceName,
                    value: notification.value
                });
            case 3:
                const { value, deviceName, deviceCriticalMinTemperature, deviceCriticalMaxTemperature } = notification;
                return t("notifications.temperatureAlert", {
                    created,
                    deviceName,
                    value,
                    min: deviceCriticalMinTemperature,
                    max: deviceCriticalMaxTemperature
                });
            default:
                return `${created} - ${t("notifications.unknown")}`;
        }
    };

    return (
        <div className="notifications-container">
            <h2>{t("notifications.title")}</h2>
            {notifications.length === 0 ? (
                <p>{t("notifications.empty")}</p>
            ) : (
                <ul className="notification-list">
                    {notifications.map(n => (
                        <li key={n.id} className="notification-item">
                            {renderText(n)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}