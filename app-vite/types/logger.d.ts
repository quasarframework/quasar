export interface QuasarLoggerProgressOpts {
  tool: string;
  waitAction: string;
  doneAction: string;
  target?: string;
}

export type QuasarLoggerProgressEnd = (opts?: {
  /** Overwrite the initial target */
  target?: string;
  /** Overwrite the initial doneAction */
  doneAction?: string;
}) => void;

/**
 * Logging helpers matching the Quasar CLI output style.
 *
 * When obtained from an app extension's `api.logger`, every method automatically
 * tags its output with `AE (<extId>)` so users can tell which extension produced
 * the line. When obtained from `ctx.logger` (quasar.config) there is no tagging.
 */
export interface QuasarLogger {
  /** Bullet character used by the formatted helpers. */
  readonly dot: string;

  /** Prints a green-bannered message. */
  log: (msg?: string) => void;

  /** Prints a yellow-bannered warning. */
  warn: (msg?: string) => void;

  /** Prints a red-bannered fatal error and exits the process with code 1. */
  fatal: (msg?: string) => never;

  /** Prints a tip line (green "App" banner with the TIP pill). */
  tip: (msg?: string) => void;

  /**
   * Prints an INFO-pilled line. Pass `title` to override the pill text.
   * When called via `api.logger`, the title is composed with the extension id.
   */
  info: (msg: string, title?: string) => void;

  /**
   * Prints a SUCCESS-pilled green line. Pass `title` to override the pill text.
   * When called via `api.logger`, the title is composed with the extension id.
   */
  success: (msg: string, title?: string) => void;

  /**
   * Prints an ERROR-pilled red line. Pass `title` to override the pill text.
   * When called via `api.logger`, the title is composed with the extension id.
   */
  error: (msg: string, title?: string) => void;

  /**
   * Prints a WARNING-pilled yellow line. Pass `title` to override the pill text.
   * When called via `api.logger`, the title is composed with the extension id.
   */
  warning: (msg: string, title?: string) => void;

  /**
   * Starts a "WAIT" progress line. Returns a finish callback that, when called,
   * prints a matching "DONE" line including the elapsed time.
   *
   * @param opts - Options {@link QuasarLoggerProgressOpts}
   * @returns A finish callback {@link QuasarLoggerProgressEnd}
   */
  progress: (opts: QuasarLoggerProgressOpts) => QuasarLoggerProgressEnd;
}
