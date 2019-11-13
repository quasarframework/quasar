export interface Cookies {
    get<T = string>(name: string): T;
    set<T = string>(name: string, value: T, options: {}): void;
}
