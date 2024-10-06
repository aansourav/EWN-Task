import mongoose from "mongoose";

const githubUserSchema = new mongoose.Schema(
    {
        login: { type: String, required: true, unique: true },
        id: { type: Number, required: true, unique: true },
        node_id: { type: String },
        avatar_url: { type: String },
        gravatar_id: { type: String },
        url: { type: String },
        html_url: { type: String },
        followers_url: { type: String },
        following_url: { type: String },
        gists_url: { type: String },
        starred_url: { type: String },
        subscriptions_url: { type: String },
        organizations_url: { type: String },
        repos_url: { type: String },
        events_url: { type: String },
        received_events_url: { type: String },
        type: { type: String },
        site_admin: { type: Boolean },
        name: { type: String },
        company: { type: String },
        blog: { type: String },
        location: { type: String },
        email: { type: String },
        hireable: { type: Boolean },
        bio: { type: String },
        twitter_username: { type: String },
        public_repos: { type: Number },
        public_gists: { type: Number },
        followers: { type: Number },
        following: { type: Number },
        created_at: { type: Date },
        updated_at: { type: Date },
    },
    { collection: "github_users" }
);

const GithubUser = mongoose.model("GithubUser", githubUserSchema);

export default GithubUser;
