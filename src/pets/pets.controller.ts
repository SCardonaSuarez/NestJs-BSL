import { IPet, IPetCategory } from '../interface/index';
import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

import axios from 'axios';

@Controller('pets')
export class PetsController {
  @Get('axios')
  public async getPets(@Res() response: Response) {
    const datatPet = await axios.get('https://bsl1.herokuapp.com/pet');
    const pet: IPet[] = datatPet.data;
    const dataCategory = await axios.get(
      'https://bsl1.herokuapp.com/pet/categories',
    );
    const category: IPetCategory = dataCategory.data;

    const petConjuntion = pet.map((pets) => {
      delete pets.id;
      pets.category = category.categories.find(
        (category) => category.id === pets.category,
      ).name;
      return pets;
    });

    return response.status(HttpStatus.OK).send({ petConjuntion });
  }
}
