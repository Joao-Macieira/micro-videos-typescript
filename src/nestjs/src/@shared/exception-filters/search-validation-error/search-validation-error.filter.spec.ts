import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { SearchValidationErrorFilter } from './search-validation-error.filter';
import { SearchValidationError } from '@core/micro-videos/@seedwork/domain';

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new SearchValidationError();
  }
}

describe('EntityValidationErrorFilter', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new SearchValidationErrorFilter());
    await app.init();
  });

  it('should catch a entity validation error', () => {
    return request(app.getHttpServer()).get('/stub').expect(422).expect({
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: [],
    });
  });
});
