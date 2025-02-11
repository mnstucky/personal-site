export const getCompletion = (input: string, choices: string[]): string => {
  const sortedChoices = choices.sort();
  for (const choice of sortedChoices) {
    if (choice.toLowerCase().startsWith(input.toLowerCase())) {
      return choice;
    }
  }
  return input;
};

export const baseCommands = ['help', 'cat', 'ls', 'cd', 'echo', 'clear'];
