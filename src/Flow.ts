import { Step } from './Step';

export class Flow {
  private steps: Step<any, any, any>[] = [];

  private returnArgs: any = null;
  private nextArgs: any = null;
  private previousArgs: any = null;

  constructor(steps?: Step<any, any, any>[], initialArgs?: any) {
    if (!!steps) {
      this.steps.push(...steps);
    }
    if (!!initialArgs) {
      this.previousArgs = initialArgs;
    }
  }

  public addStep(step: Step<any, any, any>) {
    this.steps.push(step);
  }

  public addSteps(steps: Step<any, any, any>[]) {
    this.steps.push(...steps);
  }

  public setInitialArgs<Args>(initialArgs: Args) {
    this.previousArgs = initialArgs;
  }

  private async executeFromIndex(index: number) {
    for (const step of this.steps.slice(index)) {
      if (!!step.onExecute) {
        this.returnArgs = await step.onExecute(this.previousArgs);
      } else {
        break;
      }
      if (!!step.filterNextArgs) {
        this.nextArgs = step.filterNextArgs(this.returnArgs);
      }
      this.previousArgs = this.nextArgs;
      this.returnArgs = null;
      this.nextArgs = null;
    }
  }

  private initialRun() {
    this.steps.forEach((step, index) => {
      if (!!step.onStart) {
        step.onStart((returnArgs: any) => {
          if (!!step.filterNextArgs) {
            this.previousArgs = step.filterNextArgs(returnArgs);
          }
          this.executeFromIndex(index + 1);
        });
      }
    });
  }

  public start() {
    this.initialRun();
  }
}
