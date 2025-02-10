import { TerminalSegment } from '../types/terminalSegment';

export const help = (addLine: (segments: TerminalSegment[]) => void) => {
  addLine([
    {
      text: "Hi! I'm Matt, a senior software engineer. ",
      color: 'text-blue-400',
    },
    {
      text: 'This site is meant to work a bit like a Unix terminal. Not your thing? Head to my LinkedIn and get in touch!\n',
      color: 'text-blue-400',
    },
    {
      text: 'Matt bash, version 1.0-release (x86_64-pc-linux-gnu)\n',
      color: 'text-sky-100',
    },
    {
      text: "These shell commands are defined internally. Type 'help' to see this list.\n",
      color: 'text-sky-100',
    },
  ]);
  addLine([
    { text: 'cat [file]', color: 'text-purple-400' },
    {
      text: ' - print the file contents to the screen',
      color: 'text-sky-100',
    },
  ]);
  addLine([
    { text: 'cd [dir]', color: 'text-purple-400' },
    {
      text: ' - go somewhere, e.g., cd linkedin to visit my LinkedIn\n',
      color: 'text-sky-100',
    },
  ]);
  addLine([
    { text: 'clear', color: 'text-purple-400' },
    {
      text: ' - clear the terminal',
      color: 'text-sky-100',
    },
  ]);
  addLine([
    { text: 'echo [arg ...]', color: 'text-purple-400' },
    { text: ' - print the arg to the screen', color: 'text-sky-100' },
  ]);
  addLine([
    { text: 'ls', color: 'text-purple-400' },
    {
      text: " - see what's available in your current location\n",
      color: 'text-sky-100',
    },
  ]);
};
