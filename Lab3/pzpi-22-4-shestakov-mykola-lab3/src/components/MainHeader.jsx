import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiGet } from "../api";
import LanguageSwitcher from "./LanguageSwitcher";
import "./Header.css";

export default function MainHeader() {
    const [user, setUser] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (!token) {
            navigate("/");
        }

        const fetchUser = async () => {
            const res = await apiGet("appuser/current-user", token);
            if (res.ok) {
                const data = await res.json();
                setUser(data.data);
            } else {
                navigate("/");
            }
        };

        const fetchImage = async () => {
            const res = await apiGet("appuser/image", token);
            if (res.ok) {
                const blob = await res.blob();
                setImageUrl(URL.createObjectURL(blob));
            }
        };

        fetchUser();
        fetchImage();
    }, []);

    return (
        <header className="header">
            <h1 className="app-name">{t("appName")}</h1>
            <nav className="nav-links">
                <LanguageSwitcher />
                <Link to="/devices">{t("nav.devices")}</Link>
                <Link to="/notifications">{t("nav.notifications")}</Link>
                {user && (
                    <Link to="/account" className="user-profile">
                        {imageUrl ? (
                            <img src={imageUrl} alt={t("alt.profile")} className="profile-img" />
                        ) : (
                            <div className="profile-placeholder">{user.name[0]}</div>
                        )}
                        <span>{user.name} {user.surname}</span>
                    </Link>
                )}
            </nav>
        </header>
    );
}