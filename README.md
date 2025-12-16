# Tomato Gherkin Autocomplete

VSCode extension for the [Tomato testing framework](https://tomatool.github.io/tomato/) - provides Gherkin autocomplete and validation specifically for Tomato steps.

## Features

- **Autocomplete**: Get intelligent suggestions for all Tomato step definitions
- **Validation**: Warnings for any step that doesn't match a valid Tomato pattern
- **Syntax Highlighting**: Full Gherkin syntax support
- **Formatting**: Document formatting including table alignment
- **Multi-language**: Support for Gherkin keywords in many spoken languages

## Supported Step Categories

This extension provides autocomplete and validation for all Tomato step modules:

### HTTP
- Set headers, query params, request bodies (raw/JSON/form)
- Send requests with various HTTP methods
- Assert status codes, headers, body content, JSON paths, response times

### Redis
- String values with TTL, JSON values, hashes, lists, sets
- Increment/decrement operations
- Assertions on existence, values, TTL, cardinality

### PostgreSQL
- Insert rows via data tables
- Assert table contents, row counts, emptiness
- Execute raw SQL or from files

### Kafka
- Topic creation with partition specification
- Publish messages (text/JSON) with optional keys
- Consume and assert message receipt, order, headers

### WebSocket
- Connect/disconnect with optional headers
- Send text/JSON messages
- Assert connection state, message receipt, counts, content

### Shell
- Set environment variables and working directories
- Execute commands with timeout specifications
- Assert exit codes, stdout/stderr content, file existence

## Installation

1. Install the extension from VS Code marketplace
2. Open any `.feature` file
3. Start typing after a Gherkin keyword (`Given`, `When`, `Then`, `And`, `But`) to see suggestions

## Example

```gherkin
Feature: API Testing with Tomato

  Scenario: Test user API
    Given set "api" request header "Content-Type" to "application/json"
    When send "GET" request to "api" "/users/1"
    Then "api" response status should be "200"
    And "api" response JSON "name" should exist
```

Invalid steps will show a warning:

```gherkin
  Given I do something invalid  # Warning: Unknown tomato step
```

## Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `tomato.formatConfOverride` | Override formatting indentation | `{}` |
| `tomato.onTypeFormat` | Enable on-type formatting | `false` |
| `tomato.skipDocStringsFormat` | Skip formatting of doc strings | `false` |

### Quick Suggestions

For autocomplete to work inside strings, add this to your settings:

```json
{
    "editor.quickSuggestions": {
        "comments": false,
        "strings": true,
        "other": true
    }
}
```

## Documentation

For the complete list of available step definitions, see the [Tomato Steps Documentation](https://tomatool.github.io/tomato/steps.html).

## Issues

Feel free to create issues on [GitHub](https://github.com/tomatool/extension/issues)

## License

MIT
