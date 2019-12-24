import {
    createConnection,
    ProposedFeatures,
    TextDocuments,
    TextDocument,
    Diagnostic,
    DiagnosticSeverity,
    DidChangeConfigurationParams
} from "vscode-languageserver";
import { basename } from "path";
import { ExampleConfiguration, Severity, RuleCodes } from "./configuration";
import lint, { LinterProblem } from "./linter";

const conn = createConnection(ProposedFeatures.all);
const docs = new TextDocuments();
let conf: ExampleConfiguration | undefined = undefined;

conn.onInitialize(() => {
    return {
        capabilities: {
            // TODO Возможно нужно другое значение или оно должно браться из каких-то настроек.
            textDocumentSync: 1
        }
    };
});

function getSeverity(code: string): DiagnosticSeverity | undefined {
    if (!conf || !conf.severity) {
        return undefined;
    }
    const key = RuleCodes[code];
    if (!key) {
        return undefined;
    }
    const severity: Severity = conf.severity[key];

    switch (severity) {
        case Severity.Error:
            return DiagnosticSeverity.Error;
        case Severity.Warning:
            return DiagnosticSeverity.Warning;
        case Severity.Information:
            return DiagnosticSeverity.Information;
        case Severity.Hint:
            return DiagnosticSeverity.Hint;
        default:
            return undefined;
    }
}

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
    const source = basename(textDocument.uri);
    const json = textDocument.getText();

    const diagnostics: Diagnostic[] = lint(json).reduce(
        (list: Diagnostic[], problem: LinterProblem): Diagnostic[] => {
            const severity = getSeverity(problem.code);
            if (severity) {
                const diagnostic: Diagnostic = {
                    range: {
                        start: {
                            line: problem.location.start.line - 1,
                            character: problem.location.start.column - 1
                        },
                        end: {
                            line: problem.location.end.line - 1,
                            character: problem.location.end.column - 1
                        }
                    },
                    severity,
                    message: problem.error,
                    source
                };

                list.push(diagnostic);
            }

            return list;
        },
        []
    );

    conn.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

async function validateAll(): Promise<void> {
    for (const document of docs.all()) {
        await validateTextDocument(document);
    }
}

docs.onDidChangeContent(change => {
    validateTextDocument(change.document);
});

conn.onDidChangeConfiguration(({ settings }: DidChangeConfigurationParams) => {
    conf = settings.example;
    validateAll();
});

docs.listen(conn);
conn.listen();
