'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { resumeData } from './data/resume';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className='bg-zinc-950 text-zinc-100 min-h-screen font-[family-name:var(--font-geist-mono)]'>
      {/* Nav */}
      <div className='fixed top-0 z-50 left-1/2 -translate-x-1/2 w-full lg:max-w-[60%] pointer-events-none'>

        {/* Unscrolled nav */}
        <div className={`relative flex items-center justify-between px-12 py-6 pointer-events-auto transition-opacity duration-300 ${scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <span className='font-bold tracking-tight'>Matt Stucky</span>
          <div className='flex gap-8'>
            <Link href='/terminal' className='text-sm text-zinc-400 hover:text-zinc-100 transition-colors duration-200'>
              Terminal
            </Link>
          </div>
          <div className={`absolute bottom-0 left-0 right-0 h-px bg-zinc-300/50 origin-center transition-transform ease-in-out ${scrolled ? 'duration-500 delay-0 scale-x-0' : 'duration-300 delay-300 scale-x-100'}`} />
        </div>

        {/* Bubble nav */}
        <div className='absolute top-0 left-0 right-0 flex justify-center'>
          <nav className={`pointer-events-auto flex items-center justify-between mt-4 w-[calc(100%-3rem)] rounded-full bg-zinc-900/80 backdrop-blur-md shadow-2xl px-6 py-3 border border-zinc-800/80 transition-all ease-in-out ${scrolled ? 'duration-500 delay-500 opacity-100 translate-y-0' : 'duration-300 delay-0 opacity-0 -translate-y-4 pointer-events-none'}`}>
            <span className='font-bold tracking-tight'>Matt Stucky</span>
            <div className='flex gap-8'>
              <Link href='/terminal' className='text-sm text-zinc-400 hover:text-zinc-100 transition-colors duration-200'>
                Terminal
              </Link>
            </div>
          </nav>
        </div>

      </div>

      {/* Content container */}
      <div className='w-full lg:max-w-[60%] mx-auto'>
        {/* Hero */}
        <section className='min-h-screen flex flex-col lg:flex-row items-center justify-center gap-16 px-12 pt-24 lg:pt-0'>
          {/* Text */}
          <div className='flex flex-col items-center text-center lg:items-start lg:text-left'>
            <p className='text-xs text-zinc-500 tracking-[0.3em] uppercase mb-6'>
              Senior Software Engineer
            </p>
            <h1 className='text-7xl sm:text-9xl font-bold leading-none tracking-tight mb-8 bg-gradient-to-r from-violet-400 via-pink-300 to-orange-300 bg-clip-text text-transparent'>
              Hi, I&apos;m Matt.
            </h1>
            <p className='text-zinc-400 text-lg sm:text-xl max-w-xl leading-relaxed'>
              I design and build software — clean code, thoughtful interfaces,
              and the latest AI innovations.
            </p>
            <div className='mt-12 flex gap-6'>
              <Link
                href='/terminal'
                className='px-6 py-3 rounded-full bg-zinc-100 text-zinc-950 text-sm font-semibold hover:bg-white transition-colors duration-200'
              >
                Open Terminal
              </Link>
              <a
                href='#about'
                className='px-6 py-3 rounded-full border border-zinc-700 text-zinc-300 text-sm hover:border-zinc-500 hover:text-zinc-100 transition-colors duration-200'
              >
                Learn more
              </a>
            </div>
          </div>

          {/* Photo */}
          <div className='shrink-0 p-[2px] rounded-full bg-gradient-to-br from-zinc-400/60 via-zinc-600/30 to-transparent shadow-2xl'>
            <div className='w-56 h-56 sm:w-72 sm:h-72 rounded-full overflow-hidden'>
              <Image
                src='/Matt-Stucky.jpg'
                alt='Matt Stucky'
                width={288}
                height={288}
                className='object-cover w-full h-full'
                priority
              />
            </div>
          </div>
        </section>

        {/* About */}
        <section id='about' className='max-w-3xl mx-auto px-6 py-32'>
          <p className='text-xs text-zinc-500 tracking-[0.3em] uppercase mb-4'>
            About
          </p>
          <h2 className='relative inline-block text-4xl font-bold pb-4 mb-10 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[5px] after:rounded-full after:bg-gradient-to-r after:from-violet-400 after:via-pink-300 after:to-orange-300'>About me</h2>
          <div className='space-y-6 text-zinc-400 leading-relaxed text-lg'>
            <p>
              I&apos;m a senior software engineer based in Wichita, KS with a
              track record of leading transformative projects across .NET,
              TypeScript, React, and C++, with a recent focus on building AI
              systems. To me, coding is a craft, and I strive to maximize output
              -- using the latest innovations -- while creating clean,
              maintainable code.
            </p>
            <p>
              Over the years I&apos;ve built custom CRM systems, full UI
              component libraries, data-driven AI systems, deployment platforms,
              and full-stack applications across industries — from banking to
              satellite analytics.
            </p>
            <p>
              Outside of work I enjoy exploring new technologies and goofing
              around with my two kids.
            </p>
          </div>
        </section>

        {/* Work */}
        <section className='max-w-3xl mx-auto px-6 py-32'>
          <p className='text-xs text-zinc-500 tracking-[0.3em] uppercase mb-4'>
            Work
          </p>
          <h2 className='relative inline-block text-4xl font-bold pb-4 mb-10 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[5px] after:rounded-full after:bg-gradient-to-r after:from-violet-400 after:via-pink-300 after:to-orange-300'>Experience</h2>
          <div className='space-y-4'>
            {resumeData.experience.map((job) => (
              <div
                key={`${job.role}-${job.company}`}
                className='group border border-zinc-800 hover:border-zinc-600 rounded-2xl p-6 transition-colors duration-300'
              >
                <div className='flex items-start justify-between gap-4'>
                  <div>
                    <h3 className='text-lg font-semibold text-zinc-100'>
                      {job.role}
                    </h3>
                    <p className='text-zinc-500 text-sm mt-1'>{job.company}</p>
                  </div>
                  <span className='text-xs text-zinc-600 whitespace-nowrap mt-1'>
                    {job.period}
                  </span>
                </div>
                <ul className='mt-4 space-y-1'>
                  {job.bullets.map((bullet, i) => (
                    <li key={i} className='text-zinc-400 text-sm leading-relaxed flex gap-2'>
                      <span className='text-zinc-600 shrink-0'>–</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className='border-t border-zinc-800 py-12'>
          <div className='px-6 flex items-center justify-between text-zinc-400 text-sm'>
            <div className='flex gap-6'>
              <a
                href='https://www.linkedin.com/in/matt-stucky-66166339/'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 hover:text-zinc-300 transition-colors duration-200'
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
                href='https://github.com/mnstucky'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 hover:text-zinc-300 transition-colors duration-200'
              >
                <Image
                  aria-hidden
                  src='/github-mark.svg'
                  alt='GitHub icon'
                  width={17}
                  height={17}
                />
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>
      {/* end content container */}
    </div>
  );
}
