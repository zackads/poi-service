import { Polygon } from "../domain/Polygon";
import { Building } from "../domain/Building";

export interface BuildingGateway {
  findBuildingsInPolygon: (polygon: Polygon) => Promise<Building[]>;

  save: (building: Building) => Promise<Building>;
}
