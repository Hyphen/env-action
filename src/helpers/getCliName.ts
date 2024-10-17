import isWindows from './isWindows';

export default function getCLIName(): string {
  return isWindows() ? 'hx.exe' : 'hx';
}
