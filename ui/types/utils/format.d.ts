export namespace format {
  function humanStorageSize(size: number) : string;
  function capitalize(text: string) : string;
  function between(v: number, min: number, max: number) : boolean;
  function normalizeToInterval(v: number, min: number, max: number) : number;
  function pad(v: string, length?: number, char?: string) : string;
}