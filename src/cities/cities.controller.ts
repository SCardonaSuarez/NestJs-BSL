/* eslint-disable prettier/prettier */
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

@Controller('collage')
export class CitiesController {
  @Get()
  public get(@Res() response: Response) {
    return response.status(HttpStatus.OK).send({});
  }

  @Post()
  public post(@Body() body: any, @Res() response: Response) {
    try {
      const result = schema.validate(body);
      Logger.log({ result });
      if (result.error) {
        return response.status(HttpStatus.BAD_REQUEST).send({
          error: 'Invalid request body',
        });
      }
      const newUser = {
        ...body,
        creationDate: new Date().getTime(),
        verifiedEmail: false,
      };
      return response.status(HttpStatus.CREATED).send({ newUser });
    } finally {
    }
  }
}
