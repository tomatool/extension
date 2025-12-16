import {
    Definition,
    CompletionItem,
    Diagnostic,
    DiagnosticSeverity,
    Position,
    Location,
    Range,
    CompletionItemKind,
    InsertTextFormat,
} from 'vscode-languageserver';

import {
    getMD5Id,
    getSortPrefix,
} from './util';

import {
    allGherkinWords,
    GherkinType,
    getGherkinType,
    getGherkinTypeLower,
} from './gherkin';

import { Settings } from './types';
import { TOMATO_STEPS, TomatoStepDefinition } from './tomato-steps';
import { loadStepsFromTomato, TomatoStepDefinition as DynamicStepDef } from './tomato-loader';

export type Step = {
    id: string;
    reg: RegExp;
    partialReg: RegExp;
    text: string;
    displayText: string;
    desc: string;
    def: Definition;
    count: number;
    gherkin: GherkinType;
    documentation: string;
    category: string;
};

export type StepsCountHash = {
    [step: string]: number;
};

export default class StepsHandler {
    elements: Step[] = [];

    elementsHash: { [step: string]: boolean } = {};

    elemenstCountHash: StepsCountHash = {};

    settings: Settings;

    private stepsLoaded: boolean = false;

    constructor(settings: Settings) {
        this.settings = settings;
        // Load hardcoded steps initially (sync)
        this.populateFromHardcodedSteps();
    }

    /**
     * Load steps dynamically from tomato CLI
     * Call this after construction to load from CLI
     */
    async loadDynamicSteps(): Promise<void> {
        if (this.stepsLoaded) return;

        try {
            const dynamicSteps = await loadStepsFromTomato();
            if (dynamicSteps.length > 0) {
                console.log(`Loaded ${dynamicSteps.length} steps from tomato CLI`);
                this.populateFromDynamicSteps(dynamicSteps);
                this.stepsLoaded = true;
            } else {
                console.log('No steps from tomato CLI, using hardcoded steps');
            }
        } catch (err) {
            console.error('Failed to load dynamic steps:', err);
        }
    }

    /**
     * Force reload steps from tomato CLI
     */
    async reloadSteps(): Promise<void> {
        this.stepsLoaded = false;
        await this.loadDynamicSteps();
    }

    getGherkinRegEx() {
        return new RegExp(`^(\\s*)(${allGherkinWords})(\\s+)(.*)`);
    }

    getElements(): Step[] {
        return this.elements;
    }

    incrementElementCount(id: string): void {
        if (this.elemenstCountHash[id]) {
            this.elemenstCountHash[id]++;
        } else {
            this.elemenstCountHash[id] = 1;
        }
    }

    getElementCount(id: string): number {
        return this.elemenstCountHash[id] || 0;
    }

    getOutlineVars(text: string) {
        return text.split(/\r?\n/g).reduce((res, a, i, arr) => {
            if (a.match(/^\s*Examples:\s*$/) && arr[i + 2]) {
                const names = arr[i + 1].split(/\s*\|\s*/).slice(1, -1);
                const values = arr[i + 2].split(/\s*\|\s*/).slice(1, -1);
                names.forEach((n, i) => {
                    if (values[i]) {
                        res[n] = values[i];
                    }
                });
            }
            return res;
        }, {} as Record<string, string>);
    }

    getGherkinMatch(line: string, document: string) {
        const outlineMatch = line.match(/<.*?>/g);
        if (outlineMatch) {
            const outlineVars = this.getOutlineVars(document);
            const pureLine = outlineMatch
                .map((s) => s.replace(/<|>/g, ''))
                .reduce((resLine, key) => {
                    if (outlineVars[key]) {
                        resLine = resLine.replace(`<${key}>`, outlineVars[key]);
                    }
                    return resLine;
                }, line);
            const quotesLine = outlineMatch
                .map((s) => s.replace(/<|>/g, ''))
                .reduce((resLine, key) => {
                    if (outlineVars[key]) {
                        resLine = resLine.replace(`<${key}>`, `"${outlineVars[key]}"`);
                    }
                    return resLine;
                }, line);
            const pureMatch = pureLine.match(this.getGherkinRegEx());
            const quotesMatch = quotesLine.match(this.getGherkinRegEx());
            if (quotesMatch && quotesMatch[4] && this.getStepByText(quotesMatch[4])) {
                return quotesMatch;
            } else {
                return pureMatch;
            }
        }
        return line.match(this.getGherkinRegEx());
    }

