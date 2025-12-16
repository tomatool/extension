import {
    createConnection,
    TextDocuments,
    InitializeResult,
    Diagnostic,
    TextDocumentPositionParams,
    CompletionItem,
    Range,
    Position,
    DocumentFormattingParams,
    TextEdit,
    DocumentRangeFormattingParams,
    FormattingOptions,
    Location,
    ProposedFeatures,
    InitializeParams,
    DidChangeConfigurationNotification,
    TextDocumentSyncKind,
    DocumentDiagnosticReportKind,
    DocumentDiagnosticReport,
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { format, clearText } from './format';
import StepsHandler from './steps.handler';
import { clearGherkinComments } from './util';
import { Settings } from './types';

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;

// Object, which contains current configuration
let globalSettings: Settings | undefined;
// Elements handlers
let stepsHandler: StepsHandler;

connection.onInitialize((params: InitializeParams) => {
    const capabilities = params.capabilities;

    // Does the client support the `workspace/configuration` request?
    // If not, we fall back using global settings.
    hasConfigurationCapability = !!(
        capabilities.workspace && !!capabilities.workspace.configuration
    );
    hasWorkspaceFolderCapability = !!(
        capabilities.workspace && !!capabilities.workspace.workspaceFolders
    );

    const result: InitializeResult = {
        capabilities: {
            // Full text sync mode
            textDocumentSync: TextDocumentSyncKind.Full,
            //Completion will be triggered after every character pressing
            completionProvider: {
                resolveProvider: true,
            },
            diagnosticProvider: {
                interFileDependencies: false,
                workspaceDiagnostics: false
            },
            definitionProvider: true,
            documentFormattingProvider: true,
            documentRangeFormattingProvider: true,
            documentOnTypeFormattingProvider: {
                firstTriggerCharacter: ' ',
                moreTriggerCharacter: ['@', '#', ':'],
            },
        },
    };
    if (hasWorkspaceFolderCapability) {
        result.capabilities.workspace = {
            workspaceFolders: {
                supported: true
            }
        };
    }
    return result;
});

connection.onInitialized(() => {
    if (hasConfigurationCapability) {
        // Register for all configuration changes.
        connection.client.register(DidChangeConfigurationNotification.type, undefined);
    }
    if (hasWorkspaceFolderCapability) {
        connection.workspace.onDidChangeWorkspaceFolders(_event => {
            connection.console.log('Workspace folder change event received.');
        });
    }

    // Initialize the steps handler with hardcoded tomato steps
    initStepsHandler();
});

async function getSettings(forceReset?: boolean) {
    if (!globalSettings || forceReset) {
        const baseSettings = await connection.workspace.getConfiguration({
            section: 'tomato'
        });
        globalSettings = getSettingsFromBase(baseSettings);
    }
    return globalSettings;
}

function getSettingsFromBase(baseSettings: Partial<Settings>): Settings {
    return {
        steps: [], // Not used - steps are hardcoded
        pages: {}, // Not used
        formatConfOverride: baseSettings.formatConfOverride || {},
        onTypeFormat: baseSettings.onTypeFormat || false,
        skipDocStringsFormat: baseSettings.skipDocStringsFormat || false,
    };
}

async function initStepsHandler() {
    const settings: Settings = {
        steps: [],
        pages: {},
    };
    stepsHandler = new StepsHandler(settings);

    // Try to load steps dynamically from tomato CLI
    try {
        await stepsHandler.loadDynamicSteps();
        connection.console.log('Tomato steps loaded successfully');
    } catch (err) {
        connection.console.error(`Failed to load dynamic steps: ${err}`);
    }
}

async function revalidateAllDocuments() {
    connection.languages.diagnostics.refresh();
}

connection.onDidChangeConfiguration(async () => {
    await getSettings(true);
    revalidateAllDocuments();
});

documents.onDidOpen(async () => {
    if (!stepsHandler) {
        initStepsHandler();
    }
});

connection.onCompletion(
    async (position: TextDocumentPositionParams) => {
        const textDocument = documents.get(position.textDocument.uri);
        const text = textDocument?.getText() || '';
        const line = text.split(/\r?\n/g)[position.position.line];

        if (stepsHandler) {
            return stepsHandler.getCompletion(line, position.position.line, text);
        }
        return null;
    }
);

connection.onCompletionResolve((item: CompletionItem) => {
    if (stepsHandler && ~item.data.indexOf('step')) {
        return stepsHandler.getCompletionResolve(item);
    }
    return item;
});

function validate(text: string) {
    return text.split(/\r?\n/g).reduce((res, line, i) => {
        let diagnostic;
        if (stepsHandler && (diagnostic = stepsHandler.validate(line, i, text))) {
            res.push(diagnostic);
        }
        return res;
    }, [] as Diagnostic[]);
}

connection.languages.diagnostics.on(async (params) => {
    const document = documents.get(params.textDocument.uri);
    if (document !== undefined) {
        const text = document.getText();
        const diagnostics = validate(clearGherkinComments(text));
        return {
            kind: DocumentDiagnosticReportKind.Full,
            items: diagnostics,
        } satisfies DocumentDiagnosticReport;
    } else {
        // We don't know the document. We can either try to read it from disk
        // or we don't report problems for it.
        return {
            kind: DocumentDiagnosticReportKind.Full,
            items: []
        } satisfies DocumentDiagnosticReport;
    }
});

connection.onDefinition(async (position: TextDocumentPositionParams) => {
    const textDocument = documents.get(position.textDocument.uri);
    const text = textDocument?.getText() || '';
    const line = text.split(/\r?\n/g)[position.position.line];
    const pos = position.position;
    const { uri } = position.textDocument;

    if (stepsHandler) {
        return stepsHandler.getDefinition(line, text);
    }
    return Location.create(uri, Range.create(pos, pos));
});

function getIndent(options: FormattingOptions) {
    const { insertSpaces, tabSize } = options;
    return insertSpaces ? ' '.repeat(tabSize) : '\t';
}

connection.onDocumentFormatting(
    async (params: DocumentFormattingParams) => {
        const settings = await getSettings();
        const textDocument = documents.get(params.textDocument.uri);
        const text = textDocument?.getText() || '';
        const textArr = text.split(/\r?\n/g);
        const indent = getIndent(params.options);
        const range = Range.create(
            Position.create(0, 0),
            Position.create(textArr.length - 1, textArr[textArr.length - 1].length)
        );
        const formattedText = format(indent, text, settings);
        const clearedText = clearText(formattedText);
        return [TextEdit.replace(range, clearedText)];
    }
);

connection.onDocumentRangeFormatting(
    async (params: DocumentRangeFormattingParams) => {
        const settings = await getSettings();
        const textDocument = documents.get(params.textDocument.uri);
        const text = textDocument?.getText() || '';
        const textArr = text.split(/\r?\n/g);
        const range = params.range;
        const indent = getIndent(params.options);
        const finalRange = Range.create(
            Position.create(range.start.line, 0),
            Position.create(range.end.line, textArr[range.end.line].length)
        );
        const finalText = textArr
            .splice(
                finalRange.start.line,
                finalRange.end.line - finalRange.start.line + 1
            )
            .join('\r\n');
        const formattedText = format(indent, finalText, settings);
        const clearedText = clearText(formattedText);
        return [TextEdit.replace(finalRange, clearedText)];
    }
);

connection.onDocumentOnTypeFormatting(
    async (params: DocumentFormattingParams) => {
        const settings = await getSettings();
        if (settings.onTypeFormat === true) {
            const textDocument = documents.get(params.textDocument.uri);
            const text = textDocument?.getText() || '';
            const textArr = text.split(/\r?\n/g);
            const indent = getIndent(params.options);
            const range = Range.create(
                Position.create(0, 0),
                Position.create(textArr.length - 1, textArr[textArr.length - 1].length)
            );
            const formattedText = format(indent, text, settings);
            return [TextEdit.replace(range, formattedText)];
        } else {
            return [];
        }
    }
);

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
