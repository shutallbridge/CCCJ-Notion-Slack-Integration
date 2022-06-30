export interface Step<Args, ReturnArgs, NextArgs> {
  onStart?(next: (returnArgs: ReturnArgs) => void): void;
  onExecute?(args: Args): ReturnArgs | Promise<ReturnArgs>;
  filterNextArgs?(returnArgs: ReturnArgs): NextArgs;
}

export abstract class Step<Args, ReturnArgs, NextArgs>
  implements Step<Args, ReturnArgs, NextArgs>
{
  constructor(filterNextArgs?: (returnArgs: ReturnArgs) => NextArgs) {
    this.filterNextArgs = filterNextArgs;
  }
}
