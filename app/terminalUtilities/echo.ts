import { TerminalLine } from '../types/terminalLine';

export const echo = (command: string): TerminalLine[] => {
  const result = command.substring(5);
  return [[{ text: result.trim(), color: 'text-green-300' }]];
};
