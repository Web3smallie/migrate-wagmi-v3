import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";

export interface AutoPROptions {
  repoUrl: string;
  githubToken: string;
  branchName: string;
  commitMessage: string;
  prTitle: string;
  prBody: string;
  targetPath: string;
}

function execCommand(command: string, cwd: string): string {
  try {
    return execSync(command, { cwd, encoding: "utf-8", stdio: "pipe" });
  } catch (error: any) {
    throw new Error(`Command failed: ${command}\n${error.message}`);
  }
}

function parseRepoUrl(url: string): { owner: string; repo: string } {
  const match = url.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
  if (!match) throw new Error(`Invalid GitHub URL: ${url}`);
  return { owner: match[1], repo: match[2].replace(".git", "") };
}

function githubRequest(
  method: string,
  endpoint: string,
  token: string,
  body?: object
): Promise<any> {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : undefined;
    const options = {
      hostname: "api.github.com",
      path: endpoint,
      method,
      headers: {
        Authorization: `token ${token}`,
        "User-Agent": "migrate-wagmi-v3",
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v3+json",
        ...(data ? { "Content-Length": Buffer.byteLength(data) } : {}),
      },
    };

    const req = https.request(options, (res) => {
      let responseData = "";
      res.on("data", (chunk) => (responseData += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(responseData));
        } catch {
          resolve(responseData);
        }
      });
    });

    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

export async function autoPR(options: AutoPROptions): Promise<string> {
  const { repoUrl, githubToken, branchName, commitMessage, prTitle, prBody, targetPath } = options;
  const { owner, repo } = parseRepoUrl(repoUrl);

  console.log(`\n🤖 Auto PR Generator`);
  console.log(`📦 Repo: ${owner}/${repo}`);

  // Step 1: Fork the repo
  console.log(`\n1️⃣  Forking ${owner}/${repo}...`);
  const fork = await githubRequest("POST", `/repos/${owner}/${repo}/forks`, githubToken);
  const forkOwner = fork.owner?.login;
  const forkUrl = fork.clone_url;

  if (!forkOwner || !forkUrl) {
    throw new Error("Failed to fork repository");
  }

  // Wait for fork to be ready
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Step 2: Clone the fork
  console.log(`2️⃣  Cloning fork...`);
  const cloneDir = path.join(targetPath, `_auto_pr_${repo}`);
  if (fs.existsSync(cloneDir)) {
    fs.rmSync(cloneDir, { recursive: true, force: true });
  }
  execCommand(`git clone --depth=1 ${forkUrl} ${cloneDir}`, targetPath);

  // Step 3: Create branch
  console.log(`3️⃣  Creating branch ${branchName}...`);
  execCommand(`git checkout -b ${branchName}`, cloneDir);

  // Step 4: Run the codemod
  console.log(`4️⃣  Running codemod...`);
  const { migrate } = require("./index");
  const summary = await migrate(cloneDir, false);

  if (summary.totalFiles === 0) {
    console.log(`✅ No patterns found in ${owner}/${repo} — skipping PR`);
    fs.rmSync(cloneDir, { recursive: true, force: true });
    return "No changes needed";
  }

  console.log(`   Found ${summary.totalFiles} files to migrate`);

  // Step 5: Commit changes
  console.log(`5️⃣  Committing changes...`);
  execCommand(`git config user.email "angela.chukuwike@gmail.com"`, cloneDir);
  execCommand(`git config user.name "web3smallie"`, cloneDir);
  execCommand(`git add .`, cloneDir);
  execCommand(`git commit -m "${commitMessage}"`, cloneDir);

  // Step 6: Push to fork
  console.log(`6️⃣  Pushing to fork...`);
  const authUrl = forkUrl.replace("https://", `https://${githubToken}@`);
  execCommand(`git push ${authUrl} ${branchName}`, cloneDir);

  // Step 7: Open PR
  console.log(`7️⃣  Opening PR...`);
  const pr = await githubRequest(
    "POST",
    `/repos/${owner}/${repo}/pulls`,
    githubToken,
    {
      title: prTitle,
      body: prBody,
      head: `${forkOwner}:${branchName}`,
      base: "main",
    }
  );

  // Cleanup
  fs.rmSync(cloneDir, { recursive: true, force: true });

  const prUrl = pr.html_url;
  console.log(`\n✅ PR opened: ${prUrl}\n`);
  return prUrl;
}