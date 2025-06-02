import { useState } from "react";
import { useTranslation } from "react-i18next";
import { apiPost } from "../api";
import "./RegisterDeviceModal.css";

export default function ChangePasswordModal({ onClose }) {
    const { t } = useTranslation();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        handleChangePassword({ oldPassword, newPassword });
    };

    const handleChangePassword = async (formData) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const res = await apiPost("appUser/change-password", formData, token);
        if (res.ok) {
            setMessage(t("changePassword.success"));
            setOldPassword("");
            setNewPassword("");
        } else {
            const error = await res.text();
            setMessage(error || t("changePassword.error"));
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{t("changePassword.title")}</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="oldPassword">{t("changePassword.oldPassword")}</label>
                    <input
                        id="oldPassword"
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />

                    <label htmlFor="newPassword">{t("changePassword.newPassword")}</label>
                    <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />

                    {message && <div className="message">{message}</div>}

                    <div className="modal-buttons">
                        <button type="button" onClick={onClose}>{t("changePassword.cancel")}</button>
                        <button type="submit">{t("changePassword.confirm")}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}