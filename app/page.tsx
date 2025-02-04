'use client';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

export default function Home() {
  const [path, setPath] = useState('/');
  const [terminal, setTerminal] = useState('@site-visitor ->/ $ ');

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

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'l') {
        event.preventDefault();
        setTerminal(getPrompt());
        return false;
      }
    };

    window.addEventListener('keydown', handleKey);

    return () => window.removeEventListener('keydown', handleKey);
  }, [getPrompt]);

  function parseTerminal(str: string): void {
    const enterPressed = str.endsWith('\n');
    const lines = str.split('\n');
    const lastLine = lines[lines.length - (enterPressed ? 2 : 1)];
    if (!lastLine.startsWith(getPrompt())) {
      return;
    }
    if (!enterPressed) {
      setTerminal(str);
      return;
    }
    const command = lastLine.replace(getPrompt(), '');
    if (command.trim() === 'ls') {
      setTerminal(`${str}github\tlinkedin\n${getPrompt()}`);
      return;
    }
    if (command.startsWith('cd ')) {
      if (command.endsWith(' github')) {
        window.open(
          'https://github.com/mnstucky',
          '_blank',
          'noopener,noreferrer'
        );
        setTerminal(str + getPrompt('\\github\\'));
        return;
      }
      if (command.endsWith(' linkedin')) {
        window.open(
          'https://www.linkedin.com/in/matt-stucky-66166339/',
          '_blank',
          'noopener,noreferrer'
        );
        setTerminal(str + getPrompt('\\linkedin\\'));
        return;
      }
      if (
        (path !== '/' && command.endsWith(' ..')) ||
        command.endsWith(' //')
      ) {
        setTerminal(str + getPrompt('\\'));
        return;
      }
      setTerminal(
        `${str}bash: cd: ${lastLine
          .substring(1)
          .trim()}: No such file or directory\n${getPrompt()}`
      );
      return;
    }
    if (command.startsWith('echo ')) {
      const result = command.substring(command.indexOf('echo') + 4);
      setTerminal(`${str}${result.trim()}\n${getPrompt()}`);
      return;
    }
    setTerminal(
      `${str}bash: ${lastLine
        .substring(1)
        .trim()}: command not found\n${getPrompt()}`
    );
  }

  return (
    <div className='grid grid-rows-[1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-mono)]'>
      <main className='row-start-1'>
        <div className='h-50 bg-zinc-700 rounded-t-md shadow-md px-4 py-2 flex items-center justify-between'>
          <div className='flex gap-2'>
            <div className='h-4 w-4 bg-red-500 rounded-lg'></div>
            <div className='h-4 w-4 bg-amber-300 rounded-lg'></div>
            <div className='h-4 w-4 bg-emerald-500 rounded-lg'></div>
          </div>
          <p className='text-zinc-50'>Matt Stucky</p>
          <div className='w-14'></div>
        </div>
        <textarea
          className='bg-zinc-900 text-sky-100 shadow-md rounded-b-md p-3 focus:outline-none w-full'
          style={{ resize: 'none' }}
          value={terminal}
          rows={20}
          cols={80}
          onChange={(e) => parseTerminal(e.target.value)}
        ></textarea>
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
