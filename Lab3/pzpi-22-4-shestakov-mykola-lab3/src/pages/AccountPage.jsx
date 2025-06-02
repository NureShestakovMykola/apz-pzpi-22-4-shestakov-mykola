import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../api"; // Adjust this path if needed
import { useTranslation } from "react-i18next";
import "./AccountPage.css";
import defaultProfile from "../assets/default-profile.png"; // fallback image
import ChangePasswordModal from "../components/ChangePasswordModal";

export default function AccountPage() {
    const { t } = useTranslation();
    const [user, setUser] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [showChangePasswordModal, setShowPasswordChangeModal] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchUser = async () => {
            const res = await apiGet("appUser/current-user", token); // your API endpoint
            if (res.ok) {
                const data = await res.json();
                setUser(data.data);
            }
        };

        const fetchImage = async () => {
            const res = await apiGet(`appUser/image`, token);
            if (res.ok) {
                const blob = await res.blob();
                setImageUrl(URL.createObjectURL(blob));
            }
        }

        fetchUser();
        fetchImage();
    }, []);

    const logout = async () => {
        if (!token) {
            navigate("/login");
            return;
        }

        const res = await apiPost("appUser/logout", null, token);
        if (res.ok) {
            localStorage.removeItem("token");
            navigate("/login");
        }
    }

    if (!user) return <div>{t("loading")}</div>;

    return (
        <div className="account-page">
            <h2>{t("account.accountInformation")}</h2>

            <div className="profile-section">
                <img
                    src={imageUrl || defaultProfile}
                    alt="Profile"
                    className="profile-image"
                />
                <div className="profile-info">
                    <p><strong>{t("account.name")}:</strong> {user.name}</p>
                    <p><strong>{t("account.surname")}:</strong> {user.surname}</p>
                    <p><strong>{t("account.email")}:</strong> {user.email}</p>
                </div>
            </div>

            <div className="account-buttons">
                <button onClick={() => navigate("/account/edit")}>{t("button.editAccount")}</button>
                <button onClick={() => setShowPasswordChangeModal(true)}>{t("button.changePassword")}</button>
                <button onClick={logout}>{t("button.logout")}</button>
            </div>

            {showChangePasswordModal && <ChangePasswordModal
                onClose={() => setShowPasswordChangeModal(false)}
            />}
        </div>
    );
}