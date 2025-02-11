import { TerminalLine } from '../types/terminalLine';

export const cat = (command: string): TerminalLine[] => {
  const target = command.substring(4).trim().toLowerCase();
  if (target === 'resume.txt') {
    return [
      [
        {
          text: `Matt N. Stucky - Senior Software Engineer`,
          color: 'text-green-400',
        },
      ],
      [
        {
          text: 'Senior software engineer with a proven track record of leading transformative projects in .NET, TypeScript, React, and C++.',
          color: 'text-sky-100',
        },
      ],
      [
        {
          text: 'Experience',
          color: 'text-blue-400',
        },
      ],
      [
        {
          text: 'Senior Software Engineer / Supervisor of Application Development',
          color: 'text-purple-400',
        },
      ],
      [
        {
          text: '03/2024 - Present | INTRUST Bank, Wichita, KS',
          color: 'text-sky-200',
        },
      ],
      [
        {
          text: '- Built a custom CRM system for managing bank products, saving roughly $5 million in development, operational, and licensing costs',
          color: 'text-sky-100',
        },
      ],
      [
        {
          text: '- Mentored junior engineers, developing best practices in coding, issue tracking, and technology adoption',
          color: 'text-sky-100',
        },
      ],
      [
        {
          text: '- Starting in 11/2024, supervised a three-person development team',
          color: 'text-sky-100',
        },
      ],
      [
        {
          text: 'Developer',
          color: 'text-purple-400',
        },
      ],
      [
        {
          text: '07/2022 - 03/2024 | INTRUST Bank, Wichita, KS',
          color: 'text-sky-200',
        },
      ],
      [
        {
          text: "- Led the development team's transition from .NET Framework to .NET Core",
          color: 'text-sky-100',
        },
      ],
      [
        {
          text: '- Created a comprehensive UI component library from .NET Blazor',
          color: 'text-sky-100',
        },
      ],
      [
        {
          text: '- Designed a backend framework for internal bank applications',
          color: 'text-sky-100',
        },
      ],
      [
        {
          text: '- Deployed applications to combat check fraud, track employee performance, streamline loan collections, monitor the return of bank cards, manage loans pledged to the Federal Reserve, create property appraisals, track the printing of debit cards, and coordinate customer investments',
          color: 'text-sky-100',
        },
      ],
      [
        {
          text: '- Developed a platform to manage application deployments, which included a notification system for users, error analytics, and dependency tracking',
          color: 'text-sky-100',
        },
      ],
      [
        {
          text: 'Junior Software Engineer',
          color: 'text-purple-400',
        },
      ],
      [
        {
          text: '06/2021 - 07/2022 | LP Technologies, Wichita, KS',
          color: 'text-sky-200',
        },
      ],
      [
        {
          text: '- Designed, implemented, and deployed an inventory-management platform',
          color: 'text-sky-100',
        },
      ],
      [
        {
          text: '- Built features for a data-intensive application using TypeScript, React, and C++',
          color: 'text-sky-100',
        },
      ],
      [
        {
          text: '- Created an analysis suite, complete with historical tools and live alerts, that allowed customers to track weather effects on satellite signals',
          color: 'text-sky-100',
        },
      ],
      [
        {
          text: '- Led the refactor of the company codebase into TypeScript and NestJS',
          color: 'text-sky-100',
        },
      ],
    ];
  } else {
    return [
      [
        {
          text: `bash: cat: ${target}: No such file or directory`,
          color: 'text-red-400',
        },
      ],
    ];
  }
};
