import React, { useEffect, useState } from "react";
import { apiGet } from "../api"; // adjust the path as needed
import { useTranslation } from "react-i18next";
import "./ScheduleModal.css";

export default function ScheduleListModal({ onClose, onSelect, onCreateNew }) {
    const { t } = useTranslation();
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        const fetchSchedules = async () => {
            const token = localStorage.getItem("token");
            const res = await apiGet("schedule/all", token);
            if (res.ok) {
                const data = await res.json();
                setSchedules(data.data || []);
            }
        }

        fetchSchedules();
    }, []);

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3 className="modal-title">{t("schedule.selectTitle")}</h3>
                <div className="schedules-list">
                    {schedules.map(s => (
                        <button type="button" className="schedule-button" key={s.id} onClick={() => onSelect(s)}>
                            {s.name}
                        </button>
                    ))}
                </div>
                <div className="modal-buttons">
                    <button type="button" onClick={onCreateNew}>
                        {t("button.createNewSchedule")}
                    </button>
                    <button type="button" onClick={onClose}>
                        {t("button.close")}
                    </button>
                </div>
            </div>
        </div>
    );
};