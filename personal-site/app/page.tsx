'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [path, setPath] = useState('/');
  const prompt = `@site-visitor ->${path} $ `;
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
  if (terminal.endsWith('\n')) {
    const lines = terminal.split('\n');
    const lastLine = lines[lines.length - 2];
    switch (lastLine.replace(prompt, '').trim()) {
      case 'ls':
        setTerminal(`${terminal}Hi. I'm Matt.\n${prompt}`);
        break;
      default:
        setTerminal(
          `${terminal}bash: ${lastLine
            .substring(1)
            .trim()}: command not found\n${prompt}`
        );
    }
  }
  return (
    <div className='grid grid-rows-[1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-mono)]'>
      <main className='row-start-1'>
        <textarea
          className='bg-slate-900 text-sky-200 shadow-md rounded-md p-3'
          value={terminal}
          rows={20}
          cols={60}
          onChange={(e) => setTerminal(e.target.value)}
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
