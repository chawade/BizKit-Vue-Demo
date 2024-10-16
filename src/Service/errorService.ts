import type { Error, Result } from "@/Model/Result";
import type { HttpStatusCode } from "axios";
import { Observable, of } from "rxjs";

export default class ErrorService {
  private createResult<T>(
    success: boolean,
    statuscode: HttpStatusCode,
    data: T | null,
    error?: Error
  ): Result<T> {
    return {
      isSuccess: success,
      statusCode: statuscode,
      data: data,
      error: error,
    };
  }

  public handleError<T>(operation = "operation") {
    return (error: any): Observable<Result<T>> => {
      debugger; // Useful for debugging, but should be removed in production

      let errorResponse: Error = {};

      if (error.response) {
        // The request was made and the server responded with a status code out of the range of 2xx
        errorResponse = {
          code: error.response.data?.code || error.response.status,
          message: error.response.data?.message || "An error occurred",
        };
      } else if (error.request) {
        // The request was made but no response was received
        errorResponse = {
          code: "NO_RESPONSE",
          message: "No response received from server",
        };
      } else {
        // Something happened in setting up the request that triggered an Error
        errorResponse = {
          code: "UNKNOWN",
          message: error.message || "An unknown error occurred",
        };
      }

      return of(
        this.createResult<T>(
          false,
          error.response?.status || 0,
          null,
          errorResponse
        )
      );
    };
  }

  public log(message: string) {
    console.log(message);
  }
}
