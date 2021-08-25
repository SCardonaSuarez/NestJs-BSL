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
    .pattern(new RegExp('^([a-zA-Z0-9!@#$%^&*]{6,16}$)'))
    .required(),

  gender: Joi.string().valid('male', 'female'),

  birthDate: Joi.string(),
});

@Controller('cities')
export class CitiesController {
  @Get()
  get(@Res() response: Response): Response {
    const name = '';
    const lastName = '';
    return response.status(HttpStatus.OK).send({
      name,
      lastName,
    });
  }

  @Post('schema')
  public postCities(@Body() body: any, @Res() response: Response) {
    try {
      Logger.log(body);
      if (!schema.validate(body)) {
        return response.status(HttpStatus.BAD_REQUEST).send({
          error: 'Invalid request body',
        });
      }
    } catch (error) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: 'Server error' });
    }
  }
}
