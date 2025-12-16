import StepsHandler from '../src/steps.handler';
import { Settings } from '../src/types';

const settings: Settings = {
    steps: [],
    pages: {},
};

describe('Tomato StepsHandler', () => {
    let handler: StepsHandler;

    beforeAll(() => {
        handler = new StepsHandler(settings);
    });

    describe('populateTomatoSteps', () => {
        it('should load all tomato step definitions', () => {
            const elements = handler.getElements();
            expect(elements.length).toBeGreaterThan(0);
        });

        it('should include HTTP steps', () => {
            const elements = handler.getElements();
            const httpSteps = elements.filter(s => s.category === 'http');
            expect(httpSteps.length).toBeGreaterThan(0);
        });

        it('should include Redis steps', () => {
            const elements = handler.getElements();
            const redisSteps = elements.filter(s => s.category === 'redis');
            expect(redisSteps.length).toBeGreaterThan(0);
        });

        it('should include Postgres steps', () => {
            const elements = handler.getElements();
            const postgresSteps = elements.filter(s => s.category === 'postgres');
            expect(postgresSteps.length).toBeGreaterThan(0);
        });

        it('should include Kafka steps', () => {
            const elements = handler.getElements();
            const kafkaSteps = elements.filter(s => s.category === 'kafka');
            expect(kafkaSteps.length).toBeGreaterThan(0);
        });

        it('should include WebSocket steps', () => {
            const elements = handler.getElements();
            const websocketSteps = elements.filter(s => s.category === 'websocket');
            expect(websocketSteps.length).toBeGreaterThan(0);
        });

        it('should include Shell steps', () => {
            const elements = handler.getElements();
            const shellSteps = elements.filter(s => s.category === 'shell');
            expect(shellSteps.length).toBeGreaterThan(0);
        });
    });

    describe('getStepByText', () => {
        it('should match HTTP request step', () => {
            const step = handler.getStepByText('"api" sends "GET" to "/users"');
            expect(step).not.toBeNull();
            expect(step?.category).toBe('http');
        });

        it('should match HTTP response status step', () => {
            const step = handler.getStepByText('"api" response status is "200"');
            expect(step).not.toBeNull();
            expect(step?.category).toBe('http');
        });

        it('should match Redis key step', () => {
            const step = handler.getStepByText('"cache" key "foo" is "bar"');
            expect(step).not.toBeNull();
            expect(step?.category).toBe('redis');
        });

        it('should match Postgres step', () => {
            const step = handler.getStepByText('"db" table "users" is empty');
            expect(step).not.toBeNull();
            expect(step?.category).toBe('postgres');
        });

        it('should match Shell step', () => {
            const step = handler.getStepByText('"shell" succeeds');
            expect(step).not.toBeNull();
            expect(step?.category).toBe('shell');
        });

        it('should return undefined for unknown step', () => {
            const step = handler.getStepByText('I do something that does not exist');
            expect(step).toBeUndefined();
        });
    });

    describe('validate', () => {
        it('should return null for valid step', () => {
            const result = handler.validate(
                '    When "api" sends "GET" to "/users"',
                0,
                'Feature: Test\n  Scenario: Test\n    When "api" sends "GET" to "/users"'
            );
            expect(result).toBeNull();
        });

        it('should return diagnostic for invalid step', () => {
            const result = handler.validate(
                '    Given I do something invalid',
                0,
                'Feature: Test\n  Scenario: Test\n    Given I do something invalid'
            );
            expect(result).not.toBeNull();
            expect(result?.severity).toBe(1); // DiagnosticSeverity.Error
            expect(result?.source).toBe('tomato');
        });

        it('should return null for non-gherkin line', () => {
            const result = handler.validate(
                'Feature: Test',
                0,
                'Feature: Test'
            );
            expect(result).toBeNull();
        });
    });

    describe('getCompletion', () => {
        it('should return completions for empty step part', () => {
            const completions = handler.getCompletion(
                '    Given ',
                0,
                'Feature: Test\n  Scenario: Test\n    Given '
            );
            expect(completions).not.toBeNull();
            expect(completions!.length).toBeGreaterThan(0);
        });

        it('should return completions for partial step', () => {
            const completions = handler.getCompletion(
                '    Given "api" response',
                0,
                'Feature: Test\n  Scenario: Test\n    Given "api" response'
            );
            expect(completions).not.toBeNull();
            expect(completions!.length).toBeGreaterThan(0);
        });

        it('should include category in completion detail', () => {
            const completions = handler.getCompletion(
                '    Given ',
                0,
                'Feature: Test\n  Scenario: Test\n    Given '
            );
            expect(completions).not.toBeNull();
            // At least one completion should have the category in the detail
            const hasCategory = completions!.some(c =>
                c.detail && /^\[(http|redis|postgres|kafka|websocket|shell)/.test(c.detail)
            );
            expect(hasCategory).toBe(true);
        });
    });

    describe('getGherkinMatch', () => {
        it('should match Given keyword', () => {
            const match = handler.getGherkinMatch(
                '    Given "api" header "Content-Type" is "application/json"',
                'Feature: Test\n  Scenario: Test\n    Given "api" header "Content-Type" is "application/json"'
            );
            expect(match).not.toBeNull();
            expect(match![2]).toBe('Given');
        });

        it('should match When keyword', () => {
            const match = handler.getGherkinMatch(
                '    When "api" sends "POST" to "/users"',
                'Feature: Test\n  Scenario: Test\n    When "api" sends "POST" to "/users"'
            );
            expect(match).not.toBeNull();
            expect(match![2]).toBe('When');
        });

        it('should match Then keyword', () => {
            const match = handler.getGherkinMatch(
                '    Then "api" response status is "200"',
                'Feature: Test\n  Scenario: Test\n    Then "api" response status is "200"'
            );
            expect(match).not.toBeNull();
            expect(match![2]).toBe('Then');
        });

        it('should match And keyword', () => {
            const match = handler.getGherkinMatch(
                '    And "api" response body is empty',
                'Feature: Test\n  Scenario: Test\n    And "api" response body is empty'
            );
            expect(match).not.toBeNull();
            expect(match![2]).toBe('And');
        });
    });
});
