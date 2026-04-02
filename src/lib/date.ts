export function formatDateTime(value?: string | null) {
  if (!value) {
    return 'Unavailable';
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatDate(value?: string | null) {
  if (!value) {
    return 'Unavailable';
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
  }).format(new Date(value));
}

export function addSeconds(date: Date, seconds: number) {
  return new Date(date.getTime() + seconds * 1000);
}

export function toDateInputValue(value?: string | null) {
  if (!value) {
    return '';
  }

  return new Date(value).toISOString().slice(0, 10);
}
