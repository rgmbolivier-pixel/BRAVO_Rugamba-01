/** Short locale-aware date (AZ: DD.MM.YYYY style via az-AZ) */
export function formatShortDate(isoOrDate: string | Date, lang: string): string {
  const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(d.getTime())) return '';
  const locale = lang.startsWith('az') ? 'az-AZ' : 'en-GB';
  return d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
}
