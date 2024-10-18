# GitHub Action to Pull ENV Secrets using the Hyphen CLI

[![GitHub Super-Linter](https://github.com/Hyphen/env-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/Hyphen/env-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/Hyphen/env-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/Hyphen/env-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/Hyphen/env-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/Hyphen/env-action/actions/workflows/codeql-analysis.yml)

This action streamlines the process of pulling and using ENV secrets in GitHub
workflows, ensuring secure and efficient management of environment variables for
your application. To do this, you must pass the contents of `.hxkey` file and
specify the target environment. From there, this action will pull the ENV
secrets and output them in the requested way.

More information on ENV can be found in our
[docs](https://docs.hyphen.ai/docs/env-secrets-management).

## Outputs

This action supports multiple output methods for ENV secrets, offering
flexibility to help build and deploy your apps the way you want.

- **`file`:** This writes .env files, allowing you to load secrets using
  standard dotenv libraries.
- **`variable`:** This exports each secret as an environment variable in the
  runner, with an optional `variablePrefix` for custom naming.

For other options, their descriptions and defaults, see the
[action.yml](./action.yml) file

## Usage

> [!IMPORTANT]
>
> The Hyphen CLI is required for securely pulling ENV secrets from the Hyphen
> platform. You must have the CLI installed in the runner and in the path for
> this action to work. The easiest way to do this is to run the
> [Setup Hyphen CLI Action](https://github.com/marketplace/actions/setup-the-hyphen-cli)
> prior to running this action

```yaml
steps:
  - name: Checkout
    id: checkout
    uses: actions/checkout@v4

  - name: setup hx CLI
    id: setup
    uses: Hyphen/setup-hx-action@v1
    with:
      apiKey: ${{ secrets.HYPHEN_API_KEY }}
      hyphen-dev: true

  - name: Pull ENV secrets
    id: pull-env
    uses: Hyphen/env-action@v1
    with:
      hxKeyFile: ${{ secrets.HYPHEN_KEY_FILE }}
      environment: development
      outputs: |-
        files
        variables

  - name: test output
    id: test-output
    run: | # This output will be masked as we add them to GitHub's secret list
      echo "Secret: $SOME_SECRETE"
```

For more information on the Hyphen CLI, see the
[CLI Documentation](https://docs.hyphen.ai/).

---

## Developing the Action

### Initial Setup

After you've cloned the repository to your local machine or codespace, you'll
need to perform some initial setup steps before you can develop your action.

1. :hammer_and_wrench: Install the dependencies

   ```bash
   npm install
   ```

1. :building_construction: Package the TypeScript for distribution

   ```bash
   npm run bundle
   ```

1. :white_check_mark: Run the tests

   ```bash
   $ npm test

   PASS  __tests__/main.test.ts (6.54 s)
      √ runs successfully with valid inputs (8 ms)
      √ sets HYPHEN_DEV environment variable if hyphen-dev input is true (1 ms)
      √ fails the workflow if an error occurs
   ...
   ```

### Packaging the Action

TypeScript actions require you to commit the compiled version of the code (e.g.
the dist folder). The
[Check-Dist action](https://github.com/Hyphen/env-action/actions/workflows/check-dist.yml)
will make sure you remembered to update the dist folder.

### Validate the Action

You can now validate the action by referencing it in a workflow file. For
example, [`ci.yml`](./.github/workflows/ci.yml) demonstrates how to reference an
action in the same repository.

```yaml
integration-tests:
  name: Integration Tests
  strategy:
    matrix:
      os: [ubuntu-latest, windows-latest, macos-latest]
  runs-on: ${{ matrix.os }}
  steps:
    - name: Use Node.js 20
      uses: actions/setup-node@v4
      with:
        node-version: 20
    - name: Checkout
      id: checkout
      uses: actions/checkout@v4
    - name: setup hx CLI
      id: setup
      uses: Hyphen/setup-hx-action@v1
      with:
        apiKey: ${{ secrets.HYPHEN_API_KEY }}
        hyphen-dev: true
    - name: Test Local Action
      id: test-action
      uses: ./
      with:
        hxKeyFile: ${{ secrets.HYPHEN_KEY_FILE }}
        environment: development
        outputs: |-
          files
          variables
    - name: test outputs
      id: test-outputs
      run: | # this checks for both files and variables being set
        node ./integration-test.js
```

For workflow runs, check out the
[Actions tab](https://github.com/Hyphen/env-action/actions)! :rocket:

### Version

For information about versioning your action, see
[Versioning](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)
in the GitHub Actions toolkit.

### Publishing a New Release

This project includes a helper script, [`script/release`](./script/release)
designed to streamline the process of tagging and pushing new releases for
GitHub Actions.

GitHub Actions allows users to select a specific version of the action to use,
based on release tags. This script simplifies this process by performing the
following steps:

1. **Retrieving the latest release tag:** The script starts by fetching the most
   recent SemVer release tag of the current branch, by looking at the local data
   available in your repository.
1. **Prompting for a new release tag:** The user is then prompted to enter a new
   release tag. To assist with this, the script displays the tag retrieved in
   the previous step, and validates the format of the inputted tag (vX.X.X). The
   user is also reminded to update the version field in package.json.
1. **Tagging the new release:** The script then tags a new release and syncs the
   separate major tag (e.g. v1, v2) with the new release tag (e.g. v1.0.0,
   v2.1.2). When the user is creating a new major release, the script
   auto-detects this and creates a `releases/v#` branch for the previous major
   version.
1. **Pushing changes to remote:** Finally, the script pushes the necessary
   commits, tags and branches to the remote repository. From here, you will need
   to create a new release in GitHub so users can easily reference the new tags
   in their workflows.
