import {
  APIGatewayEvent,
  APIGatewayProxyResult,
  Callback,
  Context,
} from "aws-lambda";
import { UseCase } from "../useCases/UseCase";
import { BuildingDTO } from "../data/BuildingDTO";
import { Building } from "../domain/Building";

export const main = async (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback,
  createBuilding: UseCase
): Promise<APIGatewayProxyResult> => {
  const building: Building = buildingDtoToBuilding(JSON.parse(event.body!));

  createBuilding(building);
  return {
    statusCode: 200,
    body: "",
  };
};

const buildingDtoToBuilding = (dto: BuildingDTO): Building => ({
  properties: {
    name: dto.name,
    listEntry: dto.listEntry,
    location: dto.location,
    grade: dto.grade,
    hyperlink: dto.hyperlink,
  },
  geometry: {
    type: "Point",
    coordinates: [dto.coordinates.latitude, dto.coordinates.longitude],
  },
});
