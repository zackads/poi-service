import { Polygon } from "../domain/Polygon";
import { BuildingsGateway } from "../gateways/BuildingsGateway";
import { UseCase } from "./UseCase";

export const getBuildingsWithinPolygon: UseCase = (
  polygon: Polygon,
  gateway: BuildingsGateway
) => (polygon.length > 0 ? gateway.getBuildingsInPolygon(polygon) : []);
