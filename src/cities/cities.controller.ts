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
import * as bycript from 'bcrypt';

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
      if (result.error) {
        return response.status(HttpStatus.BAD_REQUEST).send({
          error: result.error,
        });
      }
      const password = body.password;
      const saltRounds = 10;
      const salt = bycript.genSaltSync(saltRounds);
      const hashedPassword = bycript.hashSync(password, salt);
      const id = uuidv4();
      const data = {
        id,
        name: body.name,
        lastName: body.lastName,
        email: body.email,
        password: hashedPassword,
        gender: body.gender,
        birthDate: body.birthDate,
      };
      const table = await this.knex(' post ').insert(data);
      Logger.log(table);
      return response.status(HttpStatus.CREATED).send({ table });
    } catch (ex) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: ex.message });
    }
  }
}
