import checkForCLI from '../../src/helpers/checkForCli';
import getCLIName from '../../src/helpers/getCliName';
import * as toolCache from '@actions/tool-cache';
import * as core from '@actions/core';

jest.mock('../../src/helpers/getCliName');
jest.mock('@actions/tool-cache');
jest.mock('@actions/core');

describe('checkForCLI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not throw an error if the CLI tool is found', () => {
    (getCLIName as jest.Mock).mockReturnValue('hx');
    (toolCache.findAllVersions as jest.Mock).mockReturnValue(['1.0.0']);

    expect(() => checkForCLI()).not.toThrow();

    expect(getCLIName).toHaveBeenCalled();
    expect(toolCache.findAllVersions).toHaveBeenCalledWith('hx');
    expect(core.info).not.toHaveBeenCalled();
    expect(core.debug).toHaveBeenCalledWith('hx CLI versions found: 1.0.0');
  });

  it('should throw an error if the CLI tool is not found', () => {
    (getCLIName as jest.Mock).mockReturnValue('hx');
    (toolCache.findAllVersions as jest.Mock).mockReturnValue([]);

    expect(() => checkForCLI()).toThrow('hx command line not found');

    expect(getCLIName).toHaveBeenCalled();
    expect(toolCache.findAllVersions).toHaveBeenCalledWith('hx');
    expect(core.info).toHaveBeenCalledWith(
      expect.stringContaining(
        'We were unable to find the hx command line tool.'
      )
    );
  });
});
