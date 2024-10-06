import { useState } from "react";
import Navbar from "../components/Navbar";
import Tabs from "../components/Tabs";

// Dummy Search Component

const HomePage = () => {
    // State to manage active tab
    const [activeTab, setActiveTab] = useState("profile"); // 'profile' tab is active by default

    return (
        <>
            <Navbar />
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </>
    );
};

export default HomePage;
