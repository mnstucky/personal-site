import { TerminalSegment } from '../types/terminalSegment';

export const ls = (addLine: (segments: TerminalSegment[]) => void) => {
  addLine([
    { text: 'github', color: 'text-green-400' },
    { text: '\t', color: 'text-sky-100' },
    { text: 'linkedin', color: 'text-green-400' },
    { text: '\t', color: 'text-sky-100' },
    { text: 'resume.txt', color: 'text-sky-100' },
  ]);
};
