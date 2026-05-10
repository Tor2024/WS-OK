// api/github.js
// Core logic for committing changes to GitHub via the Contents API

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.GITHUB_REPO_OWNER || "okcompany";
const REPO_NAME = process.env.GITHUB_REPO_NAME || "web-studio";
const BRANCH = process.env.GITHUB_REPO_BRANCH || "main";

async function ghFetch(path, init = {}) {
    if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN is not configured in Environment Variables");
    
    const res = await fetch(`https://api.github.com${path}`, {
        ...init,
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "StudioTerminal-CMS",
            ...(init.headers || {}),
        },
    });
    return res;
}

async function getContent(path) {
    const res = await ghFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(BRANCH)}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GitHub GET error: ${res.status}`);
    return res.json();
}

export async function writeFile({ path, content, message, isBinary = false }) {
    const data = await getContent(path);
    const sha = data ? data.sha : null;
    
    const base64 = isBinary 
        ? Buffer.from(content).toString("base64")
        : Buffer.from(content, "utf-8").toString("base64");

    const res = await ghFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodeURIComponent(path)}`, {
        method: "PUT",
        body: JSON.stringify({
            message: message || "cms: update content",
            content: base64,
            branch: BRANCH,
            sha: sha
        })
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`GitHub PUT error: ${res.status} - ${errorText}`);
    }
    return res.json();
}

export async function deleteFile({ path, message }) {
    const data = await getContent(path);
    if (!data) return false;

    const res = await ghFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodeURIComponent(path)}`, {
        method: "DELETE",
        body: JSON.stringify({
            message: message || "cms: delete content",
            sha: data.sha,
            branch: BRANCH
        })
    });

    return res.ok;
}
