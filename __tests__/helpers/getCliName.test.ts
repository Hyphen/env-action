import getCLIName from '../../src/helpers/getCliName';
import isWindows from '../../src/helpers/isWindows';

jest.mock('../../src/helpers/isWindows');

describe('getCLIName', () => {
  const isWindowsMock = isWindows as jest.MockedFunction<typeof isWindows>;

  it('returns "hx.exe" when isWindows() returns true', () => {
    isWindowsMock.mockReturnValue(true);
    expect(getCLIName()).toBe('hx.exe');
  });

  it('returns "hx" when isWindows() returns false', () => {
    isWindowsMock.mockReturnValue(false);
    expect(getCLIName()).toBe('hx');
  });
});
