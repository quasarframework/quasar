import { PropType } from 'vue';

type IsKeyRequired<T, Keys extends keyof T> =
  { [Key in Keys]?: T[Key] } extends Pick<T, Keys> ? false : true;

/**
 * @example
 * ```ts
 * props: {
 *   ...(QBtn['props'] as PropOptions<QBtnProps>),
 * }
 * ```
 */
export type PropOptions<T> = {
  [K in keyof Required<T>]: {
    type: PropType<T[K]>;
    required: IsKeyRequired<T, K>;
  };
};