    getPartialRegParts(text: string): string[] {
        let currString = '';
        let bracesMode = false;
        let openingBracesNum = 0;
        let closingBracesNum = 0;
        const res = [];
        for (let i = 0; i <= text.length; i++) {
            const currSymbol = text[i];
            if (i === text.length) {
                res.push(currString);
            } else if (bracesMode) {
                if (currSymbol === ')') {
                    closingBracesNum++;
                    if (openingBracesNum === closingBracesNum) {
                        bracesMode = false;
                    }
                }
                if (currSymbol === '(') {
                    openingBracesNum++;
                }
                currString += currSymbol;
            } else {
                if (currSymbol === ' ') {
                    res.push(currString);
                    currString = '';
                } else if (currSymbol === '(') {
                    currString += '(';
                    bracesMode = true;
                    openingBracesNum = 1;
                    closingBracesNum = 0;
                } else {
                    currString += currSymbol;
                }
            }
        }
        return res;
    }

    getPartialRegText(regText: string): string {
        return this.getPartialRegParts(regText)
            .map((el) => `(${el}|$)`)
            .join('( |$)')
            .replace(/^\^|^/, '^');
    }

    getTextForStep(step: string): string {
        step = step.replace(/\\/g, '');
        step = step.replace(/^\^|\$$/g, '');
        return step;
    }

    /**
     * Convert display text to insert text with placeholders
     */
    getInsertTextFromDisplayText(displayText: string): string {
        let res = displayText;
        let snippetIndex = 1;

        // Replace <placeholder> with ${n:placeholder}
        res = res.replace(/<([^>]+)>/g, (_, placeholder) => {
            return '${' + (snippetIndex++) + ':' + placeholder + '}';
        });

        return res;
    }

    /**
     * Populate steps from hardcoded tomato step definitions
     */
    populateFromHardcodedSteps(): void {
        this.elementsHash = {};
        this.elements = [];

        TOMATO_STEPS.forEach((stepDef: TomatoStepDefinition) => {
            const step = this.createStepFromDef({
                pattern: stepDef.pattern,
                displayText: stepDef.displayText,
                description: stepDef.description,
                category: stepDef.category,
            });
            if (step && !this.elementsHash[step.id]) {
                this.elements.push(step);
                this.elementsHash[step.id] = true;
            }
        });
    }

    /**
     * Populate steps from dynamically loaded definitions
     */
    populateFromDynamicSteps(dynamicSteps: DynamicStepDef[]): void {
        this.elementsHash = {};
        this.elements = [];

        dynamicSteps.forEach((stepDef) => {
            const step = this.createStepFromDef({
                pattern: stepDef.pattern,
                displayText: stepDef.displayText,
                description: stepDef.description,
                category: stepDef.category,
                example: stepDef.example,
            });
            if (step && !this.elementsHash[step.id]) {
                this.elements.push(step);
                this.elementsHash[step.id] = true;
            }
        });
    }

    createStepFromDef(stepDef: { pattern: string; displayText: string; description: string; category: string; example?: string }): Step | null {
        const { pattern, displayText, description, category, example } = stepDef;

        try {
            const reg = new RegExp(pattern);
            const text = this.getTextForStep(pattern);
            const id = 'step' + getMD5Id(text);

            let partialReg;
            try {
                partialReg = new RegExp(this.getPartialRegText(pattern));
            } catch (err) {
                partialReg = reg;
            }

            const pos = Position.create(0, 0);
            const def = Location.create(
                'tomato://steps/' + category,
                Range.create(pos, pos)
            );

            let documentation = `**${description}**\n\nCategory: ${category}\n\nUsage: \`${displayText}\``;
            if (example) {
                documentation += `\n\nExample:\n\`\`\`gherkin\n${example}\n\`\`\``;
            }

            return {
                id,
                reg,
                partialReg,
                text,
                displayText,
                desc: description,
                def,
                count: 0,
                gherkin: GherkinType.Other,
                documentation,
                category,
            };
        } catch (err) {
            console.error(`Failed to create step from pattern: ${pattern}`, err);
            return null;
        }
    }

    getStepByText(text: string, gherkin?: GherkinType) {
        return this.elements.find(
            (s) => {
                const isStepOk = s.reg.test(text);
                return isStepOk;
            }
        );
    }

