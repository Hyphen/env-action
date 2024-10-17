import { jest } from '@jest/globals';
import * as core from '@actions/core';
import * as io from '@actions/io';
import getWorkspacePath from '../../src/helpers/getWorkspacePath';
import getCloneLocation from '../../src/helpers/getCloneLocation';
import path from 'path';

jest.mock('@actions/core');
jest.mock('@actions/io');
jest.mock('../../src/helpers/getCloneLocation');

describe('getWorkspacePath', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the clone location when writeFiles is true', async () => {
    const mockPath = '/mock/path';
    (getCloneLocation as jest.Mock).mockReturnValue(mockPath);

    const result = await getWorkspacePath(true);

    expect(result).toBe(mockPath);
    expect(getCloneLocation).toHaveBeenCalled();
    expect(io.mkdirP).not.toHaveBeenCalled();
  });

  it('should return a temp directory path and create it when writeFiles is false', async () => {
    const mockTempDir = '/mock/temp';
    const mockWorkspacePath = path.join(mockTempDir, 'hyphen-temp');
    process.env['RUNNER_TEMP'] = mockTempDir;
    (core.toPlatformPath as jest.Mock).mockReturnValue(mockWorkspacePath);

    const result = await getWorkspacePath(false);

    expect(result).toBe(mockWorkspacePath);
    expect(io.mkdirP).toHaveBeenCalledWith(mockWorkspacePath);
  });

  it('should log debug message if core.isDebug is true', async () => {
    const mockTempDir = '/mock/temp';
    const mockWorkspacePath = path.join(mockTempDir, 'hyphen-temp');
    process.env['RUNNER_TEMP'] = mockTempDir;
    (core.toPlatformPath as jest.Mock).mockReturnValue(mockWorkspacePath);
    (core.isDebug as jest.Mock).mockReturnValue(true);

    await getWorkspacePath(false);

    expect(core.debug).toHaveBeenCalledWith(
      `using the following workspace path: ${mockWorkspacePath}`
    );
  });
});
