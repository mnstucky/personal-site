import { TerminalSegment } from '../types/terminalSegment';

export const cd = (
  command: string,
  path: string,
  setPath: (path: string) => void,
  addLine: (segments: TerminalSegment[]) => void
) => {
  const destination = command.substring(3).trim().toLowerCase();
  if (destination === 'github') {
    window.open('https://github.com/mnstucky', '_blank', 'noopener,noreferrer');
    setPath('\\github\\');
  } else if (destination === 'linkedin') {
    window.open(
      'https://www.linkedin.com/in/matt-stucky-66166339/',
      '_blank',
      'noopener,noreferrer'
    );
    setPath('\\linkedin\\');
  } else if (
    (path !== '\\' && destination === '..') ||
    destination === '/' ||
    destination === '\\'
  ) {
    setPath('\\');
  } else {
    addLine([
      {
        text: `bash: cd: ${destination}: No such file or directory`,
        color: 'text-red-400',
      },
    ]);
  }
};
