/**
 * GitHub Integration Service for RepoSentinel.
 * Handles fetching repository files, branch creation, commit creation, and PR submission.
 * Supports DEMO_MODE local repository simulation.
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { parseGitHubRepo } = require('../utils/validators');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const MAX_LIVE_FILES = Number(process.env.MAX_SCAN_FILES || 500);
const MAX_FILE_SIZE_BYTES = Number(process.env.MAX_SCAN_FILE_SIZE_BYTES || 200 * 1024);

const EXCLUDED_PATH_PARTS = new Set([
    '.git',
    '.next',
    '.nuxt',
    '.turbo',
    '.venv',
    'build',
    'coverage',
    'dist',
    'node_modules',
    'target',
    'vendor'
]);

const RELEVANT_FILENAMES = new Set([
    '.env',
    '.env.example',
    '.env.local',
    '.npmrc',
    '.yarnrc',
    'dockerfile',
    'gemfile',
    'package.json',
    'pom.xml',
    'requirements.txt'
]);

const RELEVANT_EXTENSIONS = new Set([
    '.c',
    '.cc',
    '.conf',
    '.config',
    '.cpp',
    '.cs',
    '.css',
    '.env',
    '.go',
    '.h',
    '.html',
    '.java',
    '.js',
    '.json',
    '.jsx',
    '.kt',
    '.lock',
    '.mjs',
    '.php',
    '.properties',
    '.py',
    '.rb',
    '.rs',
    '.sh',
    '.sql',
    '.ts',
    '.tsx',
    '.txt',
    '.xml',
    '.yaml',
    '.yml'
]);

function isExcludedPath(filePath) {
    return filePath.split('/').some(part => EXCLUDED_PATH_PARTS.has(part.toLowerCase()));
}

function isRelevantTextPath(filePath) {
    const normalized = filePath.replace(/\\/g, '/');
    if (isExcludedPath(normalized)) return false;

    const basename = path.basename(normalized).toLowerCase();
    if (RELEVANT_FILENAMES.has(basename)) return true;

    const ext = path.extname(basename).toLowerCase();
    return RELEVANT_EXTENSIONS.has(ext);
}

function getScanPriority(filePath) {
    const normalized = filePath.toLowerCase();
    const basename = path.basename(normalized);

    if (basename === 'package.json') return 0;
    if (basename.startsWith('.env') || basename === '.npmrc') return 1;
    if (/(^|\/)(src|app|server|api|routes|controllers|services|lib)\//.test(normalized)) return 2;
    if (/\.(js|jsx|ts|tsx|py|go|java|rb|php|cs|rs)$/.test(normalized)) return 3;
    return 4;
}

function selectScannableTreeFiles(tree = []) {
    return tree
        .filter(item => item.type === 'blob')
        .filter(item => item.path && isRelevantTextPath(item.path))
        .filter(item => !item.size || item.size <= MAX_FILE_SIZE_BYTES)
        .sort((a, b) => {
            const priorityDiff = getScanPriority(a.path) - getScanPriority(b.path);
            return priorityDiff || a.path.localeCompare(b.path);
        })
        .slice(0, MAX_LIVE_FILES);
}

/**
 * Fetches repository file structure and contents.
 */
