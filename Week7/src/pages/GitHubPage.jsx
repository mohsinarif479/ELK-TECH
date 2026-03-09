import { useState } from "react";
import { fetchGitHubUser } from "../services/githubApi";

function GitHubPage() {
  const [username, setUsername] = useState("octocat");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await fetchGitHubUser(username.trim());
      setUserData(data);
    } catch (apiError) {
      setUserData(null);
      setError(apiError.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>GitHub API Integration</h2>
      <form onSubmit={handleSearch} className="card">
        <label htmlFor="username">GitHub Username</label>
        <input
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Enter username"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Fetch User"}
        </button>
      </form>

      {error && (
        <div className="error-box">
          <p>{error}</p>
          <button onClick={handleSearch}>Retry</button>
        </div>
      )}

      {userData && (
        <article className="card">
          <img src={userData.avatar_url} alt={userData.login} width="80" height="80" />
          <p>
            <strong>{userData.name || userData.login}</strong>
          </p>
          <p>Public repos: {userData.public_repos}</p>
          <a href={userData.html_url} target="_blank" rel="noreferrer">
            View profile
          </a>
        </article>
      )}
    </section>
  );
}

export default GitHubPage;
