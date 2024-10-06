// Base interfaces
interface IError {
  code: string;
  message: string;
}

export interface Result{
  Code: boolean;
  Message: string;
  Data: any;
}
