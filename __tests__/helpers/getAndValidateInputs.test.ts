import getAndValidateInputs from '../../src/helpers/getAndValidateInputs';
import * as core from '@actions/core';

jest.mock('@actions/core');

describe('getAndValidateInputs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('defaults the output to files', () => {
    (core.getInput as jest.Mock).mockImplementation((name: string) => {
      switch (name) {
        case 'hxKeyFile':
          return 'keyfile';
        case 'environment':
          return 'production';
        case 'variablePrefix':
          return 'prefix';
        default:
          return '';
      }
    });
    (core.getMultilineInput as jest.Mock).mockReturnValue(undefined);

    const result = getAndValidateInputs();

    expect(result).toEqual({
      hxKeyFile: 'keyfile',
      environment: 'production',
      writeFiles: true,
      writeVariables: false,
      variablePrefix: 'prefix'
    });
  });

  it('should return valid outputs', () => {
    (core.getInput as jest.Mock).mockImplementation((name: string) => {
      switch (name) {
        case 'hxKeyFile':
          return 'keyfile';
        case 'environment':
          return 'production';
        case 'variablePrefix':
          return 'prefix';
        default:
          return '';
      }
    });
    (core.getMultilineInput as jest.Mock).mockReturnValue([
      'files',
      'variables'
    ]);

    const result = getAndValidateInputs();

    expect(result).toEqual({
      hxKeyFile: 'keyfile',
      environment: 'production',
      writeFiles: true,
      writeVariables: true,
      variablePrefix: 'prefix'
    });
  });

  it('should handle invalid outputs', () => {
    (core.getInput as jest.Mock).mockImplementation((name: string) => {
      switch (name) {
        case 'hxKeyFile':
          return 'keyfile';
        case 'environment':
          return 'production';
        case 'variablePrefix':
          return 'prefix';
        default:
          return '';
      }
    });
    (core.getMultilineInput as jest.Mock).mockReturnValue(['invalidOutput']);

    expect(() => getAndValidateInputs()).toThrow('No valid outputs found');
  });

  it('should handle mixed valid and invalid outputs', () => {
    (core.getInput as jest.Mock).mockImplementation((name: string) => {
      switch (name) {
        case 'hxKeyFile':
          return 'keyfile';
        case 'environment':
          return 'production';
        case 'variablePrefix':
          return 'prefix';
        default:
          return '';
      }
    });
    (core.getMultilineInput as jest.Mock).mockReturnValue([
      'files',
      'invalidOutput'
    ]);

    const result = getAndValidateInputs();

    expect(result).toEqual({
      hxKeyFile: 'keyfile',
      environment: 'production',
      writeFiles: true,
      writeVariables: false,
      variablePrefix: 'prefix'
    });
  });

  it('should throw an error if no valid outputs are found', () => {
    (core.getInput as jest.Mock).mockImplementation((name: string) => {
      switch (name) {
        case 'hxKeyFile':
          return 'keyfile';
        case 'environment':
          return 'production';
        case 'variablePrefix':
          return 'prefix';
        default:
          return '';
      }
    });
    (core.getMultilineInput as jest.Mock).mockReturnValue([]);

    expect(() => getAndValidateInputs()).toThrow('No valid outputs found');
  });
});
