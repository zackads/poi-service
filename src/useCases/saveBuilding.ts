import { BuildingsGateway } from "../gateways/BuildingsGateway";
import { Building } from "../domain/Building";
import { UseCase } from "./UseCase";

export const saveBuilding: UseCase = (gateway: BuildingsGateway) => {
  return (building: Building) => gateway.save(building);
};
