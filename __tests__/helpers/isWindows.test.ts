import * as os from 'os';
import isWindows from '../../src/helpers/isWindows';

jest.mock('os');

describe('isWindows', () => {
  const osMock = os as jest.Mocked<typeof os>;

  it('returns true when os.type() is "Windows_NT"', () => {
    osMock.type.mockReturnValue('Windows_NT');
    expect(isWindows()).toBe(true);
  });

  it('returns false when os.type() is not "Windows_NT"', () => {
    osMock.type.mockReturnValue('Linux');
    expect(isWindows()).toBe(false);
  });

  it('returns false when os.type() is "Darwin"', () => {
    osMock.type.mockReturnValue('Darwin');
    expect(isWindows()).toBe(false);
  });

  it('returns false when os.type() is "Unknown"', () => {
    osMock.type.mockReturnValue('Unknown');
    expect(isWindows()).toBe(false);
  });

  it('returns false when os.type() is an empty string', () => {
    osMock.type.mockReturnValue('');
    expect(isWindows()).toBe(false);
  });
});
