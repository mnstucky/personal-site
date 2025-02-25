'use client';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { TerminalLine } from './types/terminalLine';
import { WindowSizes } from './types/windowSizes';
import { help } from './terminalUtilities/help';
import { cat } from './terminalUtilities/cat';
import { ls } from './terminalUtilities/ls';
import { cd } from './terminalUtilities/cd';
import { echo } from './terminalUtilities/echo';
import { baseCommands, getCompletion } from './terminalUtilities/tabCompletion';
import { grep } from './terminalUtilities/grep';

export default function Home() {
  const [path, setPath] = useState('/');
  const [terminalContent, setTerminalContent] = useState<TerminalLine[]>([]);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [windowSize, setWindowSize] = useState(WindowSizes.Normal);
  const [commandStack, setCommandStack] = useState<string[]>([]);
  const [commandStackPos, setCommandStackPos] = useState(0);

  // Anchor terminal to the bottom on each render
  useEffect(() => {
    const input = document.querySelector('.terminal');
    if (input) {
      input.scrollTop = input.scrollHeight;
    }
  });

  const getPrompt = useCallback(
    (newPath: string | undefined = undefined) => {
      if (newPath === undefined) {
        return `@site-visitor ->${path} $ `;
      }
      setPath(newPath);
      return `@site-visitor ->${newPath} $ `;
    },
    [path]
  );

  // Setup after first render
  useEffect(() => {
    // Set timer to show tooltip after a 2 second delay
    const timer = setTimeout(() => {
      setTooltipVisible(true);
    }, 2000);

    // Focus the input
    const input = document.querySelector('input');
    if (input) {
      input.focus();
    }

    // Handle CTRL+L to clear the terminal
    const handleKey = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'l') {
        event.preventDefault();
        setTerminalContent([[]]);
        setInputValue('');
        return false;
      }
    };

    window.addEventListener('keydown', handleKey);

    // Redirect focus to input on any clicks on the terminal
    const handleClick = () => {
      const input = document.querySelector('input');
      if (input) {
        input.focus();
      }
    };

    const terminal = document.querySelector('.terminal');
    terminal?.addEventListener('click', handleClick);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKey);
      terminal?.removeEventListener('click', handleClick);
      clearTimeout(timer);
    };
  }, []);

  const addLines = (lines: TerminalLine[]) => {
    setTerminalContent((prev) => [...prev, ...lines]);
  };

  const handleCommand = (command: string) => {
    setTooltipVisible(false);
    setCommandStack(commandStack.concat(command));
    const pipedCommands = command.split(' | ');
    let pipedOutput: TerminalLine[] = [];
    for (const pipedCommand of pipedCommands) {
      pipedOutput = getOutput(pipedCommand, pipedOutput);
    }
    addLines(pipedOutput);
  };

  const getOutput = (command: string, pipedInput: TerminalLine[]) => {
    if (command.trim().toLowerCase() === 'help') {
      return help();
    } else if (command.toLowerCase().startsWith('cat')) {
      return cat(command);
    } else if (command.trim().toLowerCase() === 'ls') {
      return ls(path);
    } else if (command.toLowerCase().startsWith('cd')) {
      return cd(command, path, setPath);
    } else if (command.startsWith('echo')) {
      return echo(command);
    } else if (command.trim().toLowerCase() === 'clear') {
      setTerminalContent([[]]);
      setInputValue('');
      return [];
    } else if (command.trim().toLowerCase().startsWith('grep')) {
      const pattern = command.slice(command.indexOf('-E ') + 2).trim();
      return grep(pipedInput, pattern);
    } else {
      return [
        [
          {
            text: `bash: ${command}: command not found`,
            color: 'text-red-400',
          },
        ],
      ];
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTooltipVisible(false);
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addLines([
        [
          { text: getPrompt(), color: 'text-sky-100' },
          { text: inputValue, color: 'text-sky-100' },
        ],
      ]);
      handleCommand(inputValue);
      setInputValue('');
      setCommandStackPos(0);
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      let completion = inputValue;
      if (inputValue.toLowerCase().startsWith('cat ')) {
        completion =
          'cat ' +
          getCompletion(
            inputValue.substring(4).trim().toLowerCase(),
            ls(path).flatMap((line) => line.map((item) => item.text))
          );
      } else if (inputValue.toLowerCase().startsWith('cd ')) {
        completion =
          'cd ' +
          getCompletion(
            inputValue.substring(3).trim().toLowerCase(),
            ls(path).flatMap((line) => line.map((item) => item.text))
          );
      } else {
        completion = getCompletion(inputValue, baseCommands);
      }
      setInputValue(completion);
    }
    if (e.key === 'ArrowUp') {
      let pastCommandPos = commandStack.length - 1 - commandStackPos;
      if (pastCommandPos < 0) {
        pastCommandPos = 0;
      }
      const pastCommand = commandStack[pastCommandPos];
        setCommandStackPos(commandStackPos + 1);
      setInputValue(pastCommand);
    } 
  };

  return (
    <div
      className={`
        grid 
        justify-items-center 
        items-center
        min-h-screen 
        max-h-screen 
        ${
          windowSize === WindowSizes.Maximized
            ? 'p-0 sm:pt-0 pb-0 grid-rows-[1fr_2.5rem]'
            : 'p-3 pt-20 pb-10 grid-rows-[1fr_5rem]'
        }
        transition-all
        duration-300
        font-[family-name:var(--font-geist-mono)]`}
    >
      <main
        className={`
          row-start-1 
          relative 
          w-full 
          ${windowSize === WindowSizes.Maximized ? 'max-w-full' : 'max-w-4xl'}
          transition-all
          duration-300
          flex-1
          overflow-y-auto  
          h-full`}
      >
        <div className='h-50 bg-zinc-700 rounded-t-md shadow-md px-4 py-2 flex items-center justify-between'>
          <div className='flex gap-2'>
            <div className='h-4 w-4 bg-red-500 rounded-lg'></div>
            <div
              className='h-4 w-4 bg-amber-300 rounded-lg cursor-pointer hover:bg-amber-200'
              onClick={() => setWindowSize(WindowSizes.Normal)}
            ></div>
            <div
              className='h-4 w-4 bg-emerald-500 rounded-lg cursor-pointer hover:bg-emerald-400'
              onClick={() => setWindowSize(WindowSizes.Maximized)}
            ></div>
          </div>
          <p className='text-zinc-50'>Matt Stucky</p>
          <div className='w-14'></div>
        </div>
        <div
          className={`
          bg-zinc-900 
          text-sky-100 
          shadow-md 
          rounded-b-md 
          p-3 
          relative 
          overflow-y-auto
          overflow-x-hidden
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-zinc-100
          [&::-webkit-scrollbar-thumb]:bg-gray-300
          dark:[&::-webkit-scrollbar-track]:bg-neutral-700
          dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
          flex-1
          max-h-[calc(100%-2.5rem)]
          min-h-[calc(100%-2.5rem)]
          terminal
          `}
        >
          <div className='whitespace-pre-wrap'>
            {terminalContent.map((line, i) => (
              <div key={i} className='flex flex-wrap'>
                {line.map((segment, j) => (
                  <span key={`${i}-${j}`} className={segment.color}>
                    {segment.text}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className='flex'>
            <span className='text-nowrap'>{getPrompt().trim()}&nbsp;</span>
            <input
              type='text'
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className='bg-transparent border-none outline-none text-sky-100 w-full'
            />
          </div>
          <div
            className={`
              absolute 
              top-[calc(50%-2rem)] 
              flex 
              justify-center 
              w-full 
              transition-opacity 
              duration-1000 
              ${tooltipVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            <p className='text-sm text-zinc-400 p-3'>
              Stuck? Try typing &apos;help&apos; and pressing Enter.
            </p>
          </div>
        </div>
      </main>
      <footer className='row-start-2 flex gap-6 flex-wrap items-center justify-center'>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://www.linkedin.com/in/matt-stucky-66166339/'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image
            aria-hidden
            src='/LI-In-Bug.png'
            alt='LinkedIn icon'
            width={18}
            height={18}
          />
          LinkedIn
        </a>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://github.com/mnstucky'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image
            aria-hidden
            src='/github-mark.svg'
            alt='GitHub icon'
            width={17}
            height={17}
          />
          GitHub →
        </a>
      </footer>
    </div>
  );
}
