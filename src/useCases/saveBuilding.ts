import { BuildingGateway } from "../gateways/BuildingGateway";
import { Building } from "../domain/Building";

export const saveBuilding = (gateway: BuildingGateway) => {
  return (building: Building) => gateway.save(building);
};
