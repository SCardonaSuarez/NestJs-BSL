export interface IPet {
  id: number;
  name: string;
  category: number | string; // MACHETAZO
}

export interface IPetDTO {
  name: string;
  category: string;
}
