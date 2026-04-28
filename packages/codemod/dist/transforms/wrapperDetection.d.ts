export interface WrapperMap {
    [wrapperName: string]: string;
}
export declare function buildWrapperMap(files: string[]): WrapperMap;
export declare function flagWrapperUsages(source: string, wrapperMap: WrapperMap): {
    code: string;
    changed: boolean;
    flagged: string[];
};
//# sourceMappingURL=wrapperDetection.d.ts.map