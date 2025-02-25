import { TerminalLine } from '../types/terminalLine';

export const grep = (
  input: TerminalLine[],
  pattern: string
): TerminalLine[] => {
  const result: TerminalLine[] = [];
  for (const line of input) {
    for (const segment of line) {
      if (matchPattern(segment.text, pattern)) {
        result.push(line);
      }
    }
  }
  return result;
};

function matchAtPosition(inputChar: string, pattern: string): boolean {
  if (pattern === '' || pattern === undefined) {
    return true;
  } else if (pattern.length === 1) {
    return pattern === '.' || inputChar === pattern;
  } else if (pattern === '\\d') {
    return inputChar >= '0' && inputChar <= '9';
  } else if (pattern === '\\w') {
    return inputChar.toLowerCase() !== inputChar.toUpperCase();
  } else if (pattern.startsWith('[^') && pattern.endsWith(']')) {
    const charactersToNotMatch = pattern.substring(2, pattern.length - 1);
    return !charactersToNotMatch.includes(inputChar);
  } else if (pattern.startsWith('[') && pattern.endsWith(']')) {
    const charactersToMatch = pattern.substring(1, pattern.length - 1);
    return charactersToMatch.includes(inputChar);
  } else {
    throw new Error(`Unhandled pattern: ${pattern}`);
  }
}

function getPatternToMatch(pattern: string, patternPos: number) {
  let patternToMatch = pattern[patternPos] ?? '';
  if (patternToMatch === '\\') {
    patternToMatch = pattern.substring(patternPos, patternPos + 2);
  } else if (patternToMatch === '[') {
    const endOfGroup = pattern.substring(patternPos).indexOf(']');
    patternToMatch = pattern.substring(patternPos, endOfGroup + 1);
  }
  return patternToMatch;
}

function getXOrMore(
  pattern: string,
  patternPos: number,
  patternToMatch: string,
  operator: string
) {
  if (pattern.length > patternPos + 1 && pattern[patternPos + 1] === operator) {
    return patternToMatch;
  }
  return '';
}

function getStartingPatternPos(pattern: string) {
  const startOfLine = pattern.startsWith('^');
  return startOfLine ? 1 : 0;
}

function getStartingExtraPatternCharacters(pattern: string) {
  const endOfLine = pattern.endsWith('$');
  return endOfLine ? 1 : 0;
}

function matchProblemAtStartOfLine(pattern: string, matchAtPos: boolean) {
  const startOfLine = pattern.startsWith('^');
  if (startOfLine && !matchAtPos) {
    return true;
  }
  return false;
}

function matchProblemAtEndOfLine(
  pattern: string,
  matchAtPos: boolean,
  inputPos: number,
  inputLine: string
) {
  const endOfLine = pattern.endsWith('$');
  if (endOfLine && !matchAtPos && inputPos === inputLine.length - 1) {
    return false;
  }
}

function matchPattern(inputLine: string, pattern: string): boolean {
  if (pattern.includes('|')) {
    const pattern1 =
      pattern.slice(0, pattern.indexOf('(')) +
      pattern.slice(pattern.indexOf('(') + 1, pattern.indexOf('|')) +
      pattern.slice(pattern.indexOf(')') + 1);
    const pattern2 =
      pattern.slice(0, pattern.indexOf('(')) +
      pattern.slice(pattern.indexOf('|') + 1, pattern.indexOf(')')) +
      pattern.slice(pattern.indexOf(')') + 1);
    return (
      matchPattern(inputLine, pattern1) || matchPattern(inputLine, pattern2)
    );
  }
  return matchSubPattern(inputLine, pattern);
}

function matchSubPattern(inputLine: string, pattern: string): boolean {
  let oneOrMore = '';
  let inputPosAtStartOfOneOrMore = -1;
  let patternPos = getStartingPatternPos(pattern);
  let extraPatternCharacters = getStartingExtraPatternCharacters(pattern);
  let matchAtPos = false;
  for (let inputPos = 0; inputPos < inputLine.length; inputPos++) {
    const patternToMatch = getPatternToMatch(pattern, patternPos);
    const zeroOrMore = getXOrMore(pattern, patternPos, patternToMatch, '?');
    matchAtPos = matchAtPosition(inputLine[inputPos], patternToMatch);
    // If we've reached the end of a + or ? operator, move to the next part of the pattern
    if (!matchAtPos && (oneOrMore || zeroOrMore)) {
      inputPos -= 1;
      patternPos += 2;
      extraPatternCharacters += 1;
    }
    if (
      matchProblemAtStartOfLine(pattern, matchAtPos) ||
      matchProblemAtEndOfLine(pattern, matchAtPos, inputPos, inputLine)
    ) {
      return false;
    }
    // Track the start of a + pattern
    const previousOneOrMore = oneOrMore;
    oneOrMore = getXOrMore(pattern, patternPos, patternToMatch, '+');
    if (!previousOneOrMore && oneOrMore) {
      inputPosAtStartOfOneOrMore = inputPos;
    }
    // Move forward in the pattern to the next character
    if (matchAtPos && !oneOrMore && !zeroOrMore) {
      patternPos += patternToMatch.length;
    }
    // Backtrack if at the end of a + pattern
    if (
      oneOrMore &&
      patternPos < pattern.length - extraPatternCharacters &&
      inputPos === inputLine.length - 1
    ) {
      patternPos += 2;
      inputPos = inputPosAtStartOfOneOrMore + 1;
    }
  }
  if (patternPos < pattern.length - extraPatternCharacters) {
    return false;
  }
  return matchAtPos;
}
