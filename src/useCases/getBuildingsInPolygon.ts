import { Polygon } from "../domain/Polygon";
import { BuildingGateway } from "../gateways/BuildingGateway";

export const getBuildingsInPolygon = (gateway: BuildingGateway) => {
  return (polygon: Polygon) =>
    polygon.length > 0 ? gateway.findBuildingsInPolygon(polygon) : [];
};
