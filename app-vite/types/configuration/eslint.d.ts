
export interface QuasarEslintConfiguration {
  /**
   * Should it report warnings?
   * @default true
   */
  warnings?: boolean;

  /**
   * Should it report errors?
   * @default true
   */
  errors?: boolean;

  /**
   * Fix on save
   */
  fix?: boolean;

  /**
   * Raw options to send to ESLint
   */
  rawOptions?: object;

  /**
   * Files to include (can be in glob format)
   */
  include?: string[];

  /**
   * Files to exclude (can be in glob format).
   * Recommending to use .eslintignore file instead.
   */
  exclude?: string[];
}
