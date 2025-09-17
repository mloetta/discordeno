import fs from 'fs';
import path from 'path';

export const ReadableFileSizeUnits = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

export function ReadableFileSize(bytes: number, micro = false, precision = 1): string {
  const thresh = micro ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }

  let unit = -1;
  const round = 10 ** precision;

  do {
    bytes /= thresh;
    ++unit;
  } while (Math.round(Math.abs(bytes) * round) / round >= thresh && unit < ReadableFileSizeUnits.length - 1);

  return `${bytes.toFixed(precision)} ${ReadableFileSizeUnits[unit]}`;
}

export function FormatTime(duration: number | string) {
  const total = Math.floor(Number(duration) / 1000);
  const days = Math.floor(total / (24 * 60 * 60));
  const hours = Math.floor((total % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((total % (60 * 60)) / 60);
  const seconds = total % 60;
  const milliseconds = Math.floor((Number(duration) % 1000) / 100);

  const parts = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);
  if (milliseconds > 0) parts.push(`${milliseconds}ms`);

  return parts.join(' ');
}

export function Commas(num: number | string) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function ReadDirRecursive(dir: string, callback: (filepath: string, filename: string) => any): any[] {
  return fs.readdirSync(path.resolve(dir)).flatMap((filename) => {
    const filepath = path.resolve(dir, filename);

    if (fs.statSync(filepath).isDirectory()) {
      return ReadDirRecursive(filepath, callback);
    }

    return callback(filepath, filename);
  });
}

export function Debounce(fn: any, delay: number) {
  let timeout: any;

  return function (...args: any) {
    clearTimeout(timeout);
    timeout = setTimeout(fn.bind(null, ...args), delay);
  };
}

const table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  table[i] = c;
}

export function CRC32(string: string): string {
  let crc = -1;
  for (let i = 0; i < string.length; i++) {
    crc = table[(crc ^ string.charCodeAt(i)) & 0xff]! ^ (crc >>> 8);
  }

  const hash = -(crc + 1) >>> 0;
  return hash.toString(16).padStart(8, '0');
}

export function ComponentCustomId(customId: string, ...args: any[]): string {
  if (args.length) return `${customId}-${args.map((arg) => String(arg)).join(',')}`;

  return customId;
}

export function ClosestMatch(input: string, strings: readonly string[]): string | null {
  if (typeof input !== 'string') throw new TypeError('Input must be a string');
  if (!Array.isArray(strings)) throw new TypeError('Strings must be an array');
  for (const s of strings) {
    if (typeof s !== 'string') throw new TypeError('Strings must only contain strings');
  }

  if (strings.length === 0) return null;
  if (strings.length === 1) {
    const [only] = strings;
    return only ?? null;
  }

  let minDistance = Number.MAX_VALUE;
  let best: string | null = null;

  for (const candidate of strings) {
    const distance = LevenshteinDistance(input, candidate);
    if (distance < minDistance) {
      minDistance = distance;
      best = candidate;
    }
  }

  return best;
}

export function LevenshteinDistance(a: string, b: string): number {
  if (typeof a !== 'string' || typeof b !== 'string') {
    throw new TypeError('Levenshtein Distance expects two strings');
  }

  if (a === b) return 0;
  const n = a.length;
  const m = b.length;
  if (n === 0) return m;
  if (m === 0) return n;

  let prev: Uint32Array = new Uint32Array(m + 1);
  let curr: Uint32Array = new Uint32Array(m + 1);

  for (let j = 0; j <= m; j++) {
    prev[j] = j;
  }

  for (let i = 1; i <= n; i++) {
    curr[0] = i;
    const ai = a.charCodeAt(i - 1);

    for (let j = 1; j <= m; j++) {
      const cost = ai === b.charCodeAt(j - 1) ? 0 : 1;

      const del = (prev[j] as number) + 1;
      const ins = (curr[j - 1] as number) + 1;
      const sub = (prev[j - 1] as number) + cost;

      curr[j] = Math.min(del, ins, sub);
    }

    const tmp = prev;
    prev = curr;
    curr = tmp;
  }

  return prev[m] as number;
}

export async function ReadDirectory(dir: string): Promise<any[]> {
  const results = await Promise.all(
    ReadDirRecursive(dir, async (file) => {
      delete require.cache[require.resolve(file)];

      const module = await import(file);
      return module;
    })
  )

  return results;
}