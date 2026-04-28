# @web3smallie/migrate-wagmi-v3

Automated codemod suite for wagmi v2 to v3 and Inngest v3 to v4 migrations with zero false positives

## Installation

```bash
# Install from registry
codemod run @web3smallie/migrate-wagmi-v3

# Or run locally
codemod run -w workflow.yaml
```

## Usage

This codemod transforms typescript code by:

- Converting `var` declarations to `const`/`let`
- Removing debug statements
- Modernizing syntax patterns

## Development

```bash
# Test the transformation
npm test

# Validate the workflow
codemod validate -w workflow.yaml

# Publish to registry
codemod login
codemod publish
```

## License

YES 