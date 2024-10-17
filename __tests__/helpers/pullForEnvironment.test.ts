/* eslint-disable @typescript-eslint/no-explicit-any */
import { jest } from '@jest/globals';
import { exec } from '@actions/exec';
import pullForEnvironment from '../../src/helpers/pullForEnvironment';

jest.mock('@actions/exec');

describe('pullForEnvironment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should execute the command successfully', async () => {
    (exec as any).mockResolvedValue(0);

    await expect(
      pullForEnvironment('test-env', '/mock/workspace')
    ).resolves.not.toThrow();

    expect(exec).toHaveBeenCalledWith('hx env pull test-env', undefined, {
      cwd: '/mock/workspace'
    });
  });

  it('should throw an error if the command fails', async () => {
    (exec as any).mockResolvedValue(1);

    await expect(
      pullForEnvironment('test-env', '/mock/workspace')
    ).rejects.toThrow('hx env pull test-env failed with code: 1');

    expect(exec).toHaveBeenCalledWith('hx env pull test-env', undefined, {
      cwd: '/mock/workspace'
    });
  });
});
