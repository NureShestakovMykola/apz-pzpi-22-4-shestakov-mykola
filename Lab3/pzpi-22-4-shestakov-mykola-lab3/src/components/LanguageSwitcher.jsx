import React from "react";
import i18n from "../i18n";

export default function LanguageSwitcher() {
    const handleLanguageChange = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <select onChange={handleLanguageChange} value={i18n.language}>
            <option value="en">English</option>
            <option value="uk">Українська</option>
        </select>
    );
}