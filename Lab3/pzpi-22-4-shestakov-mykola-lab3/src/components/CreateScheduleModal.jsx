import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./ScheduleModal.css";

export default function CreateScheduleModal({ onClose, onCreate }) {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        duration: 0,
        wateringTime: "",
        scheduleType: 0,
        daysGap: "",
        days: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDaysChange = (e) => {
        const selected = [...formData.days];
        const day = parseInt(e.target.value);

        if (e.target.checked) {
            if (!selected.includes(day)) selected.push(day);
        } else {
            const index = selected.indexOf(day);
            if (index > -1) selected.splice(index, 1);
        }

        setFormData(prev => ({ ...prev, days: selected }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        onCreate(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{t("schedule.createTitle")}</h2>
                <form onSubmit={handleSubmit} className="create-schedule-form">
                    <label>{t("schedule.name")}</label>
                    <input name="name" value={formData.name} onChange={handleChange} required />

                    <label>{t("schedule.description")}</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} />

                    <label>{t("schedule.duration")}</label>
                    <input type="number" name="duration" value={formData.duration} onChange={handleChange} required />

                    <label>{t("schedule.wateringTime")}</label>
                    <input type="datetime-local" name="wateringTime" value={formData.wateringTime} onChange={handleChange} required />

                    <label>{t("schedule.scheduleType")}</label>
                    <select name="scheduleType" value={formData.scheduleType} onChange={handleChange}>
                        <option value={0}>{t("schedule.type.daily")}</option>
                        <option value={1}>{t("schedule.type.interval")}</option>
                        <option value={2}>{t("schedule.type.daysOfWeek")}</option>
                    </select>

                    {parseInt(formData.scheduleType) === 1 && (
                        <>
                            <label>{t("schedule.daysGap")}</label>
                            <input type="number" name="daysGap" value={formData.daysGap} onChange={handleChange} />
                        </>
                    )}

                    {parseInt(formData.scheduleType) === 2 && (
                        <>
                            <label>{t("schedule.selectDays")}</label>
                            <div className="checkbox-group">
                                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                                    <div className="checkbox-item" key={index}>
                                        <input
                                            type="checkbox"
                                            id={`day-${index}`}
                                            value={index}
                                            checked={formData.days.includes(index)}
                                            onChange={handleDaysChange}
                                        />
                                        <label htmlFor={`day-${index}`}>
                                            {t(`days.${day.toLowerCase()}`)}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    <div className="modal-buttons">
                        <button type="submit">{t("common.create")}</button>
                        <button type="button" onClick={onClose}>{t("common.cancel")}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}