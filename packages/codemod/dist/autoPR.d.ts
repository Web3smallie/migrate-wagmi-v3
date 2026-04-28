export interface AutoPROptions {
    repoUrl: string;
    githubToken: string;
    branchName: string;
    commitMessage: string;
    prTitle: string;
    prBody: string;
    targetPath: string;
}
export declare function autoPR(options: AutoPROptions): Promise<string>;
//# sourceMappingURL=autoPR.d.ts.map