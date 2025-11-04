
export const formatDateTime = (isoString: string, locale: string): string => {
  const loc = locale === 'zh' ? 'zh-CN' : 'en-GB';
  return new Date(isoString).toLocaleString(loc, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDate = (isoString: string, locale: string): string => {
  const loc = locale === 'zh' ? 'zh-CN' : 'en-CA'; // YYYY-MM-DD format
  return new Date(isoString).toLocaleDateString(loc);
};
