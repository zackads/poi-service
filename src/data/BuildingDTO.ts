export interface BuildingDTO {
  name: string;
  listEntry: string;
  location: string;
  grade: string;
  hyperlink: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}
