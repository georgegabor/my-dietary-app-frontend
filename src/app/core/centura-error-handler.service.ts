import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CenturaErrorHandlerService {
  serverErrorMessages: Map<string, string>;
  errorTitle: string;
  serverErrorMessage: string;

  // constructor(private dialog: MatDialog) {}

  resetErrors(errors: Map<string, string>): Map<string, string> {
    errors = new Map();
    return errors;
  }

  handleError(error: HttpErrorResponse): Map<string, string> {
    console.error(error);

    if (error.error.error) {
      this.openDialog(error.error.status, error.error.error, error.error.message);
    } else {
      this.openDialog(error.status, error.statusText, error.message);
    }
    return new Map();
  }

  openDialog(status: number, title: string, message: string) {
    console.log('should open component');
    // this.dialog.open(CenturaErrorDialogComponent, {
    //   minWidth: 600,
    //   maxWidth: 600,
    //   minHeight: 'fit-content',
    //   maxHeight: 'fit-content',
    //   data: {
    //     status: status,
    //     title: title,
    //     message: message,
    //   },
    // });
  }

  getServerErrorMessages(): Map<string, string> {
    return this.serverErrorMessages;
  }
}
