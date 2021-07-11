import {
  APIGatewayEvent,
  APIGatewayProxyResult,
  Callback,
  Context,
} from "aws-lambda";
import { UseCase } from "../useCases/UseCase";
import { BuildingDTO } from "../data/BuildingDTO";
import { Building } from "../domain/Building";
import { saveBuildingUseCase } from "../useCases/saveBuildingUseCase";
import { MongoBuildingsGateway } from "../gateways/MongoBuildingsGateway";

export const main = async (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback,
  saveBuilding: UseCase = saveBuildingUseCase(new MongoBuildingsGateway())
): Promise<APIGatewayProxyResult> => {
  const buildingToCreate: Building = buildingDtoToBuilding(
    JSON.parse(event.body!)
  );

  const createdBuilding = await saveBuilding(buildingToCreate);

  return {
    statusCode: 200,
    body: JSON.stringify(createdBuilding),
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
