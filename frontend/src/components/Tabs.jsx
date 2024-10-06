import Profile from "./Profile";
import Search from "./Search";

const Tabs = ({ activeTab, setActiveTab }) => {
    return (
        <div className="fixed top-20 w-full max-w-md mx-auto">
            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-8 border-b border-gray-700">
                <button
                    onClick={() => setActiveTab("profile")}
                    className={`py-2 px-4 ${
                        activeTab === "profile"
                            ? "text-emerald-500 border-b-2 border-emerald-500"
                            : "text-gray-400"
                    }`}
                >
                    User Profile
                </button>
                <button
                    onClick={() => setActiveTab("search")}
                    className={`py-2 px-4 ${
                        activeTab === "search"
                            ? "text-emerald-500 border-b-2 border-emerald-500"
                            : "text-gray-400"
                    }`}
                >
                    GitHub Search
                </button>
            </div>

            {/* Tab Content with consistent height */}
            <div className="min-h-[400px]">
                {" "}
                {/* Set min-height to a consistent value */}
                {activeTab === "profile" ? <Profile /> : <Search />}
            </div>
        </div>
    );
};

export default Tabs;
