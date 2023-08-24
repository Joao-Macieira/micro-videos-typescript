import { SearchValidationError } from '@core/micro-videos/@seedwork/domain';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { union } from 'lodash';

@Catch(SearchValidationError)
export class SearchValidationErrorFilter implements ExceptionFilter {
  catch(exception: SearchValidationError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    response.status(422).json({
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: union(...Object.values(exception.error)),
    });
  }
}
