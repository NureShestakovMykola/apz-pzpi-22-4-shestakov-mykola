import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPut } from "../api";
import { useTranslation } from "react-i18next";
import "./EditAccountPage.css";

export default function EditAccountPage() {
    const { t } = useTranslation();
    const [user, setUser] = useState({ name: "", surname: "" });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchUser = async () => {
            const res = await apiGet("appUser/current-user", token);
            if (res.ok) {
                const data = await res.json();
                setUser({ name: data.data.name, surname: data.data.surname });
            }
        };

        const fetchImage = async () => {
            const res = await apiGet(`appUser/image`, token);
            if (res.ok) {
                const blob = await res.blob();
                setImagePreview(URL.createObjectURL(blob));
            }
        }

        fetchUser();
        fetchImage();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("Name", user.name);
        formData.append("Surname", user.surname);
        if (imageFile) {
            formData.append("NewImage", imageFile);
        }

        const res = await apiPut("appUser/edit", formData, token); // This should send multipart/form-data
        if (res.ok) {
            navigate("/account");
        } else {
            alert(t("editAccount.updateFailed"));
        }
    };

    return (
        <div className="edit-account-container">
            <h2>{t("editAccount.title")}</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="edit-account-form">
                <label>{t("editAccount.nameLabel")}:</label>
                <input
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    required
                />

                <label>{t("editAccount.surnameLabel")}:</label>
                <input
                    type="text"
                    value={user.surname}
                    onChange={(e) => setUser({ ...user, surname: e.target.value })}
                    required
                />

                <label>{t("editAccount.newImageLabel")}</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />

                <div className="image-preview">
                    {imagePreview && (
                        <img src={imagePreview} className="preview-img" alt="Preview" />
                    )}
                </div>

                <div className="action-buttons">
                    <button type="submit">{t("editAccount.saveButton")}</button>
                    <button type="button" onClick={() => navigate("/account")}>{t("editAccount.cancelButton")}</button>
                </div>
            </form>
        </div>
    );
}