    /**
     * Find similar steps based on the input text
     */
    findSimilarSteps(inputText: string, maxResults: number = 3): Step[] {
        const inputWords = inputText.toLowerCase().split(/\s+/).filter(w => w.length > 2);

        const scored = this.elements.map(step => {
            let score = 0;
            const stepText = step.displayText.toLowerCase();

            // Check for word matches
            for (const word of inputWords) {
                if (stepText.includes(word)) {
                    score += 10;
                }
            }

            // Check for partial word matches
            for (const word of inputWords) {
                const stepWords = stepText.split(/\s+/);
                for (const sw of stepWords) {
                    if (sw.startsWith(word) || word.startsWith(sw)) {
                        score += 5;
                    }
                }
            }

            // Bonus for starting similarly
            if (stepText.startsWith(inputText.toLowerCase().slice(0, 5))) {
                score += 20;
            }

            return { step, score };
        });

        return scored
            .filter(s => s.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, maxResults)
            .map(s => s.step);
    }

    validate(line: string, lineNum: number, text: string) {
        line = line.replace(/\s*$/, '');
        const lineForError = line.replace(/^\s*/, '');
        const match = this.getGherkinMatch(line, text);
        if (!match) {
            return null;
        }
        const beforeGherkin = match[1];
        const stepText = match[4];
        const step = this.getStepByText(stepText);
        if (step) {
            return null;
        } else {
            // Find similar steps for suggestions
            const similarSteps = this.findSimilarSteps(stepText);
            let message = `Invalid tomato step: "${lineForError}"`;

            if (similarSteps.length > 0) {
                message += '\n\nDid you mean:\n' + similarSteps
                    .map(s => `  - ${s.displayText}`)
                    .join('\n');
            }

            message += '\n\nSee https://tomatool.github.io/tomato/steps.html';

            return {
                severity: DiagnosticSeverity.Error,
                range: {
                    start: { line: lineNum, character: beforeGherkin.length },
                    end: { line: lineNum, character: line.length },
                },
                message,
                source: 'tomato',
            } as Diagnostic;
        }
    }

    getDefinition(line: string, text: string): Definition | null {
        const match = this.getGherkinMatch(line, text);
        if (!match) {
            return null;
        }
        const step = this.getStepByText(match[4]);
        return step ? step.def : null;
    }

    getStrictGherkinType(gherkinPart: string, lineNumber: number, text: string) {
        const gherkinType = getGherkinType(gherkinPart);
        if (gherkinType === GherkinType.And || gherkinType === GherkinType.But) {
            return text
                .split(/\r?\n/g)
                .slice(0, lineNumber)
                .reduceRight((res, val) => {
                    if (res === GherkinType.Other) {
                        const match = this.getGherkinMatch(val, text);
                        if (match) {
                            const [, , prevGherkinPart] = match;
                            const prevGherkinPartType = getGherkinTypeLower(prevGherkinPart);
                            if (
                                ~[
                                    GherkinType.Given,
                                    GherkinType.When,
                                    GherkinType.Then,
                                ].indexOf(prevGherkinPartType)
                            ) {
                                res = prevGherkinPartType;
                            }
                        }
                    }
                    return res;
                }, GherkinType.Other);
        } else {
            return getGherkinTypeLower(gherkinPart);
        }
    }

    getCompletion(
        line: string,
        lineNumber: number,
        text: string
    ): CompletionItem[] | null {
        const match = this.getGherkinMatch(line, text);
        if (!match) {
            return null;
        }
        const [, , , , stepPartBase] = match;
        let stepPart = stepPartBase || '';
        stepPart = stepPart.replace(/[^\s]+$/, '');

        const res = this.elements
            .filter((step) => step.partialReg.test(stepPart))
            .map((step) => {
                return {
                    label: step.displayText,
                    kind: CompletionItemKind.Snippet,
                    data: step.id,
                    documentation: step.documentation,
                    detail: `[${step.category}] ${step.desc}`,
                    sortText: getSortPrefix(step.count, 5) + '_' + step.displayText,
                    insertText: this.getInsertTextFromDisplayText(step.displayText),
                    insertTextFormat: InsertTextFormat.Snippet,
                };
            });
        return res.length ? res : null;
    }

    getCompletionResolve(item: CompletionItem): CompletionItem {
        this.incrementElementCount(item.data);
        return item;
    }
}
