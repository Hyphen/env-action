import * as core from '@actions/core';
import * as fs from 'fs/promises';
import getAndValidateInputs from '../src/helpers/getAndValidateInputs';
import checkForCLI from '../src/helpers/checkForCli';
import getWorkspacePath from '../src/helpers/getWorkspacePath';
import setupMetaDataFiles from '../src/helpers/setupMetadataFiles';
import pullForEnvironment from '../src/helpers/pullForEnvironment';
import setEnvironmentVariables from '../src/helpers/setEnvironmentVariables';
import { run } from '../src/main';

jest.mock('@actions/core');
jest.mock('fs/promises');
jest.mock('../src/helpers/getAndValidateInputs');
jest.mock('../src/helpers/checkForCli');
jest.mock('../src/helpers/getWorkspacePath');
jest.mock('../src/helpers/setupMetadataFiles');
jest.mock('../src/helpers/pullForEnvironment');
jest.mock('../src/helpers/setEnvironmentVariables');

describe('run', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should run successfully with valid inputs', async () => {
    (getAndValidateInputs as jest.Mock).mockReturnValue({
      hxKeyFile: 'keyfile',
      writeFiles: true,
      writeVariables: true,
      environment: 'test-env',
      variablePrefix: 'prefix'
    });
    (getWorkspacePath as jest.Mock).mockResolvedValue('/workspace');
    (core.getMultilineInput as jest.Mock).mockReturnValue([
      'output1',
      'output2'
    ]);
    (fs.readdir as jest.Mock).mockResolvedValue(['file1', 'file2']);
    (core.isDebug as jest.Mock).mockReturnValue(true);

    await run();

    expect(getAndValidateInputs).toHaveBeenCalled();
    expect(checkForCLI).toHaveBeenCalled();
    expect(getWorkspacePath).toHaveBeenCalledWith(true);
    expect(setupMetaDataFiles).toHaveBeenCalledWith(
      '/workspace',
      'keyfile',
      true
    );
    expect(pullForEnvironment).toHaveBeenCalledWith('default', '/workspace');
    expect(pullForEnvironment).toHaveBeenCalledWith('test-env', '/workspace');
    expect(setEnvironmentVariables).toHaveBeenCalledWith(
      '/workspace',
      'test-env',
      'prefix'
    );
    expect(core.info).toHaveBeenCalledWith('outputs length: 2');
    expect(core.info).toHaveBeenCalledWith('outputs: output1, output2');
    expect(core.startGroup).toHaveBeenCalledWith('workspace files');
    expect(core.info).toHaveBeenCalledWith('file1');
    expect(core.info).toHaveBeenCalledWith('file2');
    expect(core.endGroup).toHaveBeenCalled();
  });

  it('should handle errors and fail the workflow', async () => {
    const errorMessage = 'Test error';
    (getAndValidateInputs as jest.Mock).mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await run();

    expect(core.setFailed).toHaveBeenCalledWith(errorMessage);
  });
});
