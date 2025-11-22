import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isToday, isYesterday } from 'date-fns';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLastSeen(isoString: string): string {
  const date = new Date(isoString);
  
  if (isToday(date)) {
    return `today at ${format(date, 'p')}`;
  }
  
  if (isYesterday(date)) {
    return `yesterday at ${format(date, 'p')}`;
  }
  
  return format(date, 'MMM d \'at\' p');
}
