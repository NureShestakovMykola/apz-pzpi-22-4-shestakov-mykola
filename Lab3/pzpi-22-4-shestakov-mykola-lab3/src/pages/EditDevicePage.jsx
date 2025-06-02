import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiGet, apiPut, apiPost } from "../api"; // Ensure multipart POST is supported
import { useTranslation } from "react-i18next";
import "./EditDevicePage.css";
import ScheduleListModal from "../components/ScheduleListModal";
import CreateScheduleModal from "../components/CreateScheduleModal";

export default function EditDevicePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { t } = useTranslation();

    const [showScheduleListModal, setShowScheduleListModal] = useState(false);
    const [showCreateScheduleModal, setShowCreateScheduleModal] = useState(false);
    const [device, setDevice] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [automaticWatering, setAutomaticWatering] = useState(null);
    const [schedule, setSchedule] = useState(null);


    useEffect(() => {
        const fetchImage = async () => {
            const res = await apiGet(`Device/${id}/image`, token);
            if (res.ok) {
                const blob = await res.blob();
                setImagePreview(URL.createObjectURL(blob));
            }
        };

        const fetchDevice = async () => {
            if (!token) {
                navigate("/login");
            }

            const res = await apiGet(`device/${id}`, token);
            if (res.ok) {
                const data = await res.json();
                setDevice(data.data);
                setAutomaticWatering(data.data.automaticWatering)

                if (data.data.imageExtension) {
                    fetchImage();
                }

                if (data.data.scheduleId) {
                    fetchSchedule(data.data.scheduleId);
                }
            }
        };

        fetchDevice();
    }, [id]);

    const fetchSchedule = async (scheduleId) => {
        const token = localStorage.getItem("token");
        const res = await apiGet(`schedule/${scheduleId}`, token);
        if (res.ok) {
            const data = await res.json();
            setSchedule(data.data);
        }
    }

    const openScheduleListModal = () => {
        setShowScheduleListModal(true);
    };

    const closeScheduleListModal = () => {
        setShowScheduleListModal(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDevice(prev => ({ ...prev, [name]: value }));
    };

    const handleAutomaticWateringChange = (e) => {
        setAutomaticWatering(!automaticWatering);
    }

    const handleScheduleSelect = (schedule) => {
        setSchedule(schedule);
        setDevice(prev => ({ ...prev, scheduleId: schedule.id }));
        closeScheduleListModal();
    };

    const handleCreateNewSchedule = () => {
        setShowScheduleListModal(false);
        setShowCreateScheduleModal(true);
    }

    const closeCreateScheduleModal = () => {
        setShowCreateScheduleModal(false);
        setShowScheduleListModal(true);
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleCreateSchedule = async (scheduleData) => {
        if (!token) {
            navigate("/login");
        }

        const sanitizedData = {
            ...scheduleData,
            duration: parseInt(scheduleData.duration),
            scheduleType: parseInt(scheduleData.scheduleType),
            daysGap: scheduleData.daysGap === "" ? null : parseInt(scheduleData.daysGap),
            days: scheduleData.days
        };

        console.log(sanitizedData);
        const res = await apiPost("schedule/create", sanitizedData, token);
        if (res.ok) {
            const data = await res.json();
            const scheduleId = data.data;
            setDevice(prev => ({ ...prev, scheduleId: scheduleId }));
            setShowCreateScheduleModal(false);
            fetchSchedule(scheduleId);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            navigate("/login");
        }

        const formData = new FormData();
        formData.append("Id", device.id);
        formData.append("Name", device.name);
        formData.append("Description", device.description);
        formData.append("CriticalMinMoisture", device.criticalMinMoisture);
        formData.append("CriticalMaxMoisture", device.criticalMaxMoisture);
        formData.append("CriticalMinTemperature", device.criticalMinTemperature);
        formData.append("CriticalMaxTemperature", device.criticalMaxTemperature);
        formData.append("ScheduleId", device.scheduleId ?? "");
        formData.append("AutomaticWatering", automaticWatering);

        if (imageFile) {
            formData.append("NewImage", imageFile);
        }

        const res = await apiPut("device/edit", formData, token);
        if (res.ok) {
            navigate(`/devices/${id}`);
        }
    };

    if (!device) return <div>Loading...</div>;

    return (
        <div className="edit-device-container">
            <h2>{t("editDevice.title")}</h2>
            <form onSubmit={handleSubmit} className="edit-device-form">
                <label>{t("editDevice.name")}</label>
                <input name="name" value={device.name} onChange={handleChange} required />

                <label>{t("editDevice.description")}</label>
                <textarea name="description" value={device.description} onChange={handleChange} required />

                <label>{t("editDevice.criticalMoisture")}</label>
                <div className="inline-inputs">
                    <input type="number" name="criticalMinMoisture" value={device.criticalMinMoisture} onChange={handleChange} required />
                    <input type="number" name="criticalMaxMoisture" value={device.criticalMaxMoisture} onChange={handleChange} required />
                </div>

                <label>{t("editDevice.criticalTemperature")}</label>
                <div className="inline-inputs">
                    <input type="number" name="criticalMinTemperature" value={device.criticalMinTemperature} onChange={handleChange} required />
                    <input type="number" name="criticalMaxTemperature" value={device.criticalMaxTemperature} onChange={handleChange} required />
                </div>

                <div className="edit-device-schedule">
                    <button
                        type="button"
                        onClick={handleAutomaticWateringChange}
                        className="edit-device-schedule-button"
                    >
                        {automaticWatering ? t("editDevice.turnAutoWateringOff") : t("editDevice.turnAutoWateringOn")}
                    </button>

                    {automaticWatering && (
                        <div className="schedule-info">
                            {schedule ? (
                                <div>
                                    <p><strong>{t("editDevice.schedule")}:</strong> {schedule.name}</p>
                                    <p>{schedule.description}</p>
                                    <p>{t("editDevice.scheduleDuration")}: {schedule.duration} min</p>
                                    <p>{t("editDevice.scheduleTime")}: {new Date(schedule.wateringTime).toLocaleTimeString()}</p>
                                    <p>{t("editDevice.scheduleType")}: {schedule.scheduleType}</p>
                                    {schedule.daysGap && <p>{t("editDevice.scheduleGap")}: {schedule.daysGap}</p>}
                                    {schedule.days?.length > 0 && (
                                        <p>{t("editDevice.scheduleDays")}: {schedule.days.join(", ")}</p>
                                    )}
                                </div>
                            ) : (
                                <p>{t("editDevice.noSchedule")}</p>
                            )}

                            <button type="button" onClick={openScheduleListModal}>
                                {t("editDevice.chooseSchedule")}
                            </button>
                        </div>
                    )}
                </div>

                <label>{t("editDevice.newImage")}</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />

                <div className="image-preview">
                    {imagePreview && <img src={imagePreview} className="preview-img" />}
                </div>

                <div className="action-buttons">
                    <button type="submit" className="action-button">
                        {t("editDevice.saveChanges")}
                    </button>
                    <Link to={`/devices/${device.id}`} className="action-button">
                        {t("editDevice.cancel")}
                    </Link>
                </div>
                
            </form>

            {showScheduleListModal && (
                <ScheduleListModal
                    onClose={closeScheduleListModal}
                    onSelect={handleScheduleSelect}
                    onCreateNew={handleCreateNewSchedule}
                />
            )}
            {showCreateScheduleModal && (
                <CreateScheduleModal
                    onClose={closeCreateScheduleModal}
                    onCreate={handleCreateSchedule}
                />
            )}
        </div>
    );
}