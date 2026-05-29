/**
 * Minimal structured (JSON) logger for the web tier. One line per event so logs
 * are grep-able and ingestible by any log pipeline. Mirrors the indexer's logger
 * so both halves of the system emit the same shape.
 */
type Level = 'debug' | 'info' | 'warn' | 'error';
type Fields = Record<string, unknown>;

function emit(level: Level, fields: Fields, message: string): void {
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    lvl: level,
    msg: message,
    ...fields,
  });
  if (level === 'error' || level === 'warn') console.error(line);
  else console.log(line);
}

export const logger = {
  debug: (f: Fields, m: string) => emit('debug', f, m),
  info: (f: Fields, m: string) => emit('info', f, m),
  warn: (f: Fields, m: string) => emit('warn', f, m),
  error: (f: Fields, m: string) => emit('error', f, m),
};
