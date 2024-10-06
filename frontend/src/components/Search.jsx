import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import GitHubUser from "./GitHubUser";

const Search = () => {
    const [user, setUser] = useState(null);
    const [searchText, setSearchText] = useState(""); // Search text state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Set how many items to show per page
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false); // Loading state for the search
    const [noUserFound, setNoUserFound] = useState(false); // No user found state
    const [isSearchAttempted, setIsSearchAttempted] = useState(false); // New state for tracking search attempts
    const { getGithubUser } = useAuthStore();

    useEffect(() => {
        axios
            .get("https://api.github.com/users/aansourav")
            .then((res) => {
                setUser(res.data);
                setNoUserFound(false); // Ensure no "user not found" message shows on default user fetch
                const userInfoArray = [
                    { label: "Username", value: res.data.login },
                    { label: "Public Repos", value: res.data.public_repos },
                    { label: "Followers", value: res.data.followers },
                    { label: "Following", value: res.data.following },
                    { label: "Bio", value: res.data.bio },
                    { label: "GitHub URL", value: res.data.html_url },
                    { label: "Blog", value: res.data.blog },
                    { label: "Location", value: res.data.location },
                    {
                        label: "Account Created",
                        value: new Date(res.data.created_at).toDateString(),
                    },
                    {
                        label: "Last Updated",
                        value: new Date(res.data.updated_at).toDateString(),
                    },
                    { label: "Type", value: res.data.type },
                    {
                        label: "Hireable",
                        value: res.data.hireable ? "Yes" : "No",
                    },
                ];
                setTotalPages(Math.ceil(userInfoArray.length / itemsPerPage));
            })
            .catch((error) =>
                console.error("Error fetching user data:", error)
            );
    }, []);

    const handleNextPage = () => {
        setCurrentPage((prevPage) =>
            prevPage < totalPages ? prevPage + 1 : prevPage
        );
    };

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
    };

    const handleSearch = () => {
        setIsLoading(true); // Show loading when searching
        setNoUserFound(false); // Reset no user found state
        setIsSearchAttempted(true); // Mark search as attempted

        getGithubUser(searchText)
            .then((data) => {
                if (data) {
                    setUser(data); // Set user data if found
                    setNoUserFound(false); // No need for 'user not found' message
                } else {
                    setUser(null); // No user data found
                    setNoUserFound(true); // Show 'No user found' message
                }
                setIsLoading(false); // Stop loading once data is fetched
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
                setUser(null);
                setNoUserFound(true); // Show 'No user found' if there's an error
                setIsLoading(false); // Stop loading in case of error
            });
    };

    const handleSearchInputChange = (event) => {
        const value = event.target.value;
        setSearchText(value); // Update search text as user types

        // Clear 'No user found' message if input is cleared
        if (value === "") {
            setNoUserFound(false);
            setIsSearchAttempted(false);
            setUser(null); // Clear user data if input is cleared
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    // Organizing user data into an array for easier pagination
    const userInfoArray = user
        ? [
              { label: "Username", value: user.login },
              { label: "Public Repos", value: user.public_repos },
              { label: "Followers", value: user.followers },
              { label: "Following", value: user.following },
              { label: "Bio", value: user.bio },
              {
                  label: "GitHub URL",
                  value: (
                      <a
                          href={user.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:underline"
                      >
                          {user.html_url}
                      </a>
                  ),
              },
              {
                  label: "Blog",
                  value: (
                      <a
                          href={user.blog}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:underline"
                      >
                          {user.blog}
                      </a>
                  ),
              },
              { label: "Location", value: user.location },
              {
                  label: "Account Created",
                  value: new Date(user.created_at).toDateString(),
              },
              {
                  label: "Last Updated",
                  value: new Date(user.updated_at).toDateString(),
              },
              { label: "Type", value: user.type },
              { label: "Hireable", value: user.hireable ? "Yes" : "No" },
          ]
        : [];

    // Determine the range of data to display for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUserInfo = userInfoArray.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    return (
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
            {/* Search Box */}
            <div className="mb-4 flex items-center space-x-2">
                <input
                    type="text"
                    placeholder="GitHub username"
                    className="w-full px-4 py-2 rounded-lg text-black"
                    value={searchText}
                    onChange={handleSearchInputChange}
                    onKeyPress={handleKeyPress} // Listen for Enter key
                />
                <button
                    onClick={handleSearch}
                    className="bg-emerald-500 px-4 py-2 rounded-lg text-white"
                >
                    Search
                </button>
            </div>

            {/* Loading state */}
            {isLoading && (
                <div className="text-center text-gray-400">Loading...</div>
            )}

            {/* No user found message */}
            {isSearchAttempted && noUserFound && (
                <div className="text-center text-red-400">
                    No user found for {searchText}
                </div>
            )}

            {/* User info display */}
            {user && (
                <GitHubUser
                    user={user}
                    paginatedUserInfo={paginatedUserInfo}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handleNextPage={handleNextPage}
                    handlePreviousPage={handlePreviousPage}
                />
            )}
        </div>
    );
};

export default Search;
