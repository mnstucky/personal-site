import { TerminalLine } from '../types/terminalLine';

export const grep = (
  input: TerminalLine[],
  pattern: string
): TerminalLine[] => {
  return input.filter(line =>
    line.some(segment => matchPattern(segment.text, pattern))
  );
};

function matchAtPosition(inputChar: string, pattern: string): boolean {
  if (pattern === '' || pattern === undefined) {
    return true;
  } else if (pattern.length === 1) {
    return pattern === '.' || inputChar === pattern;
  } else if (pattern === '\\d') {
    return inputChar >= '0' && inputChar <= '9';
  } else if (pattern === '\\w') {
    return /[a-zA-Z0-9_]/.test(inputChar);
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

function getPatternToMatch(pattern: string, patternPos: number): string {
  let patternToMatch = pattern[patternPos] ?? '';
  if (patternToMatch === '\\') {
    patternToMatch = pattern.substring(patternPos, patternPos + 2);
  } else if (patternToMatch === '[') {
    const endOfGroup = pattern.substring(patternPos).indexOf(']');
    patternToMatch = pattern.substring(patternPos, patternPos + endOfGroup + 1);
  }
  return patternToMatch;
}

function matchHere(
  inputLine: string,
  inputPos: number,
  pattern: string,
  patternPos: number
): boolean {
  if (patternPos >= pattern.length) return true;
  if (pattern[patternPos] === '$' && patternPos === pattern.length - 1) {
    return inputPos === inputLine.length;
  }

  const patternUnit = getPatternToMatch(pattern, patternPos);
  const nextPatternPos = patternPos + patternUnit.length;

  if (nextPatternPos < pattern.length && pattern[nextPatternPos] === '+') {
    if (inputPos >= inputLine.length || !matchAtPosition(inputLine[inputPos], patternUnit)) {
      return false;
    }
    let end = inputPos;
    while (end < inputLine.length && matchAtPosition(inputLine[end], patternUnit)) {
      end++;
    }
    for (let k = end; k > inputPos; k--) {
      if (matchHere(inputLine, k, pattern, nextPatternPos + 1)) return true;
    }
    return false;
  }

  if (nextPatternPos < pattern.length && pattern[nextPatternPos] === '?') {
    if (inputPos < inputLine.length && matchAtPosition(inputLine[inputPos], patternUnit)) {
      if (matchHere(inputLine, inputPos + 1, pattern, nextPatternPos + 1)) return true;
    }
    return matchHere(inputLine, inputPos, pattern, nextPatternPos + 1);
  }

  if (inputPos < inputLine.length && matchAtPosition(inputLine[inputPos], patternUnit)) {
    return matchHere(inputLine, inputPos + 1, pattern, nextPatternPos);
  }

  return false;
}

function matchPattern(inputLine: string, pattern: string): boolean {
  if (pattern.includes('|')) {
    const parenStart = pattern.indexOf('(');
    const parenEnd = pattern.indexOf(')');
    const pipePos = pattern.indexOf('|');
    const prefix = pattern.slice(0, parenStart);
    const suffix = pattern.slice(parenEnd + 1);
    const alt1 = prefix + pattern.slice(parenStart + 1, pipePos) + suffix;
    const alt2 = prefix + pattern.slice(pipePos + 1, parenEnd) + suffix;
    return matchPattern(inputLine, alt1) || matchPattern(inputLine, alt2);
  }

  if (pattern.startsWith('^')) {
    return matchHere(inputLine, 0, pattern, 1);
  }

  for (let i = 0; i <= inputLine.length; i++) {
    if (matchHere(inputLine, i, pattern, 0)) return true;
  }
  return false;
}
