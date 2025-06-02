import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function AuthHeader() {
    const { t } = useTranslation();

    return (
        <header className="header">
            <h1 className="app-name">{t("auth.appName")}</h1>
            <nav className="nav-links">
                <LanguageSwitcher/>
                <Link to="/login">{t("auth.login")}</Link>
                <Link to="/register">{t("auth.register")}</Link>
            </nav>
        </header>
    );
}