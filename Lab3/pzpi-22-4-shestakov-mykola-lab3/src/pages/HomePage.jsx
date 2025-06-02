import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function HomePage() {
    const { t } = useTranslation();
    const [msg, setMsg] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setMsg(t("home.unauthorized"));
        }
    }, [t]);

    return (
        <div style={{ padding: 20 }}>
            <h2>{t("home.welcome")}</h2>
            <p>{msg}</p>
        </div>
    );
}