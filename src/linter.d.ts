export interface LinterProblem {
    code: string;
    error: string;
    location: Location;
}

export interface Location {
    start: Position;
    end: Position;
}

export interface Position {
    line: number;
    column: number;
}

declare function lint(json: string): LinterProblem[];
export default lint;
