'use client';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

type TerminalSegment = {
  text: string;
  color?: string;
};

type TerminalLine = TerminalSegment[];

export default function Home() {
  const [path, setPath] = useState('/');
  const [terminalContent, setTerminalContent] = useState<TerminalLine[]>([]);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

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

  // Start timer to fade in tooltip
  useEffect(() => {
    const timer = setTimeout(() => {
      setTooltipVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Start cursor inside terminal window
  useEffect(() => {
    const input = document.querySelector('input');
    if (input) {
      input.focus();
    }
  }, []);

  // Setup keyboard hotkeys
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'l') {
        event.preventDefault();
        setTerminalContent([[]]);
        setInputValue('');
        setTimeout(() => {
          setTooltipVisible(true);
        }, 2000);
        return false;
      }
    };

    window.addEventListener('keydown', handleKey);

    const handleClick = () => {
      const input = document.querySelector('input');
      if (input) {
        input.focus();
      }
    };

    const main = document.querySelector('main');
    main?.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKey);
      main?.removeEventListener('click', handleClick);
    }
  }, [getPrompt]);

  const addLine = (segments: TerminalSegment[]) => {
    setTerminalContent((prev) => [...prev, segments]);
  };

  const handleCommand = (command: string) => {
    setTooltipVisible(false);

    if (command.trim().toLowerCase() === 'help') {
      addLine([
        {
          text: "Hi! I'm Matt, a senior software engineer. ",
          color: 'text-green-400',
        },
        {
          text: 'This site is meant to work a bit like a Unix terminal. Not your thing? Head to my LinkedIn and get in touch!\n',
          color: 'text-green-400',
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
        { text: 'cd [dir]', color: 'text-purple-400' },
        {
          text: ' - go somewhere, e.g., cd linkedin to visit my LinkedIn\n',
          color: 'text-sky-100',
        },
      ]);
      addLine([
        { text: 'ls', color: 'text-purple-400' },
        {
          text: " - see what's available in your current location\n",
          color: 'text-sky-100',
        },
      ]);
      addLine([
        { text: 'echo [arg ...]', color: 'text-purple-400' },
        { text: ' - print the arg to the screen', color: 'text-sky-100' },
      ]);
    } else if (command.trim().toLowerCase() === 'ls') {
      addLine([
        { text: 'github', color: 'text-blue-400' },
        { text: '\t', color: 'text-sky-100' },
        { text: 'linkedin', color: 'text-blue-400' },
      ]);
    } else if (command.toLowerCase().startsWith('cd ')) {
      const destination = command.substring(3).trim().toLowerCase();
      if (destination === 'github') {
        window.open(
          'https://github.com/mnstucky',
          '_blank',
          'noopener,noreferrer'
        );
        setPath('\\github\\');
      } else if (destination === 'linkedin') {
        window.open(
          'https://www.linkedin.com/in/matt-stucky-66166339/',
          '_blank',
          'noopener,noreferrer'
        );
        setPath('\\linkedin\\');
      } else if (
        (path !== '/' && destination === '..') ||
        destination === '//'
      ) {
        setPath('\\');
      } else {
        addLine([
          {
            text: `bash: cd: ${destination}: No such file or directory`,
            color: 'text-red-400',
          },
        ]);
      }
    } else if (command.startsWith('echo ')) {
      const result = command.substring(5);
      addLine([{ text: result.trim(), color: 'text-green-300' }]);
    } else {
      addLine([
        { text: `bash: ${command}: command not found`, color: 'text-red-400' },
      ]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTooltipVisible(false);
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addLine([
        { text: getPrompt(), color: 'text-sky-100' },
        { text: inputValue, color: 'text-sky-100' },
      ]);
      handleCommand(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className={`
        grid 
        grid-rows-[1fr_20px] 
        justify-items-center 
        items-center
        min-h-screen 
        max-h-screen 
        p-3
        pb-10
        sm:pt-20
        sm:pb-15
        font-[family-name:var(--font-geist-mono)]`}>
      <main className={`
          row-start-1 
          relative 
          w-full 
          max-w-3xl 
          max-h-[calc(100%-5rem)]
          min-h-[calc(100%-5rem)]
          h-full`}>
        <div className='h-50 bg-zinc-700 rounded-t-md shadow-md px-4 py-2 flex items-center justify-between'>
          <div className='flex gap-2'>
            <div className='h-4 w-4 bg-red-500 rounded-lg'></div>
            <div className='h-4 w-4 bg-amber-300 rounded-lg'></div>
            <div className='h-4 w-4 bg-emerald-500 rounded-lg'></div>
          </div>
          <p className='text-zinc-50'>Matt Stucky</p>
          <div className='w-14'></div>
        </div>
        <div className={`
          bg-zinc-900 
          text-sky-100 
          shadow-md 
          rounded-b-md 
          p-3 
          relative 
          overflow-y-a  [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-zinc-100
          [&::-webkit-scrollbar-thumb]:bg-gray-300
          dark:[&::-webkit-scrollbar-track]:bg-neutral-700
          dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500uto
          overflow-x-hidden
          max-h-[calc(100%-5rem)]
          min-h-[calc(100%-5rem)]
          terminal
          `}>
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
            className={`absolute top-[calc(50%-2rem)] flex justify-center w-full transition-opacity duration-1000 ${tooltipVisible ? 'opacity-100' : 'opacity-0'
              }`}
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
