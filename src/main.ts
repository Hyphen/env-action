import * as core from '@actions/core';
import * as fs from 'fs/promises';
import getAndValidateInputs from './helpers/getAndValidateInputs';
import checkForCLI from './helpers/checkForCli';
import getWorkspacePath from './helpers/getWorkspacePath';
import setupMetaDataFiles from './helpers/setupMetadataFiles';
import pullForEnvironment from './helpers/pullForEnvironment';
import setEnvironmentVariables from './helpers/setEnvironmentVariables';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const {
      hxKeyFile,
      writeFiles,
      writeVariables,
      environment,
      variablePrefix
    } = getAndValidateInputs();

    checkForCLI();

    const workspace = await getWorkspacePath(writeFiles);

    await setupMetaDataFiles(workspace, hxKeyFile, writeFiles);

    const outputs = core.getMultilineInput('outputs');
    core.info(`outputs length: ${outputs.length}`);
    core.info(`outputs: ${outputs.join(', ')}`);

    await pullForEnvironment('default', workspace);
    await pullForEnvironment(environment, workspace);

    if (core.isDebug()) {
      core.startGroup('workspace files');
      const files = await fs.readdir(workspace);
      for (const file of files) {
        core.info(file);
      }
      core.endGroup();
    }

    if (writeVariables) {
      setEnvironmentVariables(workspace, environment, variablePrefix);
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
    return;
  }
}
