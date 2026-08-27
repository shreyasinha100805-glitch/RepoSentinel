/**
 * Input Validators for RepoSentinel
 */

function validateGitHubUrl(url) {
    if (!url || typeof url !== 'string') return false;
    return Boolean(parseGitHubRepo(url));
}

function parseGitHubRepo(url) {
    if (!url || typeof url !== 'string') return null;

    try {
        const parsed = new URL(url.trim());
        const hostname = parsed.hostname.toLowerCase();
        if (hostname !== 'github.com' && hostname !== 'www.github.com') return null;

        const [owner, rawRepo] = parsed.pathname.split('/').filter(Boolean);
        if (!owner || !rawRepo) return null;

        const repo = rawRepo.replace(/\.git$/i, '');
        const validName = /^[a-zA-Z0-9._-]+$/;
        if (!validName.test(owner) || !validName.test(repo)) return null;

        return { owner, repo };
    } catch (err) {
        return null;
    }
}

module.exports = {
    validateGitHubUrl,
    parseGitHubRepo
};
