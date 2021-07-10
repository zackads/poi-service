import { BuildingGrades } from "../domain/BuildingGrades";

export interface BuildingDTO {
  name: string;
  listEntry: string;
  location: string;
  grade: BuildingGrades;
  hyperlink: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}
