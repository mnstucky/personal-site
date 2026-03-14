'use client';
import Image from 'next/image';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { TerminalLine } from './types/terminalLine';
import { WindowSizes } from './types/windowSizes';
import { help } from './terminalUtilities/help';
import { cat } from './terminalUtilities/cat';
import { ls } from './terminalUtilities/ls';
import { cd } from './terminalUtilities/cd';
import { echo } from './terminalUtilities/echo';
import { baseCommands, getCompletion } from './terminalUtilities/tabCompletion';
import { grep } from './terminalUtilities/grep';
import { reducer, initialState } from './terminalReducer';

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    path, terminalContent, tooltipVisible, inputValue,
    windowSize, commandStack, commandStackPos,
    dragPosition, fixedSize, isAnimatingToMaximized, suppressTransition,
  } = state;

  const mainRef = useRef<HTMLElement>(null);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const isResizing = useRef(false);
  const resizeStart = useRef({ mouseX: 0, mouseY: 0, width: 0, height: 0 });

  // Anchor terminal to the bottom on each render
  useEffect(() => {
    const terminal = document.querySelector('.terminal');
    if (terminal) {
      terminal.scrollTop = terminal.scrollHeight;
    }
  });

  const getPrompt = useCallback(
    () => `@site-visitor ->${path} $ `,
    [path]
  );

  const handleTitleBarMouseDown = useCallback((e: React.MouseEvent) => {
    if (windowSize === WindowSizes.Maximized) return;
    e.preventDefault();
    const rect = mainRef.current!.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - (dragPosition?.x ?? rect.left),
      y: e.clientY - (dragPosition?.y ?? rect.top),
    };
    dispatch({ type: 'INIT_DRAG', x: rect.left, y: rect.top, width: rect.width, height: rect.height });
    isDragging.current = true;
  }, [windowSize, dragPosition]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    if (windowSize === WindowSizes.Maximized) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = mainRef.current!.getBoundingClientRect();
    resizeStart.current = { mouseX: e.clientX, mouseY: e.clientY, width: rect.width, height: rect.height };
    dispatch({ type: 'INIT_RESIZE', x: rect.left, y: rect.top, width: rect.width, height: rect.height });
    isResizing.current = true;
  }, [windowSize]);

  // Setup after first render
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_TOOLTIP_VISIBLE', visible: true });
    }, 2000);

    const input = document.querySelector('input');
    if (input) input.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'l') {
        event.preventDefault();
        dispatch({ type: 'CLEAR_TERMINAL' });
        return false;
      }
    };
    window.addEventListener('keydown', handleKey);

    const handleClick = () => {
      const input = document.querySelector('input');
      if (input) input.focus();
    };
    const terminal = document.querySelector('.terminal');
    terminal?.addEventListener('click', handleClick);

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        dispatch({ type: 'UPDATE_DRAG', x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
      }
      if (isResizing.current) {
        dispatch({
          type: 'UPDATE_RESIZE',
          width: Math.max(320, resizeStart.current.width + (e.clientX - resizeStart.current.mouseX)),
          height: Math.max(200, resizeStart.current.height + (e.clientY - resizeStart.current.mouseY)),
        });
      }
    };
    const handleMouseUp = () => {
      isDragging.current = false;
      isResizing.current = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKey);
      terminal?.removeEventListener('click', handleClick);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (windowSize !== WindowSizes.Maximized) return;
    if (!dragPosition && !fixedSize) return;
    // Animate the fixed element to fullscreen before handing off to CSS layout.
    // Double RAF ensures the transition style is committed to the DOM in frame N
    // before the position change triggers it in frame N+1.
    let timer: ReturnType<typeof setTimeout>;
    const outer = requestAnimationFrame(() => {
      dispatch({ type: 'BEGIN_MAXIMIZE_ANIMATION' });
      requestAnimationFrame(() => {
        dispatch({ type: 'SET_MAXIMIZE_TARGET', width: window.innerWidth, height: window.innerHeight });
        timer = setTimeout(() => {
          // Suppress transition for one frame so the CSS layout handoff
          // is instantaneous — no bounce from the height difference.
          dispatch({ type: 'END_MAXIMIZE_ANIMATION' });
          requestAnimationFrame(() => dispatch({ type: 'RESTORE_TRANSITION' }));
        }, 320);
      });
    });
    return () => {
      cancelAnimationFrame(outer);
      clearTimeout(timer);
    };
  }, [windowSize]); // eslint-disable-line react-hooks/exhaustive-deps

  const getOutput = (command: string, pipedInput: TerminalLine[]): TerminalLine[] => {
    if (command.trim().toLowerCase() === 'help') {
      return help();
    } else if (command.toLowerCase().startsWith('cat')) {
      return cat(command);
    } else if (command.trim().toLowerCase() === 'ls') {
      return ls(path);
    } else if (command.toLowerCase().startsWith('cd')) {
      return cd(command, path, (newPath) => dispatch({ type: 'SET_PATH', path: newPath }));
    } else if (command.startsWith('echo')) {
      return echo(command);
    } else if (command.trim().toLowerCase() === 'clear') {
      dispatch({ type: 'CLEAR_TERMINAL' });
      return [];
    } else if (command.trim().toLowerCase().startsWith('grep')) {
      const pattern = command.slice(command.indexOf('-E ') + 2).trim();
      return grep(pipedInput, pattern);
    } else {
      return [[{ text: `bash: ${command}: command not found`, color: 'text-red-400' }]];
    }
  };

  const handleCommand = (command: string) => {
    dispatch({ type: 'SET_TOOLTIP_VISIBLE', visible: false });
    dispatch({ type: 'PUSH_COMMAND', command });
    const pipedCommands = command.split(' | ');
    let pipedOutput: TerminalLine[] = [];
    for (const pipedCommand of pipedCommands) {
      pipedOutput = getOutput(pipedCommand, pipedOutput);
    }
    dispatch({ type: 'ADD_LINES', lines: pipedOutput });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_TOOLTIP_VISIBLE', visible: false });
    dispatch({ type: 'SET_INPUT', value: e.target.value });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      dispatch({ type: 'ADD_LINES', lines: [[
        { text: getPrompt(), color: 'text-sky-100' },
        { text: inputValue, color: 'text-sky-100' },
      ]]});
      handleCommand(inputValue);
      dispatch({ type: 'SET_INPUT', value: '' });
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      let completion = inputValue;
      if (inputValue.toLowerCase().startsWith('cat ')) {
        completion = 'cat ' + getCompletion(
          inputValue.substring(4).trim().toLowerCase(),
          ls(path).flatMap((line) => line.map((item) => item.text))
        );
      } else if (inputValue.toLowerCase().startsWith('cd ')) {
        completion = 'cd ' + getCompletion(
          inputValue.substring(3).trim().toLowerCase(),
          ls(path).flatMap((line) => line.map((item) => item.text))
        );
      } else {
        completion = getCompletion(inputValue, baseCommands);
      }
      dispatch({ type: 'SET_INPUT', value: completion });
    }
    if (e.key === 'ArrowUp') {
      let pastCommandPos = commandStack.length - 1 - commandStackPos;
      if (pastCommandPos < 0) pastCommandPos = 0;
      dispatch({ type: 'SET_COMMAND_STACK_POS', pos: commandStackPos + 1 });
      dispatch({ type: 'SET_INPUT', value: commandStack[pastCommandPos] });
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
        ref={mainRef}
        className={`
          row-start-1
          relative
          w-full
          ${windowSize === WindowSizes.Maximized ? 'max-w-full' : 'max-w-4xl'}
          ${!dragPosition && !suppressTransition ? 'transition-all duration-300' : ''}
          flex-1
          overflow-y-auto
          h-full`}
        style={dragPosition && fixedSize ? {
          position: 'fixed',
          left: dragPosition.x,
          top: dragPosition.y,
          width: fixedSize.width,
          height: fixedSize.height,
          transition: isAnimatingToMaximized ? 'all 300ms' : undefined,
        } : undefined}
      >
        <div
          className={`h-50 bg-zinc-700 rounded-t-md shadow-md px-4 py-2 flex items-center justify-between ${windowSize !== WindowSizes.Maximized ? 'cursor-grab' : ''}`}
          onMouseDown={handleTitleBarMouseDown}
        >
          <div className='flex gap-2'>
            <div className='h-4 w-4 bg-red-500 rounded-lg'></div>
            <div
              className='h-4 w-4 bg-amber-300 rounded-lg cursor-pointer hover:bg-amber-200'
              onClick={() => dispatch({ type: 'SET_WINDOW_SIZE', size: WindowSizes.Normal })}
            ></div>
            <div
              className='h-4 w-4 bg-emerald-500 rounded-lg cursor-pointer hover:bg-emerald-400'
              onClick={() => dispatch({ type: 'SET_WINDOW_SIZE', size: WindowSizes.Maximized })}
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
              <div key={i} className='flex flex-wrap min-h-[1em]'>
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
        {windowSize !== WindowSizes.Maximized && (
          <div
            className='absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize'
            onMouseDown={handleResizeMouseDown}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" className='absolute bottom-1 right-1 text-zinc-500 opacity-50 hover:opacity-100'>
              <line x1="2" y1="10" x2="10" y2="2" stroke="currentColor" strokeWidth="1.5" />
              <line x1="6" y1="10" x2="10" y2="6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        )}
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
