import { TerminalLine } from '../types/terminalLine';

export const clear = (
  setTerminalContent: (lines: TerminalLine[]) => void,
  setInputValue: (input: string) => void
) => {
  setTerminalContent([[]]);
  setInputValue('');
};
