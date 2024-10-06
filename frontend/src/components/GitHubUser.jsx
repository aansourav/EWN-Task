/* eslint-disable react/prop-types */

const GitHubUser = ({
    user,
    paginatedUserInfo,
    currentPage,
    totalPages,
    handleNextPage,
    handlePreviousPage,
}) => {
    return (
        <>
            {" "}
            {/* Avatar and Name */}
            <div className="text-center">
                <img
                    className="w-24 h-24 rounded-full mx-auto border-4 border-emerald-500"
                    src={user.avatar_url}
                    alt="User Avatar"
                />
                <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
                <p className="text-gray-400">{user.location}</p>
            </div>
            {/* Pagination Content */}
            <div className="mt-6">
                {paginatedUserInfo.map((info, index) => (
                    <p key={index}>
                        <strong>{info.label}:</strong> {info.value}
                    </p>
                ))}
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-between mt-6">
                <button
                    onClick={handlePreviousPage}
                    className={`py-2 px-4 bg-gray-700 rounded-lg ${
                        currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <button
                    onClick={handleNextPage}
                    className={`py-2 px-4 bg-gray-700 rounded-lg ${
                        currentPage === totalPages
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                    }`}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </>
    );
};

export default GitHubUser;
