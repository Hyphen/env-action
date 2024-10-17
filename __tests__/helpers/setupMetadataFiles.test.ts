import { jest } from '@jest/globals';
import * as fs from 'fs/promises';
import * as io from '@actions/io';
import setupMetadataFiles from '../../src/helpers/setupMetadataFiles';
import getCloneLocation from '../../src/helpers/getCloneLocation';
import path from 'path';

jest.mock('fs/promises');
jest.mock('@actions/io');
jest.mock('../../src/helpers/getCloneLocation');

describe('setupMetaDataFiles', () => {
  const mockWorkspace = '/mock/workspace';
  const mockHxKeyFile = 'mock-hx-key-file-content';
  const mockCloneLocation = '/mock/clone/location';

  beforeEach(() => {
    jest.clearAllMocks();
    (getCloneLocation as jest.Mock).mockReturnValue(mockCloneLocation);
  });

  it('should only write the .hxkey file when writeFiles is true', async () => {
    await setupMetadataFiles(mockWorkspace, mockHxKeyFile, true);

    expect(io.cp).not.toHaveBeenCalled();
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(mockWorkspace, '.hxkey'),
      mockHxKeyFile,
      'utf8'
    );
  });

  it('should copy the .hx directory and write the .hxkey file when writeFiles is false', async () => {
    await setupMetadataFiles(mockWorkspace, mockHxKeyFile, false);

    expect(io.cp).toHaveBeenCalledWith(
      path.join(mockCloneLocation, '.hx'),
      mockWorkspace
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(mockWorkspace, '.hxkey'),
      mockHxKeyFile,
      'utf8'
    );
  });
});
