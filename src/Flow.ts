import { Step, NextArg } from './Step';

export class Flow {
  private steps: Step[] = [];
  private args: NextArg[] = [];

  constructor() {
    this.steps = [];
    this.args = [];
  }

  public addStep(step: Step) {
    this.steps.push(step);
  }

  public addSteps(steps: Step[]) {
    this.steps.push(...steps);
  }

  private async executeFrom(index: number) {
    let currentIndex = index;
    for (const step of this.steps.slice(index)) {
      if (step.execute) {
        const nextArg = await step.execute(this.args[currentIndex]);
        if (nextArg) {
          this.args[index + 1] = nextArg;
        }
      }
      currentIndex++;
    }
  }

  private initialRun() {
    this.steps.forEach((step, index) => {
      if (step.initialRun) {
        step.initialRun((nextArg?: NextArg) => {
          if (nextArg) {
            this.args[index + 1] = nextArg;
          }
          this.executeFrom(index + 1);
        });
      }
    });
  }

  public start() {
    this.args = new Array(this.steps.length).fill({});
    this.initialRun();
    console.log('LOG: Starting Flow');
  }
}
