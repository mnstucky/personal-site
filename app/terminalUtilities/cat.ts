import { TerminalLine } from '../types/terminalLine';
import { resumeData } from '../data/resume';

export const cat = (command: string): TerminalLine[] => {
  const target = command.substring(4).trim().toLowerCase();
  if (target === 'resume.txt') {
    const lines: TerminalLine[] = [
      [{ text: `${resumeData.name} - ${resumeData.title}`, color: 'text-green-400' }],
      [{ text: resumeData.summary, color: 'text-sky-100' }],
      [{ text: '', color: 'text-sky-100' }],
      [{ text: '', color: 'text-sky-100' }],
      [{ text: 'Experience', color: 'text-blue-400' }],
    ];

    for (const job of resumeData.experience) {
      lines.push([{ text: '', color: 'text-sky-100' }]);
      lines.push([{ text: '', color: 'text-sky-100' }]);
      lines.push([{ text: job.role, color: 'text-purple-400' }]);
      lines.push([{ text: `${job.period} | ${job.company}`, color: 'text-sky-200' }]);
      for (const bullet of job.bullets) {
        lines.push([{ text: `- ${bullet}`, color: 'text-sky-100' }]);
      }
    }

    return lines;
  } else if (target === 'github' || target === 'linkedin') {
    return [
      [
        {
          text: `cat: ${target}: Is a directory`,
          color: 'text-red-400',
        },
      ],
    ];
  } else {
    return [
      [
        {
          text: `cat: ${target}: No such file or directory`,
          color: 'text-red-400',
        },
      ],
    ];
  }
};
