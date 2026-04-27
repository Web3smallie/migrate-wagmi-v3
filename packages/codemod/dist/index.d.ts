export interface MigrationResult {
    file: string;
    changes: string[];
    todos: string[];
}
export declare function migrate(targetPath: string): Promise<MigrationResult[]>;
//# sourceMappingURL=index.d.ts.map