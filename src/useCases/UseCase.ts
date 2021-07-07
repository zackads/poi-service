export type UseCase = (...dependencies: any) => (...args: any) => any | void;
