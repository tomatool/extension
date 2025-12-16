/**
 * Dynamic step loader for Tomato
 * Runs `tomato steps --json` and parses the output
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface TomatoStepJSON {
    group: string;
    pattern: string;
    description: string;
    example: string;
}

export interface TomatoModuleJSON {
    name: string;
    description: string;
    steps: TomatoStepJSON[];
}

export interface TomatoStepDefinition {
    pattern: string;
    displayText: string;
    description: string;
    category: string;
    group: string;
    example: string;
}

/**
 * Convert module name to category slug
 */
function moduleToCategory(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Convert pattern with {resource} to regex pattern and display text
 */
function convertPattern(pattern: string): { regexPattern: string; displayText: string } {
    // Replace {resource} with capture group for regex
    const regexPattern = pattern.replace(/\{resource\}/g, '([^"]*)');

    // Create display text by replacing {resource} with <resource> and cleaning up regex
    let displayText = pattern
        .replace(/^\^/, '')
        .replace(/\$$/, '')
        .replace(/\{resource\}/g, '<resource>')
        // Replace common regex capture groups with readable placeholders
        .replace(/\(\[\^"\]\*\)/g, '<value>')           // ([^"]*) -> <value>
        .replace(/\(\\d\+\)/g, '<number>')              // (\d+) -> <number>
        .replace(/\(\[\\d\]\+\)/g, '<number>')          // ([\d]+) -> <number>
        .replace(/\([^)]+\)/g, '<value>');              // Any remaining capture groups -> <value>

    return { regexPattern, displayText };
}

/**
 * Load steps from tomato CLI
 */
export async function loadStepsFromTomato(): Promise<TomatoStepDefinition[]> {
    try {
        const { stdout } = await execAsync('tomato steps --json', {
            timeout: 10000,
            maxBuffer: 1024 * 1024, // 1MB buffer
        });

        const modules: TomatoModuleJSON[] = JSON.parse(stdout);
        const steps: TomatoStepDefinition[] = [];

        for (const module of modules) {
            const category = moduleToCategory(module.name);

            for (const step of module.steps) {
                const { regexPattern, displayText } = convertPattern(step.pattern);

                steps.push({
                    pattern: regexPattern,
                    displayText,
                    description: step.description,
                    category,
                    group: step.group,
                    example: step.example,
                });
            }
        }

        return steps;
    } catch (error) {
        console.error('Failed to load steps from tomato CLI:', error);
        return [];
    }
}

/**
 * Check if tomato CLI is available
 */
export async function isTomatoAvailable(): Promise<boolean> {
    try {
        await execAsync('tomato --version', { timeout: 5000 });
        return true;
    } catch {
        return false;
    }
}