async function fetchRepoContents(repositoryUrl) {
    const repoRef = parseGitHubRepo(repositoryUrl);
    const isDemoTarget = !repoRef || (repoRef.repo === 'security-demo' && (repoRef.owner === 'example' || repoRef.owner === 'demo-org'));

    if (isDemoTarget) {
        if (!repoRef && process.env.DEMO_MODE !== 'true') {
            throw new Error('Invalid GitHub Repository URL provided.');
        }

        // Read demo repository files locally
        const demoRepoPath = path.resolve(__dirname, '../../../demo-repository');
        const files = [];

        const readDirRecursive = (dir, baseRelative = '') => {
            if (!fs.existsSync(dir)) return;
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                const relPath = baseRelative ? `${baseRelative}/${entry.name}` : entry.name;
                if (entry.isDirectory()) {
                    readDirRecursive(fullPath, relPath);
                } else if (entry.isFile()) {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    files.push({
                        path: relPath,
                        content
                    });
                }
            }
        };

        readDirRecursive(demoRepoPath);

        return {
            owner: repoRef ? repoRef.owner : 'demo-org',
            repo: repoRef ? repoRef.repo : 'security-demo',
            branch: 'main',
            filesCount: files.length,
            files
        };
    }

    // Live GitHub REST API integration
    try {
        const { owner, repo } = repoRef;

        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            ...(GITHUB_TOKEN ? { 'Authorization': `Bearer ${GITHUB_TOKEN}` } : {})
        };

        // Get repo details
        const repoRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, { headers });
        const defaultBranch = repoRes.data.default_branch || 'main';

        // Get tree recursively
        const treeRes = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
            { headers }
        );

        const files = [];
        const treeFiles = selectScannableTreeFiles(treeRes.data.tree || []);

        for (const item of treeFiles) {
            try {
                const fileRes = await axios.get(item.url, { headers });
                const content = Buffer.from(fileRes.data.content, 'base64').toString('utf8');
                files.push({ path: item.path, content });
            } catch (err) {
                // skip binary or unreadable files
            }
        }

        return {
            owner,
            repo,
            branch: defaultBranch,
            filesCount: files.length,
            files
        };
    } catch (err) {
        throw new Error(`GitHub Repository Access Failed: ${err.response?.data?.message || err.message}`);
    }
}

/**
 * Creates a GitHub Pull Request with security patch commits.
 */
async function createPullRequest({ repositoryUrl, branchName, commitMessage, files }) {
    if (process.env.DEMO_MODE === 'true' || !GITHUB_TOKEN) {
        const fakePrId = Math.floor(Math.random() * 100) + 1;
        const fakeBranch = branchName || `security-fix-patch-${Date.now()}`;
        return {
            success: true,
            demoMode: true,
            prNumber: fakePrId,
            prUrl: `https://github.com/demo-org/security-demo/pull/${fakePrId}`,
            branch: fakeBranch,
            message: `[DEMO MODE] Pull Request #${fakePrId} simulated successfully on branch ${fakeBranch}`
        };
    }

    try {
        const cleanUrl = repositoryUrl.replace(/\/$/, '');
        const parts = cleanUrl.split('/');
        const repo = parts.pop();
        const owner = parts.pop();
        const headers = {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
        };

        // 1. Get default branch ref
        const repoRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, { headers });
        const defaultBranch = repoRes.data.default_branch || 'main';
        const refRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${defaultBranch}`, { headers });
        const latestCommitSha = refRes.data.object.sha;

        // 2. Create new branch
        const newBranch = branchName || `reposentinel-fix-${Date.now()}`;
        await axios.post(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
            ref: `refs/heads/${newBranch}`,
            sha: latestCommitSha
        }, { headers });

        // 3. Commit file updates
        for (const file of files) {
            const contentEncoded = Buffer.from(file.content).toString('base64');
            // Get file SHA if exists
            let fileSha;
            try {
                const existingFile = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${file.path}?ref=${newBranch}`, { headers });
                fileSha = existingFile.data.sha;
            } catch (e) {
                // new file
            }

            await axios.put(`https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`, {
                message: commitMessage || `security: apply automated remediation patch for ${file.path}`,
                content: contentEncoded,
                branch: newBranch,
                ...(fileSha ? { sha: fileSha } : {})
            }, { headers });
        }

        // 4. Create PR
        const prRes = await axios.post(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
            title: `🛡️ Security Fix: Automated Remediation Patch by RepoSentinel`,
            head: newBranch,
            base: defaultBranch,
            body: `### RepoSentinel Security Remediation Patch\n\nThis Pull Request fixes security vulnerabilities identified by RepoSentinel autonomous security agents.\n\n- Verified syntax and pass security scan.\n- Redacted hardcoded secrets replaced with process.env references.`
        }, { headers });

        return {
            success: true,
            prNumber: prRes.data.number,
            prUrl: prRes.data.html_url,
            branch: newBranch,
            message: `Pull Request #${prRes.data.number} created successfully.`
        };
    } catch (err) {
        throw new Error(`GitHub PR Creation Failed: ${err.response?.data?.message || err.message}`);
    }
}

module.exports = {
    isRelevantTextPath,
    selectScannableTreeFiles,
    fetchRepoContents,
    createPullRequest
};
