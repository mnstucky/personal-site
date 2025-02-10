import { TerminalSegment } from '../types/terminalSegment';

export const echo = (
  command: string,
  addLine: (segments: TerminalSegment[]) => void
) => {
  const result = command.substring(5);
  addLine([{ text: result.trim(), color: 'text-green-300' }]);
};
