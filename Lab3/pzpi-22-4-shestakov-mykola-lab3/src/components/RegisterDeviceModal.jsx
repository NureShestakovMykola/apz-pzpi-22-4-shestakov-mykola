import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./RegisterDeviceModal.css";

export default function RegisterDeviceModal({ onClose, onSubmit }) {
    const { t } = useTranslation();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, description });
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{t("registerDevice.title")}</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">{t("form.name")}</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <label htmlFor="description">{t("form.description")}</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />

                    <div className="modal-buttons">
                        <button type="button" onClick={onClose}>{t("button.cancel")}</button>
                        <button type="submit">{t("button.submit")}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}