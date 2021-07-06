import { Polygon } from "../domain/Polygon";
import { BuildingsGateway } from "../gateways/BuildingsGateway";

export const getBuildingsWithinPolygon = (
  polygon: Polygon,
  gateway: BuildingsGateway
) => {
  return polygon.length === 0 ? [] : gateway.getBuildingsInPolygon(polygon);
};
