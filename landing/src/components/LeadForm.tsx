import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";
import { Button } from "./ui/button";
import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDsYrBS4X0C36ThgIfyj-AOcG7pq_oSk7s",
    authDomain: "tipi-ink.firebaseapp.com",
    projectId: "tipi-ink",
    storageBucket: "tipi-ink.appspot.com",
    messagingSenderId: "634165171036",
    appId: "1:634165171036:web:981e4bbbd6e5d568f3e799",
    measurementId: "G-CQ57GQBLGJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app, "europe-west3");

if (window.location.hostname === "localhost") {
    connectFunctionsEmulator(functions, "localhost", 5001);
}

interface LeadFormProps {
    onSuccess?: () => void;
}

export function LeadForm({ onSuccess }: LeadFormProps) {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formSuccess, setFormSuccess] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        weeklyOrders: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "weeklyOrders" ? parseInt(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError(null);

        try {
            // Call the Firebase function
            const createLeadFunction = httpsCallable(functions, "createLead");
            await createLeadFunction(formData);

            setFormSuccess(true);
            setFormData({ name: "", phone: "", weeklyOrders: 10 });
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error submitting form:", error);
            setFormError(t("leadForm.errorMessage"));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (formSuccess) {
        return (
            <div className="bg-green-50 p-6 rounded-lg text-center">
                <h3 className="text-xl font-bold text-green-800 mb-2">{t("leadForm.successTitle")}</h3>
                <p className="text-green-700">{t("leadForm.successMessage")}</p>
                <Button onClick={() => setFormSuccess(false)} variant="default" className="mt-4">
                    {t("leadForm.submitAnother")}
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("leadForm.namePlaceholder")}
                    required
                />
            </div>

            <div className="space-y-2">
                <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t("leadForm.phonePlaceholder")}
                    required
                />
            </div>

            <div className="space-y-2">
                <Select
                    id="weeklyOrders"
                    name="weeklyOrders"
                    value={formData.weeklyOrders}
                    onChange={handleChange}
                    required
                >
                    <option value="0" disabled selected>
                        {t("leadForm.weeklyOrdersPlaceholder")}
                    </option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                    <option value="50">50+</option>
                </Select>
            </div>

            {formError && <div className="text-red-500 text-sm">{formError}</div>}

            <Button type="submit" variant="default" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t("leadForm.submitting") : t("leadForm.submit")}
            </Button>
        </form>
    );
}
