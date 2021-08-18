interface ICategory {
  id: number;
  name: string;
}

export interface IPetCategory {
  categories: ICategory[];
}
