import { Polygon } from "../domain/Polygon";
import { BuildingsGateway } from "../gateways/BuildingsGateway";
import { UseCase } from "./UseCase";

export const getBuildingsInPolygonUseCase: UseCase = (
  gateway: BuildingsGateway
) => {
  return (polygon: Polygon) =>
    polygon.length > 0 ? gateway.findBuildingsInPolygon(polygon) : [];
};
