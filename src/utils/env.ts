import fs from 'fs';
import { join } from 'path';

export namespace Env {
  export const Path = join(process.cwd(), '.env');
  export const Cache: Record<string, string> = {};

  export class Env {
    constructor(
      private key: string,
      private value: string,
    ) {}

    ToInt() {
      return Math.floor(this.ToNumber());
    }

    ToArray<T = any>() {
      try {
        const parsed = JSON.parse(this.value);
        if (!Array.isArray(parsed)) throw new Error();
        return parsed as T[];
      } catch {
        throw new Error(`item '${this.key}' is not a valid JSON array`);
      }
    }

    ToObject<T = Record<string, any>>() {
      try {
        const parsed = JSON.parse(this.value);
        if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') throw new Error();
        return parsed as T;
      } catch {
        throw new Error(`item '${this.key}' is not a valid JSON object`);
      }
    }

    ToNumber() {
      const num = Number(this.value);
      if (isNaN(num)) throw new Error(`item '${this.key}' is not a valid number`);
      return num;
    }

    ToString() {
      return this.value;
    }

    ToBoolean() {
      const val = this.value.toLowerCase();
      if (val === 'true') return true;
      if (val === 'false') return false;
      throw new Error(`item '${this.key}' is not a valid boolean`);
    }
  }

  export function Get(key: string) {
    return Cache.hasOwnProperty(key) ? new Env(key, Cache[key]!) : undefined;
  }

  export function Set(key: string, value: any) {
    Cache[key] = ItemToString(value);
    return Get(key);
  }

  export function Save() {
    fs.writeFileSync(Path, ToString(), 'utf-8');
  }

  export function Required(key: string) {
    const item = Get(key);
    if (!item) throw new Error(`item '${key}' is required`);
    return item;
  }

  export function Default(key: string, fallback: any) {
    let item = Get(key);
    if (!item) {
      Set(key, fallback);
      item = Get(key)!;
    }
    return item;
  }

  export function Load() {
    if (!fs.existsSync(Path)) return;
    const content = fs.readFileSync(Path, 'utf-8');

    content.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith(';')) return;

      const indexEq = trimmed.indexOf('=');
      const indexColon = trimmed.indexOf(':');

      let index = -1;
      if (indexEq === -1 && indexColon === -1) return;
      if (indexEq === -1) index = indexColon;
      else if (indexColon === -1) index = indexEq;
      else index = Math.min(indexEq, indexColon);

      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim();

      Cache[key] = value;
    });
  }

  export function ItemToString(item: any) {
    return typeof item === 'object' ? JSON.stringify(item) : String(item);
  }

  export function ToString() {
    return Object.entries(Cache)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
  }

  Load();
}
