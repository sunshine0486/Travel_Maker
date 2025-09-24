// utils/date.ts
export function formatDateTime(datetimeStr: string | undefined): string {
  if (!datetimeStr) return "";
  const date = new Date(datetimeStr);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
}

// 1mb 이상이면 mb, 미만이면 kb
export const formatSize = (size: number) => {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  }
};
