import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatNumber(num: number, options: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat('en-US', options).format(num);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatDate(date: Date | string, formatString: string = 'MMM d, yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d, yyyy h:mm a');
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, 'h:mm a')}`;
  }
  
  if (isYesterday(dateObj)) {
    return `Yesterday at ${format(dateObj, 'h:mm a')}`;
  }
  
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function formatTimeAgo(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phoneNumber;
}

export function formatGPA(gpa: number): string {
  return gpa.toFixed(2);
}

export function formatTestScore(score: number | undefined, testType: 'SAT' | 'ACT'): string {
  if (score === undefined) return 'Not taken';
  
  if (testType === 'SAT') {
    return `${score}/1600`;
  }
  
  if (testType === 'ACT') {
    return `${score}/36`;
  }
  
  return score.toString();
}

export function formatInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatStudentStatus(status: string): {
  label: string;
  color: string;
  bgColor: string;
} {
  const statusMap = {
    Exploring: {
      label: 'Exploring',
      color: 'text-gray-800',
      bgColor: 'bg-gray-100',
    },
    Shortlisting: {
      label: 'Shortlisting',
      color: 'text-yellow-800',
      bgColor: 'bg-yellow-100',
    },
    Applying: {
      label: 'Applying',
      color: 'text-blue-800',
      bgColor: 'bg-blue-100',
    },
    Submitted: {
      label: 'Submitted',
      color: 'text-green-800',
      bgColor: 'bg-green-100',
    },
  };
  
  return statusMap[status as keyof typeof statusMap] || statusMap.Exploring;
}

export function formatCommunicationType(type: string): {
  label: string;
  color: string;
  bgColor: string;
} {
  const typeMap = {
    email: {
      label: 'Email',
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
    },
    sms: {
      label: 'SMS',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-100',
    },
    call: {
      label: 'Call',
      color: 'text-green-700',
      bgColor: 'bg-green-100',
    },
    meeting: {
      label: 'Meeting',
      color: 'text-purple-700',
      bgColor: 'bg-purple-100',
    },
  };
  
  return typeMap[type as keyof typeof typeMap] || typeMap.email;
}