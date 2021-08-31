import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import * as Joi from 'joi';
import Knex from 'knex';
import { NestjsKnexService } from 'nestjs-knexjs';
import { v4 as uuidv4 } from 'uuid';

const schema = Joi.object({
  name: Joi.string().required(),

  lastName: Joi.string().required(),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com'] },
    })
    .required(),

  password: Joi.string()
    .pattern(
      new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'),
    )
    .required(),

  gender: Joi.string().valid('male', 'female'),

  birthDate: Joi.string(),
});

@Controller('cities')
export class CitiesController {
  private readonly knex: Knex = null;

  constructor(private nestjsKnexService: NestjsKnexService) {
    this.knex = this.nestjsKnexService.getKnexConnection();
  }
  @Get()
  public async get(@Res() response: Response) {
    const data = await this.knex('post').select('*');
    Logger.log({ data });
    return response.status(HttpStatus.OK).send({ data });
  }

  @Post()
  public async post(@Body() body: any, @Res() response: Response) {
    try {
      const result = schema.validate(body);
      Logger.log({ result });
      if (result.error) {
        return response.status(HttpStatus.BAD_REQUEST).send({
          error: 'Invalid request body',
        });
      }
      const id = uuidv4();
      const table = await this.knex(' data ').insert({
        id,
        name: body.name,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        gender: body.gender,
        birthDate: body.birthDate,
      });
      return response.status(HttpStatus.CREATED).send({ table });
    } catch (ex) {
      Logger.error(ex.message);
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: 'Server error' });
    }
  }
}
