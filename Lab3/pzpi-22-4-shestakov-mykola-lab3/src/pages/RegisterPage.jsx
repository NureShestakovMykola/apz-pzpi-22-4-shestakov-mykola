import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiPost } from "../api";
import "./Auth.css";

export default function RegisterPage() {
    const { t } = useTranslation();
    const [form, setForm] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        repeatPassword: ""
    });

    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await apiPost("appUser/register", form);
        if (res.ok) {
            const data = await res.json();
            localStorage.setItem("token", data.data);
            navigate("/home");
        } else {
            const message = await res.text();
            setError(message || t("register.errorDefault"));
        }
    };

    return (
        <div className="auth-component">
            <h2>{t("register.title")}</h2>
            <form className="auth-form" onSubmit={handleSubmit}>
                <input name="name" placeholder={t("register.name")} onChange={handleChange} /><br />
                <input name="surname" placeholder={t("register.surname")} onChange={handleChange} /><br />
                <input name="email" placeholder={t("register.email")} type="email" onChange={handleChange} /><br />
                <input name="password" placeholder={t("register.password")} type="password" onChange={handleChange} /><br />
                <input name="repeatPassword" placeholder={t("register.repeatPassword")} type="password" onChange={handleChange} /><br />
                <div className="button-wrapper">
                    <button type="submit">{t("register.button")}</button>
                </div>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <p>
                {t("register.haveAccount")} <a href="/login">{t("register.loginLink")}</a>
            </p>
        </div>
    );
}