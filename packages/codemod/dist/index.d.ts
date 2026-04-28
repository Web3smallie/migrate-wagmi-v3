export interface MigrationResult {
    file: string;
    changes: string[];
    todos: string[];
    patternsDetected: number;
}
export interface MigrationSummary {
    results: MigrationResult[];
    totalFiles: number;
    totalChanges: number;
    totalTodos: number;
    totalPatternsDetected: number;
    coveragePercent: number;
}
export declare function migrate(targetPath: string, dryRun?: boolean): Promise<MigrationSummary>;
//# sourceMappingURL=index.d.ts.map