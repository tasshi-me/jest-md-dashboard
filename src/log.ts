const name = "jest-md-dashboard";
export class Logger {
  private readonly silent: boolean;
  constructor(silent: boolean = false) {
    this.silent = silent;
  }

  info = (message: string) => {
    if (!this.silent) {
      console.log(`\n${name}: ${message}`);
    }
  };
  error = (message: any) => {
    console.error(`\n${name}: ${message}`);
  };
}
