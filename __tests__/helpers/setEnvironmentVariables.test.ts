/* eslint-disable @typescript-eslint/no-explicit-any */
import { jest } from '@jest/globals';
import * as core from '@actions/core';
import * as dotenv from 'dotenv';
import * as fs from 'fs/promises';
import path from 'path';
import setEnvironmentVariables from '../../src/helpers/setEnvironmentVariables';

jest.mock('@actions/core');
jest.mock('dotenv');
jest.mock('fs/promises');

describe('setEnvironmentVariables', () => {
  const mockWorkspace = '/mock/workspace';
  const mockEnvironment = 'development';
  const mockVariablePrefix = 'PREFIX_';
  const mockDefaultEnvContent = 'KEY1=value1\nKEY2=value2';
  const mockDevelopmentEnvContent = 'KEY2=dev_value2\nKEY3=dev_value3';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should read and parse .env and .env.{environment} files', async () => {
    (fs.readFile as any)
      .mockResolvedValueOnce(mockDefaultEnvContent)
      .mockResolvedValueOnce(mockDevelopmentEnvContent);
    (dotenv.parse as any)
      .mockReturnValueOnce({ KEY1: 'value1', KEY2: 'value2' })
      .mockReturnValueOnce({ KEY2: 'dev_value2', KEY3: 'dev_value3' });

    await setEnvironmentVariables(
      mockWorkspace,
      mockEnvironment,
      mockVariablePrefix
    );

    expect(fs.readFile).toHaveBeenCalledWith(
      path.join(mockWorkspace, '.env'),
      'utf8'
    );
    expect(fs.readFile).toHaveBeenCalledWith(
      path.join(mockWorkspace, `.env.${mockEnvironment}`),
      'utf8'
    );
    expect(dotenv.parse).toHaveBeenCalledWith(mockDefaultEnvContent);
    expect(dotenv.parse).toHaveBeenCalledWith(mockDevelopmentEnvContent);
  });

  it('should export and set secrets for environment variables with the correct prefix', async () => {
    (fs.readFile as any)
      .mockResolvedValueOnce(mockDefaultEnvContent)
      .mockResolvedValueOnce(mockDevelopmentEnvContent);
    (dotenv.parse as any)
      .mockReturnValueOnce({ KEY1: 'value1', KEY2: 'value2' })
      .mockReturnValueOnce({ KEY2: 'dev_value2', KEY3: 'dev_value3' });

    await setEnvironmentVariables(
      mockWorkspace,
      mockEnvironment,
      mockVariablePrefix
    );

    expect(core.exportVariable).toHaveBeenCalledWith('PREFIX_KEY1', 'value1');
    expect(core.exportVariable).toHaveBeenCalledWith(
      'PREFIX_KEY2',
      'dev_value2'
    );
    expect(core.exportVariable).toHaveBeenCalledWith(
      'PREFIX_KEY3',
      'dev_value3'
    );
    expect(core.setSecret).toHaveBeenCalledWith('value1');
    expect(core.setSecret).toHaveBeenCalledWith('dev_value2');
    expect(core.setSecret).toHaveBeenCalledWith('dev_value3');
    expect(core.debug).toHaveBeenCalledWith('exported PREFIX_KEY1');
    expect(core.debug).toHaveBeenCalledWith('exported PREFIX_KEY2');
    expect(core.debug).toHaveBeenCalledWith('exported PREFIX_KEY3');
  });
});
