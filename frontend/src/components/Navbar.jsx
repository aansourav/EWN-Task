import { LogIn, LogOut, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Navbar = () => {
    const { user, logout } = useAuthStore();

    return (
        <header className="px-20 fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
            <div className="container mx-auto px-4 py-3">
                <div className="flex flex-wrap justify-between items-center">
                    <Link
                        to="/"
                        className="text-2xl font-bold text-emerald-400 items-center space-x-2 flex"
                    >
                        EWN
                    </Link>

                    <nav className="flex flex-wrap items-center gap-4">
                        <Link
                            to={"/"}
                            className="text-gray-300 hover:text-emerald-400 transition duration-300
					 ease-in-out"
                        >
                            Profile
                        </Link>

                        {user ? (
                            <button
                                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
						rounded-md flex items-center transition duration-300 ease-in-out"
                                onClick={logout}
                            >
                                <LogOut size={18} />
                                <span className="hidden sm:inline ml-2">
                                    Signout
                                </span>
                            </button>
                        ) : (
                            <>
                                <Link
                                    to={"/signup"}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
                                >
                                    <UserPlus className="mr-2" size={18} />
                                    Signup
                                </Link>
                                <Link
                                    to={"/login"}
                                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
                                >
                                    <LogIn className="mr-2" size={18} />
                                    Signin
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};
export default Navbar;
