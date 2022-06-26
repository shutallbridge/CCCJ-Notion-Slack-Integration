export type NextArg = { [key: string]: any };

export type NextCallback = (nextProps?: NextArg | Promise<NextArg>) => void;

export interface Step {
  initialRun?(next: NextCallback): void;
  execute?(arg: any): void | Promise<void> | NextArg | Promise<NextArg>;
}
