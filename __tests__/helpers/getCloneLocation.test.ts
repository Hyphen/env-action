import getCloneLocation from '../../src/helpers/getCloneLocation';
import * as core from '@actions/core';

jest.mock('@actions/core');

describe('getCloneLocation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the path from core.getInput if provided', () => {
    (core.getInput as jest.Mock).mockReturnValue('custom/path');

    const result = getCloneLocation();

    expect(result).toBe('custom/path');
  });

  it('should return the GITHUB_WORKSPACE environment variable if core.getInput is not provided', () => {
    (core.getInput as jest.Mock).mockReturnValue('');
    process.env['GITHUB_WORKSPACE'] = 'github/workspace';

    const result = getCloneLocation();

    expect(result).toBe('github/workspace');
  });

  it('should return the current working directory if neither core.getInput nor GITHUB_WORKSPACE are provided', () => {
    (core.getInput as jest.Mock).mockReturnValue('');
    delete process.env['GITHUB_WORKSPACE'];
    const cwd = process.cwd();

    const result = getCloneLocation();

    expect(result).toBe(cwd);
  });
});
