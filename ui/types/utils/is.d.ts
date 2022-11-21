interface is {
  /**
   * Recursively checks if one Object is equal to another.
   * Also supports Map, Set, ArrayBuffer, Regexp, Date, and many more.
   *
   * @example
   * const objA = { foo: 1, bar: { baz: 2 } }
   * const objB = { foo: 1, bar: { baz: 2 } }
   * objA === objB // false
   * is.deepEqual(objA, objB) // true
   */
  // Can't do it both ways, see: https://github.com/microsoft/TypeScript/issues/26916#issuecomment-555691585
  deepEqual<T>(obj1: T, obj2: unknown): obj2 is T;

  /**
   * Checks if a value is an object.
   * Note: Map, Set, ArrayBuffer, Regexp, Date, etc. are also objects,
   * but null and Arrays are not.
   *
   * @example
   * is.object({}) // true
   * is.object([]) // false
   * is.object(null) // false
   * is.object(1) // false
   * is.object(new Map()) // true
   * is.object(new Set()) // true
   */
  object<T>(val: T): val is Record<any, any>;

  /**
   * Checks if a value is a Date object.
   *
   * @see `date.isValid()` If you want to check if a value is a valid date string or number
   *
   * @example
   * is.date(new Date()) // true
   * is.date(Date.now()) // false
   * is.date(new Date('2022-09-24T11:00:00.000Z')) // true
   * is.date('2022-09-24') // false
   */
  date(val: unknown): val is Date;

  /**
   * Checks if a value is a RegExp.
   *
   * @example <caption>Literal notation</caption>
   * is.regexp(/foo/); // true
   * @example <caption>Constructor</caption>
   * is.regexp(new RegExp('bar', 'g')); // true
   */
  regexp(val: unknown): val is RegExp;

  /**
   * Checks if a value is a finite number.
   * Note: BigInts, NaN, and Infinity values are not considered as numbers.
   *
   * @example
   * is.number(1); // true
   * is.number('1'); // false
   * is.number(1n); // false
   * is.number(NaN); // false
   * is.number(Infinity); // false
   */
  number(val: unknown): val is number;
}

export declare const is: is;
