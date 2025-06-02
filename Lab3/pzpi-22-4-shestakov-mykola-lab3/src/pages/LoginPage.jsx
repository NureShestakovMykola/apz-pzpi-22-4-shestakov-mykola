import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../api";
import { useTranslation } from "react-i18next";
import "./Auth.css";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await apiPost("appuser/login", form);
        if (res.ok) {
            const data = await res.json();
            localStorage.setItem("token", data.data);
            navigate("/home");
        } else {
            const message = await res.text();
            setError(message || t("login.failed"));
        }
    };

    return (
        <div className="auth-component">
            <h2>{t("login.title")}</h2>
            <form className="auth-form" onSubmit={handleSubmit}>
                <input name="email" placeholder={t("login.email")} onChange={handleChange} /><br />
                <input name="password" type="password" placeholder={t("login.password")} onChange={handleChange} /><br />
                <div className="button-wrapper">
                    <button type="submit">{t("login.button")}</button>
                </div>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <p>
                {t("login.noAccount")} <a href="/register">{t("login.registerLink")}</a>
            </p>
        </div>
    );
}