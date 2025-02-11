import { TerminalLine } from '../types/terminalLine';

export const ls = (path: string): TerminalLine[] => {
  if (path !== '/') {
    return [[]];
  }
  return [
    [
      { text: 'github', color: 'text-green-400' },
      { text: '\t', color: 'text-sky-100' },
      { text: 'linkedin', color: 'text-green-400' },
      { text: '\t', color: 'text-sky-100' },
      { text: 'resume.txt', color: 'text-sky-100' },
    ],
  ];
};
