import { BuildingsGateway } from "../gateways/BuildingsGateway";
import { Building } from "../domain/Building";
import { UseCase } from "./UseCase";

export const saveBuildingUseCase: UseCase = (gateway: BuildingsGateway) => {
  return (building: Building) => gateway.save(building);
};
