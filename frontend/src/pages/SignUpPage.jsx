import { motion } from "framer-motion";
import { Loader, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
    // State for form inputs
    const [name, setName] = useState("");
    const [familyName, setFamilyName] = useState(""); // Family Name
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // Confirm Password
    const [language, setLanguage] = useState(""); // Language
    const [errors, setErrors] = useState({}); // Error handling state

    const navigate = useNavigate();
    const { signup, error, isLoading } = useAuthStore();

    // List of common languages for the select field
    const languages = [
        "English",
        "Bangla",
        "French",
        "German",
        "Chinese",
        "Arabic",
        "Hindi",
    ];

    // Validation logic
    const validateForm = () => {
        let formErrors = {};

        if (!name.trim()) formErrors.name = "Name is required";
        if (!familyName.trim())
            formErrors.familyName = "Family Name is required";
        if (!email.trim()) formErrors.email = "Email is required";
        if (!password) formErrors.password = "Password is required";
        if (password !== confirmPassword)
            formErrors.confirmPassword = "Passwords do not match";
        if (!language) formErrors.language = "Please select a language";

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSignUp = async (e) => {
        console.log(email, password, name, familyName, language);
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await signup(email, password, name, familyName, language);
            navigate("/verify-email");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
        >
            <div className="px-8 py-2">
                <h2 className="text-3xl font-bold mb-3 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                    Create Account
                </h2>

                <form onSubmit={handleSignUp}>
                    {/* Name Input */}
                    {errors.name && (
                        <p className="text-red-500 font-semibold py-1">
                            {errors.name}
                        </p>
                    )}
                    <Input
                        icon={User}
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    {/* Family Name Input */}
                    {errors.familyName && (
                        <p className="text-red-500 font-semibold py-1">
                            {errors.familyName}
                        </p>
                    )}
                    <Input
                        icon={User}
                        type="text"
                        placeholder="Family Name"
                        value={familyName}
                        onChange={(e) => setFamilyName(e.target.value)}
                    />

                    {/* Email Input */}
                    {errors.email && (
                        <p className="text-red-500 font-semibold py-1">
                            {errors.email}
                        </p>
                    )}

                    <Input
                        icon={Mail}
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {/* Password Input */}
                    {errors.password && (
                        <p className="text-red-500 font-semibold py-1">
                            {errors.password}
                        </p>
                    )}
                    <Input
                        icon={Lock}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* Confirm Password Input */}
                    {errors.confirmPassword && (
                        <p className="text-red-500 font-semibold py-1">
                            {errors.confirmPassword}
                        </p>
                    )}
                    <Input
                        icon={Lock}
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {/* Password Strength Meter below Confirm Password */}
                    <PasswordStrengthMeter password={password} />

                    {/* Language Select */}
                    <div className="my-2">
                        <select
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            <option value="" disabled>
                                Select Language
                            </option>
                            {languages.map((lang, idx) => (
                                <option key={idx} value={lang}>
                                    {lang}
                                </option>
                            ))}
                        </select>
                        {errors.language && (
                            <p className="text-red-500 font-semibold py-1">
                                {errors.language}
                            </p>
                        )}
                    </div>

                    {error && (
                        <p className="text-red-500 font-bold py-3 text-center">
                            {error}
                        </p>
                    )}

                    {/* Submit Button */}
                    <motion.button
                        className="my-1 w-full py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader
                                className="animate-spin mx-auto"
                                size={24}
                            />
                        ) : (
                            "Sign Up"
                        )}
                    </motion.button>
                </form>
            </div>
            <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
                <p className="text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link
                        to={"/login"}
                        className="text-green-400 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </motion.div>
    );
};

export default SignUpPage;
