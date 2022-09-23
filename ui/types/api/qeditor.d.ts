// src/components/editor/editor-caret.js#Caret
// We are not exposing the whole API, just the ones that might be needed outside.
export interface QEditorCaret {
  readonly selection: Selection | null;
  readonly hasSelection: boolean;
  readonly range: Range | null;
  readonly parent: Element | null;
  readonly blockParent: Element | null;

  save(range: Range): void;
  restore(range?: Range): void;
  savePosition(): void;
  restorePosition(length?: number): void;
  is(commandId: string, param?: string): boolean;
  can(commandId: string): boolean;
  apply(commandId: string, param?: string, done?: () => void): boolean;
}
