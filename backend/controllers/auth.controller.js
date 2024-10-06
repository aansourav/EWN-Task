import bcryptjs from "bcryptjs";
import crypto from "crypto";

import {
    sendPasswordResetEmail,
    sendResetSuccessEmail,
    sendVerificationEmail,
    sendWelcomeEmail,
} from "../mailtrap/emails.js";
import GithubUser from "../models/githubUser.model.js";
import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

export const signup = async (req, res) => {
    const { email, password, name, familyName, language } = req.body;

    try {
        if (!email || !password || !name || !familyName || !language) {
            throw new Error("All fields are required");
        }
        const userAlreadyExists = await User.findOne({ email });
        console.log("userAlreadyExists", userAlreadyExists);

        if (userAlreadyExists) {
            return res
                .status(400)
                .json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            familyName,
            language,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        await user.save();

        // jwt
        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code",
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.log("error in verifyEmail ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// export const login = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res
//                 .status(400)
//                 .json({ success: false, message: "Invalid credentials" });
//         }
//         const isPasswordValid = await bcryptjs.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res
//                 .status(400)
//                 .json({ success: false, message: "Invalid credentials" });
//         }

//         generateTokenAndSetCookie(res, user._id);

//         user.lastLogin = new Date();
//         await user.save();

//         res.status(200).json({
//             success: true,
//             message: "Logged in successfully",
//             user: {
//                 ...user._doc,
//                 password: undefined,
//             },
//         });
//     } catch (error) {
//         console.log("Error in login ", error);
//         res.status(400).json({ success: false, message: error.message });
//     }
// };

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid credentials" });
        }

        // User can log in regardless of verification status
        generateTokenAndSetCookie(res, user._id);

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Check verification status and send appropriate response
        if (!user.isVerified) {
            return res.status(200).json({
                success: true,
                message: "Login successful, but email not verified",
                user: {
                    ...user._doc,
                    password: undefined,
                },
                isVerified: false, // Indicating that the user is not verified
            });
        }

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
            isVerified: true, // User is verified
        });
    } catch (error) {
        console.log("Error in login ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        // send email
        await sendPasswordResetEmail(
            user.email,
            `${process.env.CLIENT_URL}/reset-password/${resetToken}`
        );

        res.status(200).json({
            success: true,
            message: "Password reset link sent to your email",
        });
    } catch (error) {
        console.log("Error in forgotPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token",
            });
        }

        // update password
        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({
            success: true,
            message: "Password reset successful",
        });
    } catch (error) {
        console.log("Error in resetPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Error in checkAuth ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getGithubUser = async (req, res) => {
    const { username } = req.params;
    console.log(username);
    try {
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        // First, try to find the user in the database
        let githubUser = await GithubUser.findOne({ login: username });

        if (githubUser) {
            return res.status(200).json(githubUser);
        }

        // If not found in the database, fetch from GitHub API
        const response = await fetch(
            `https://api.github.com/users/${username}`
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const userData = await response.json();

        // Create a new GithubUser document
        githubUser = new GithubUser({
            login: userData.login,
            id: userData.id,
            node_id: userData.node_id,
            avatar_url: userData.avatar_url,
            gravatar_id: userData.gravatar_id,
            url: userData.url,
            html_url: userData.html_url,
            followers_url: userData.followers_url,
            following_url: userData.following_url,
            gists_url: userData.gists_url,
            starred_url: userData.starred_url,
            subscriptions_url: userData.subscriptions_url,
            organizations_url: userData.organizations_url,
            repos_url: userData.repos_url,
            events_url: userData.events_url,
            received_events_url: userData.received_events_url,
            type: userData.type,
            site_admin: userData.site_admin,
            name: userData.name,
            company: userData.company,
            blog: userData.blog,
            location: userData.location,
            email: userData.email,
            hireable: userData.hireable,
            bio: userData.bio,
            twitter_username: userData.twitter_username,
            public_repos: userData.public_repos,
            public_gists: userData.public_gists,
            followers: userData.followers,
            following: userData.following,
            created_at: userData.created_at,
            updated_at: userData.updated_at,
        });

        // Save the new user to the database
        await githubUser.save();

        res.status(200).json(githubUser);
    } catch (error) {
        console.error("Error fetching GitHub user:", error);
        res.status(404).json({
            message: "Error fetching GitHub user for " + username,
            error: error.message,
        });
    }
};
