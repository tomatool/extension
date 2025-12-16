/**
 * Tomato Step Definitions
 * Generated from `tomato steps` command output
 *
 * These are the hardcoded step patterns for the Tomato testing framework.
 */

export interface TomatoStepDefinition {
    pattern: string;
    displayText: string;
    description: string;
    category: string;
    hasDocString?: boolean;
    hasDataTable?: boolean;
}

export const TOMATO_STEPS: TomatoStepDefinition[] = [
    // =====================
    // HTTP Client
    // =====================
    {
        pattern: '^"([^"]*)" header "([^"]*)" is "([^"]*)"$',
        displayText: '"<resource>" header "<name>" is "<value>"',
        description: 'Set a header',
        category: 'http',
    },
    {
        pattern: '^"([^"]*)" headers are:$',
        displayText: '"<resource>" headers are:',
        description: 'Set multiple headers from table',
        category: 'http',
        hasDataTable: true,
    },
    {
        pattern: '^"([^"]*)" query param "([^"]*)" is "([^"]*)"$',
        displayText: '"<resource>" query param "<name>" is "<value>"',
        description: 'Set a query parameter',
        category: 'http',
    },
    {
        pattern: '^"([^"]*)" body is:$',
        displayText: '"<resource>" body is:',
        description: 'Set raw request body (docstring)',
        category: 'http',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" json body is:$',
        displayText: '"<resource>" json body is:',
        description: 'Set JSON body + Content-Type header',
        category: 'http',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" form body is:$',
        displayText: '"<resource>" form body is:',
        description: 'Set form-encoded body from table',
        category: 'http',
        hasDataTable: true,
    },
    {
        pattern: '^"([^"]*)" sends "([^"]*)" to "([^"]*)"$',
        displayText: '"<resource>" sends "<method>" to "<path>"',
        description: 'Send HTTP request',
        category: 'http',
    },
    {
        pattern: '^"([^"]*)" sends "([^"]*)" to "([^"]*)" with body:$',
        displayText: '"<resource>" sends "<method>" to "<path>" with body:',
        description: 'Send with raw body',
        category: 'http',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" sends "([^"]*)" to "([^"]*)" with json:$',
        displayText: '"<resource>" sends "<method>" to "<path>" with json:',
        description: 'Send with JSON body',
        category: 'http',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" response status is "(\\d+)"$',
        displayText: '"<resource>" response status is "<code>"',
        description: 'Assert exact status code',
        category: 'http',
    },
    {
        pattern: '^"([^"]*)" response status is (success|redirect|client error|server error)$',
        displayText: '"<resource>" response status is <class>',
        description: 'Assert status class (2xx, 3xx, 4xx, 5xx)',
        category: 'http',
    },
    {
        pattern: '^"([^"]*)" response header "([^"]*)" is "([^"]*)"$',
        displayText: '"<resource>" response header "<name>" is "<value>"',
        description: 'Assert exact header value',
        category: 'http',
    },
    {
        pattern: '^"([^"]*)" response header "([^"]*)" contains "([^"]*)"$',
        displayText: '"<resource>" response header "<name>" contains "<value>"',
        description: 'Assert header contains substring',
        category: 'http',
    },
    {
        pattern: '^"([^"]*)" response header "([^"]*)" exists$',
        displayText: '"<resource>" response header "<name>" exists',
        description: 'Assert header exists',
        category: 'http',
    },
    {
        pattern: '^"([^"]*)" response body is:$',
        displayText: '"<resource>" response body is:',
        description: 'Assert exact body match',
        category: 'http',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" response body contains "([^"]*)"$',
        displayText: '"<resource>" response body contains "<text>"',
        description: 'Assert body contains substring',
        category: 'http',
    },
    {
        pattern: '^"([^"]*)" response body does not contain "([^"]*)"$',
        displayText: '"<resource>" response body does not contain "<text>"',
        description: "Assert body doesn't contain substring",
        category: 'http',
    },
    {
        pattern: '^"([^"]*)" response body is empty$',
        displayText: '"<resource>" response body is empty',
        description: 'Assert empty body',
        category: 'http',
    },
    {
        pattern: '^"([^"]*)" response json "([^"]*)" is "([^"]*)"$',
        displayText: '"<resource>" response json "<path>" is "<value>"',
        description: 'Assert JSON path value',
        category: 'http',
    },
    {
        pattern: '^"([^"]*)" response json "([^"]*)" exists$',
        displayText: '"<resource>" response json "<path>" exists',
        description: 'Assert JSON path exists',
        category: 'http',
    },
    {
        pattern: '^"([^"]*)" response json "([^"]*)" does not exist$',
        displayText: '"<resource>" response json "<path>" does not exist',
        description: "Assert JSON path doesn't exist",
        category: 'http',
    },
    {
        pattern: '^"([^"]*)" response json matches:$',
        displayText: '"<resource>" response json matches:',
        description: 'Assert exact JSON structure with matchers',
        category: 'http',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" response json contains:$',
        displayText: '"<resource>" response json contains:',
        description: 'Assert JSON contains specified fields',
        category: 'http',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" response time is less than "([^"]*)"$',
        displayText: '"<resource>" response time is less than "<duration>"',
        description: 'Assert response time',
        category: 'http',
    },

    // =====================
    // HTTP Server (Stubs)
    // =====================
    {
        pattern: '^"([^"]*)" stub "([^"]*)" "([^"]*)" returns "(\\d+)"$',
        displayText: '"<resource>" stub "<method>" "<path>" returns "<status>"',
        description: 'Creates a stub that returns a status code',
        category: 'http-server',
    },
    {
        pattern: '^"([^"]*)" stub "([^"]*)" "([^"]*)" returns "(\\d+)" with body:$',
        displayText: '"<resource>" stub "<method>" "<path>" returns "<status>" with body:',
        description: 'Creates a stub that returns a status code and body',
        category: 'http-server',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" stub "([^"]*)" "([^"]*)" returns "(\\d+)" with json:$',
        displayText: '"<resource>" stub "<method>" "<path>" returns "<status>" with json:',
        description: 'Creates a stub that returns JSON',
        category: 'http-server',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" stub "([^"]*)" "([^"]*)" returns "(\\d+)" with headers:$',
        displayText: '"<resource>" stub "<method>" "<path>" returns "<status>" with headers:',
        description: 'Creates a stub that returns with custom headers',
        category: 'http-server',
        hasDataTable: true,
    },
    {
        pattern: '^"([^"]*)" received "([^"]*)" "([^"]*)"$',
        displayText: '"<resource>" received "<method>" "<path>"',
        description: 'Asserts a request was received',
        category: 'http-server',
    },
    {
        pattern: '^"([^"]*)" received "([^"]*)" "([^"]*)" "(\\d+)" times$',
        displayText: '"<resource>" received "<method>" "<path>" "<count>" times',
        description: 'Asserts a request was received N times',
        category: 'http-server',
    },
    {
        pattern: '^"([^"]*)" did not receive "([^"]*)" "([^"]*)"$',
        displayText: '"<resource>" did not receive "<method>" "<path>"',
        description: 'Asserts a request was not received',
        category: 'http-server',
    },
    {
        pattern: '^"([^"]*)" received request with header "([^"]*)" containing "([^"]*)"$',
        displayText: '"<resource>" received request with header "<name>" containing "<value>"',
        description: 'Asserts any request was received with header containing value',
        category: 'http-server',
    },
    {
        pattern: '^"([^"]*)" received request with body containing "([^"]*)"$',
        displayText: '"<resource>" received request with body containing "<text>"',
        description: 'Asserts any request was received with body containing value',
        category: 'http-server',
    },
    {
        pattern: '^"([^"]*)" received "(\\d+)" requests$',
        displayText: '"<resource>" received "<count>" requests',
        description: 'Asserts total number of requests received',
        category: 'http-server',
    },
    {
        pattern: '^"([^"]*)" url is stored in "([^"]*)"$',
        displayText: '"<resource>" url is stored in "<variable>"',
        description: 'Stores the server URL in a variable',
        category: 'http-server',
    },

    // =====================
    // PostgreSQL
    // =====================
    {
        pattern: '^"([^"]*)" table "([^"]*)" has values:$',
        displayText: '"<resource>" table "<table>" has values:',
        description: 'Insert rows from table',
        category: 'postgres',
        hasDataTable: true,
    },
    {
        pattern: '^"([^"]*)" executes:$',
        displayText: '"<resource>" executes:',
        description: 'Execute raw SQL',
        category: 'postgres',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" executes file "([^"]*)"$',
        displayText: '"<resource>" executes file "<path>"',
        description: 'Execute SQL from file',
        category: 'postgres',
    },
    {
        pattern: '^"([^"]*)" table "([^"]*)" contains:$',
        displayText: '"<resource>" table "<table>" contains:',
        description: 'Assert table contains rows',
        category: 'postgres',
        hasDataTable: true,
    },
    {
        pattern: '^"([^"]*)" table "([^"]*)" is empty$',
        displayText: '"<resource>" table "<table>" is empty',
        description: 'Assert table is empty',
        category: 'postgres',
    },
    {
        pattern: '^"([^"]*)" table "([^"]*)" has "(\\d+)" rows$',
        displayText: '"<resource>" table "<table>" has "<count>" rows',
        description: 'Assert row count',
        category: 'postgres',
    },

    // =====================
    // Redis
    // =====================
    {
        pattern: '^"([^"]*)" key "([^"]*)" is "([^"]*)"$',
        displayText: '"<resource>" key "<key>" is "<value>"',
        description: 'Set a string value',
        category: 'redis',
    },
    {
        pattern: '^"([^"]*)" key "([^"]*)" is "([^"]*)" with TTL "([^"]*)"$',
        displayText: '"<resource>" key "<key>" is "<value>" with TTL "<ttl>"',
        description: 'Set a string value with expiration',
        category: 'redis',
    },
    {
        pattern: '^"([^"]*)" key "([^"]*)" is:$',
        displayText: '"<resource>" key "<key>" is:',
        description: 'Set a JSON/multiline value',
        category: 'redis',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" key "([^"]*)" is deleted$',
        displayText: '"<resource>" key "<key>" is deleted',
        description: 'Delete a key',
        category: 'redis',
    },
    {
        pattern: '^"([^"]*)" key "([^"]*)" is incremented$',
        displayText: '"<resource>" key "<key>" is incremented',
        description: 'Increment integer value by 1',
        category: 'redis',
    },
    {
        pattern: '^"([^"]*)" key "([^"]*)" is incremented by "(\\d+)"$',
        displayText: '"<resource>" key "<key>" is incremented by "<amount>"',
        description: 'Increment integer value by N',
        category: 'redis',
    },
    {
        pattern: '^"([^"]*)" key "([^"]*)" is decremented$',
        displayText: '"<resource>" key "<key>" is decremented',
        description: 'Decrement integer value by 1',
        category: 'redis',
    },
    {
        pattern: '^"([^"]*)" key "([^"]*)" exists$',
        displayText: '"<resource>" key "<key>" exists',
        description: 'Assert key exists',
        category: 'redis',
    },
    {
        pattern: '^"([^"]*)" key "([^"]*)" does not exist$',
        displayText: '"<resource>" key "<key>" does not exist',
        description: "Assert key doesn't exist",
        category: 'redis',
    },
    {
        pattern: '^"([^"]*)" key "([^"]*)" has value "([^"]*)"$',
        displayText: '"<resource>" key "<key>" has value "<value>"',
        description: 'Assert exact value',
        category: 'redis',
    },
    {
        pattern: '^"([^"]*)" key "([^"]*)" contains "([^"]*)"$',
        displayText: '"<resource>" key "<key>" contains "<value>"',
        description: 'Assert value contains substring',
        category: 'redis',
    },
    {
        pattern: '^"([^"]*)" key "([^"]*)" has TTL greater than "(\\d+)" seconds$',
        displayText: '"<resource>" key "<key>" has TTL greater than "<seconds>" seconds',
        description: 'Assert TTL greater than N seconds',
        category: 'redis',
    },
    {
        pattern: '^"([^"]*)" hash "([^"]*)" has fields:$',
        displayText: '"<resource>" hash "<key>" has fields:',
        description: 'Set hash fields from table',
        category: 'redis',
        hasDataTable: true,
    },
    {
        pattern: '^"([^"]*)" hash "([^"]*)" field "([^"]*)" is "([^"]*)"$',
        displayText: '"<resource>" hash "<key>" field "<field>" is "<value>"',
        description: 'Assert hash field value',
        category: 'redis',
    },
    {
        pattern: '^"([^"]*)" hash "([^"]*)" contains:$',
        displayText: '"<resource>" hash "<key>" contains:',
        description: 'Assert hash contains fields',
        category: 'redis',
        hasDataTable: true,
    },
    {
        pattern: '^"([^"]*)" list "([^"]*)" has "([^"]*)"$',
        displayText: '"<resource>" list "<key>" has "<value>"',
        description: 'Push value to list',
        category: 'redis',
    },
    {
        pattern: '^"([^"]*)" list "([^"]*)" has values:$',
        displayText: '"<resource>" list "<key>" has values:',
        description: 'Push multiple values to list',
        category: 'redis',
        hasDataTable: true,
    },
    {
        pattern: '^"([^"]*)" list "([^"]*)" has "(\\d+)" items$',
        displayText: '"<resource>" list "<key>" has "<count>" items',
        description: 'Assert list length',
        category: 'redis',
    },
    {
        pattern: '^"([^"]*)" list "([^"]*)" contains "([^"]*)"$',
        displayText: '"<resource>" list "<key>" contains "<value>"',
        description: 'Assert list contains value',
        category: 'redis',
    },
    {
        pattern: '^"([^"]*)" set "([^"]*)" has "([^"]*)"$',
        displayText: '"<resource>" set "<key>" has "<value>"',
        description: 'Add member to set',
        category: 'redis',
    },
    {
        pattern: '^"([^"]*)" set "([^"]*)" has members:$',
        displayText: '"<resource>" set "<key>" has members:',
        description: 'Add multiple members to set',
        category: 'redis',
        hasDataTable: true,
    },
    {
        pattern: '^"([^"]*)" set "([^"]*)" contains "([^"]*)"$',
        displayText: '"<resource>" set "<key>" contains "<value>"',
        description: 'Assert set contains member',
        category: 'redis',
    },
    {
        pattern: '^"([^"]*)" set "([^"]*)" has "(\\d+)" members$',
        displayText: '"<resource>" set "<key>" has "<count>" members',
        description: 'Assert set size',
        category: 'redis',
    },
    {
        pattern: '^"([^"]*)" has "(\\d+)" keys$',
        displayText: '"<resource>" has "<count>" keys',
        description: 'Assert total key count',
        category: 'redis',
    },
    {
        pattern: '^"([^"]*)" is empty$',
        displayText: '"<resource>" is empty',
        description: 'Assert database is empty',
        category: 'redis',
    },

    // =====================
    // Kafka
    // =====================
    {
        pattern: '^"([^"]*)" topic "([^"]*)" exists$',
        displayText: '"<resource>" topic "<topic>" exists',
        description: 'Asserts a Kafka topic exists',
        category: 'kafka',
    },
    {
        pattern: '^"([^"]*)" creates topic "([^"]*)"$',
        displayText: '"<resource>" creates topic "<topic>"',
        description: 'Creates a Kafka topic with 1 partition',
        category: 'kafka',
    },
    {
        pattern: '^"([^"]*)" creates topic "([^"]*)" with "(\\d+)" partitions$',
        displayText: '"<resource>" creates topic "<topic>" with "<count>" partitions',
        description: 'Creates a Kafka topic with specified partitions',
        category: 'kafka',
    },
    {
        pattern: '^"([^"]*)" publishes to "([^"]*)":$',
        displayText: '"<resource>" publishes to "<topic>":',
        description: 'Publishes a message to a topic',
        category: 'kafka',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" publishes to "([^"]*)" with key "([^"]*)":$',
        displayText: '"<resource>" publishes to "<topic>" with key "<key>":',
        description: 'Publishes a message with a key to a topic',
        category: 'kafka',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" publishes json to "([^"]*)":$',
        displayText: '"<resource>" publishes json to "<topic>":',
        description: 'Publishes a JSON message to a topic',
        category: 'kafka',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" publishes json to "([^"]*)" with key "([^"]*)":$',
        displayText: '"<resource>" publishes json to "<topic>" with key "<key>":',
        description: 'Publishes a JSON message with a key',
        category: 'kafka',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" publishes messages to "([^"]*)":$',
        displayText: '"<resource>" publishes messages to "<topic>":',
        description: 'Publishes multiple messages from a table',
        category: 'kafka',
        hasDataTable: true,
    },
    {
        pattern: '^"([^"]*)" consumes from "([^"]*)"$',
        displayText: '"<resource>" consumes from "<topic>"',
        description: 'Starts consuming messages from a topic',
        category: 'kafka',
    },
    {
        pattern: '^"([^"]*)" receives from "([^"]*)" within "([^"]*)"$',
        displayText: '"<resource>" receives from "<topic>" within "<timeout>"',
        description: 'Waits for a message from a topic within timeout',
        category: 'kafka',
    },
    {
        pattern: '^"([^"]*)" receives from "([^"]*)" within "([^"]*)":$',
        displayText: '"<resource>" receives from "<topic>" within "<timeout>":',
        description: 'Asserts a specific message is received within timeout',
        category: 'kafka',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" receives from "([^"]*)" with key "([^"]*)" within "([^"]*)"$',
        displayText: '"<resource>" receives from "<topic>" with key "<key>" within "<timeout>"',
        description: 'Asserts a message with specific key is received',
        category: 'kafka',
    },
    {
        pattern: '^"([^"]*)" topic "([^"]*)" has "(\\d+)" messages$',
        displayText: '"<resource>" topic "<topic>" has "<count>" messages',
        description: 'Asserts topic has exactly N messages consumed',
        category: 'kafka',
    },
    {
        pattern: '^"([^"]*)" topic "([^"]*)" is empty$',
        displayText: '"<resource>" topic "<topic>" is empty',
        description: 'Asserts no messages have been consumed from topic',
        category: 'kafka',
    },
    {
        pattern: '^"([^"]*)" last message contains:$',
        displayText: '"<resource>" last message contains:',
        description: 'Asserts the last consumed message contains content',
        category: 'kafka',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" last message has key "([^"]*)"$',
        displayText: '"<resource>" last message has key "<key>"',
        description: 'Asserts the last consumed message has specific key',
        category: 'kafka',
    },
    {
        pattern: '^"([^"]*)" last message has header "([^"]*)" with value "([^"]*)"$',
        displayText: '"<resource>" last message has header "<header>" with value "<value>"',
        description: 'Asserts the last message has a header with value',
        category: 'kafka',
    },
    {
        pattern: '^"([^"]*)" receives messages from "([^"]*)" in order:$',
        displayText: '"<resource>" receives messages from "<topic>" in order:',
        description: 'Asserts messages are received in specified order',
        category: 'kafka',
        hasDataTable: true,
    },

    // =====================
    // Shell
    // =====================
    {
        pattern: '^"([^"]*)" env "([^"]*)" is "([^"]*)"$',
        displayText: '"<resource>" env "<name>" is "<value>"',
        description: 'Set environment variable',
        category: 'shell',
    },
    {
        pattern: '^"([^"]*)" workdir is "([^"]*)"$',
        displayText: '"<resource>" workdir is "<path>"',
        description: 'Set working directory',
        category: 'shell',
    },
    {
        pattern: '^"([^"]*)" runs:$',
        displayText: '"<resource>" runs:',
        description: 'Run command (docstring)',
        category: 'shell',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" runs "([^"]*)"$',
        displayText: '"<resource>" runs "<command>"',
        description: 'Run inline command',
        category: 'shell',
    },
    {
        pattern: '^"([^"]*)" runs script "([^"]*)"$',
        displayText: '"<resource>" runs script "<path>"',
        description: 'Run script file',
        category: 'shell',
    },
    {
        pattern: '^"([^"]*)" runs with timeout "([^"]*)":$',
        displayText: '"<resource>" runs with timeout "<duration>":',
        description: 'Run with custom timeout',
        category: 'shell',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" exit code is "(\\d+)"$',
        displayText: '"<resource>" exit code is "<code>"',
        description: 'Assert exit code',
        category: 'shell',
    },
    {
        pattern: '^"([^"]*)" succeeds$',
        displayText: '"<resource>" succeeds',
        description: 'Assert exit code 0',
        category: 'shell',
    },
    {
        pattern: '^"([^"]*)" fails$',
        displayText: '"<resource>" fails',
        description: 'Assert non-zero exit code',
        category: 'shell',
    },
    {
        pattern: '^"([^"]*)" stdout contains "([^"]*)"$',
        displayText: '"<resource>" stdout contains "<text>"',
        description: 'Assert stdout contains substring',
        category: 'shell',
    },
    {
        pattern: '^"([^"]*)" stdout does not contain "([^"]*)"$',
        displayText: '"<resource>" stdout does not contain "<text>"',
        description: "Assert stdout doesn't contain",
        category: 'shell',
    },
    {
        pattern: '^"([^"]*)" stdout is:$',
        displayText: '"<resource>" stdout is:',
        description: 'Assert exact stdout',
        category: 'shell',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" stdout is empty$',
        displayText: '"<resource>" stdout is empty',
        description: 'Assert stdout empty',
        category: 'shell',
    },
    {
        pattern: '^"([^"]*)" stderr contains "([^"]*)"$',
        displayText: '"<resource>" stderr contains "<text>"',
        description: 'Assert stderr contains substring',
        category: 'shell',
    },
    {
        pattern: '^"([^"]*)" stderr is empty$',
        displayText: '"<resource>" stderr is empty',
        description: 'Assert stderr empty',
        category: 'shell',
    },
    {
        pattern: '^"([^"]*)" file "([^"]*)" exists$',
        displayText: '"<resource>" file "<path>" exists',
        description: 'Assert file exists',
        category: 'shell',
    },
    {
        pattern: '^"([^"]*)" file "([^"]*)" does not exist$',
        displayText: '"<resource>" file "<path>" does not exist',
        description: "Assert file doesn't exist",
        category: 'shell',
    },
    {
        pattern: '^"([^"]*)" file "([^"]*)" contains "([^"]*)"$',
        displayText: '"<resource>" file "<path>" contains "<text>"',
        description: 'Assert file contains substring',
        category: 'shell',
    },

    // =====================
    // WebSocket Client
    // =====================
    {
        pattern: '^"([^"]*)" connects$',
        displayText: '"<resource>" connects',
        description: 'Connect to WebSocket endpoint',
        category: 'websocket',
    },
    {
        pattern: '^"([^"]*)" connects with headers:$',
        displayText: '"<resource>" connects with headers:',
        description: 'Connect with custom headers',
        category: 'websocket',
        hasDataTable: true,
    },
    {
        pattern: '^"([^"]*)" disconnects$',
        displayText: '"<resource>" disconnects',
        description: 'Disconnect from WebSocket',
        category: 'websocket',
    },
    {
        pattern: '^"([^"]*)" is connected$',
        displayText: '"<resource>" is connected',
        description: 'Assert connected',
        category: 'websocket',
    },
    {
        pattern: '^"([^"]*)" is disconnected$',
        displayText: '"<resource>" is disconnected',
        description: 'Assert disconnected',
        category: 'websocket',
    },
    {
        pattern: '^"([^"]*)" sends:$',
        displayText: '"<resource>" sends:',
        description: 'Send text message (docstring)',
        category: 'websocket',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" sends "([^"]*)"$',
        displayText: '"<resource>" sends "<message>"',
        description: 'Send short text message',
        category: 'websocket',
    },
    {
        pattern: '^"([^"]*)" sends json:$',
        displayText: '"<resource>" sends json:',
        description: 'Send JSON message',
        category: 'websocket',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" receives within "([^"]*)":$',
        displayText: '"<resource>" receives within "<timeout>":',
        description: 'Assert message received within timeout',
        category: 'websocket',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" receives within "([^"]*)" containing "([^"]*)"$',
        displayText: '"<resource>" receives within "<timeout>" containing "<text>"',
        description: 'Assert message containing substring received',
        category: 'websocket',
    },
    {
        pattern: '^"([^"]*)" receives json within "([^"]*)" matching:$',
        displayText: '"<resource>" receives json within "<timeout>" matching:',
        description: 'Assert JSON message matching structure',
        category: 'websocket',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" receives "(\\d+)" messages within "([^"]*)"$',
        displayText: '"<resource>" receives "<count>" messages within "<timeout>"',
        description: 'Assert N messages received within timeout',
        category: 'websocket',
    },
    {
        pattern: '^"([^"]*)" does not receive within "([^"]*)"$',
        displayText: '"<resource>" does not receive within "<timeout>"',
        description: 'Assert no message received',
        category: 'websocket',
    },
    {
        pattern: '^"([^"]*)" last message is:$',
        displayText: '"<resource>" last message is:',
        description: 'Assert last message matches exactly',
        category: 'websocket',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" last message contains "([^"]*)"$',
        displayText: '"<resource>" last message contains "<text>"',
        description: 'Assert last message contains substring',
        category: 'websocket',
    },
    {
        pattern: '^"([^"]*)" last message is json matching:$',
        displayText: '"<resource>" last message is json matching:',
        description: 'Assert last message is JSON matching structure',
        category: 'websocket',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" received "(\\d+)" messages$',
        displayText: '"<resource>" received "<count>" messages',
        description: 'Assert total message count',
        category: 'websocket',
    },

    // =====================
    // WebSocket Server (Stubs)
    // =====================
    {
        pattern: '^"([^"]*)" on connect sends:$',
        displayText: '"<resource>" on connect sends:',
        description: 'Sends a message when a client connects',
        category: 'websocket-server',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" on message "([^"]*)" replies:$',
        displayText: '"<resource>" on message "<message>" replies:',
        description: 'Replies to an exact message',
        category: 'websocket-server',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" on message matching "([^"]*)" replies:$',
        displayText: '"<resource>" on message matching "<pattern>" replies:',
        description: 'Replies to messages matching a regex pattern',
        category: 'websocket-server',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" broadcasts:$',
        displayText: '"<resource>" broadcasts:',
        description: 'Broadcasts a message to all connected clients',
        category: 'websocket-server',
        hasDocString: true,
    },
    {
        pattern: '^"([^"]*)" broadcasts "([^"]*)"$',
        displayText: '"<resource>" broadcasts "<message>"',
        description: 'Broadcasts a short message to all connected clients',
        category: 'websocket-server',
    },
    {
        pattern: '^"([^"]*)" has "(\\d+)" connections$',
        displayText: '"<resource>" has "<count>" connections',
        description: 'Asserts the number of connected clients',
        category: 'websocket-server',
    },
    {
        pattern: '^"([^"]*)" received message "([^"]*)"$',
        displayText: '"<resource>" received message "<message>"',
        description: 'Asserts a specific message was received',
        category: 'websocket-server',
    },
];
