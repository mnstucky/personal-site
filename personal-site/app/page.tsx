'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [path, setPath] = useState('/');
  let prompt = `@site-visitor ->${path} $ `;
  const [terminal, setTerminal] = useState(prompt);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'l') {
        event.preventDefault();
        setTerminal(prompt);
        console.log('worked');
        return false;
      }
    };

    window.addEventListener('keydown', handleKey);

    return () => window.removeEventListener('keydown', handleKey);
  }, [prompt]);

  function getPrompt(newPath: string | undefined = undefined) {
    if (newPath === undefined) {
      return `@site-visitor ->${path} $ `;
    }
    setPath(newPath);
    return `@site-visitor ->${newPath} $ `;
  }

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
        window.open('https://github.com/mnstucky', '_blank', 'noopener,noreferrer');
        setTerminal(str + getPrompt('\\github\\'));
        return;
      }
      if (command.endsWith(' linkedin')) {
        window.open('https://www.linkedin.com/in/matt-stucky-66166339/', '_blank', 'noopener,noreferrer');
        setTerminal(str + getPrompt('\\linkedin\\'));
        return;
      }
      if (path !== '/' && command.endsWith(' ..') || command.endsWith(' //')) {
        setTerminal(str + getPrompt('\\'));
        return;
      }
      setTerminal(
        `${str}bash: cd: ${lastLine
          .substring(1)
          .trim()}: No such file or directory\n${getPrompt()}`);
      return;
    }
    if (command.startsWith('echo ')) {
      const result = command.substring(command.indexOf('echo') + 4);
      setTerminal(
        `${str}${result.trim()}\n${getPrompt()}`);
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
        <textarea
          className='bg-slate-900 text-sky-200 shadow-md rounded-md p-3 focus:outline-none'
          value={terminal}
          rows={20}
          cols={60}
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
            src='/file.svg'
            alt='File icon'
            width={16}
            height={16}
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
            alt='Globe icon'
            width={16}
            height={16}
          />
          GitHub →
        </a>
      </footer>
    </div>
  );
}
