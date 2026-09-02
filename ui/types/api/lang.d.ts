export type LangGetClosestIsoNameMethodType = <T extends string>(
  locale: string | undefined,
  isoNames: readonly T[]
) => T | undefined;
