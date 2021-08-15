import { getBuildingsInPolygon } from "./getBuildingsInPolygon";
import { BuildingGateway } from "../gateways/BuildingGateway";
import { Polygon } from "../domain/Polygon";

describe("getBuildingsInPolygon", () => {
  it("given a null polygon, returns no buildings", () => {
    const gateway: BuildingGateway = {
      findBuildingsInPolygon: jest.fn(),
      save: jest.fn(),
    };
    const nullPolygon: Polygon = [];

    const buildings = getBuildingsInPolygon(gateway)(nullPolygon);

    expect(buildings).toStrictEqual([]);
  });

  it("given a polygon, calls the gateway", () => {
    const gateway: BuildingGateway = {
      findBuildingsInPolygon: jest.fn(),
      save: jest.fn(),
    };
    const polygon: Polygon = [
      [0, 0],
      [0, 1],
      [1, 0],
      [0, 0],
    ];

    getBuildingsInPolygon(gateway)(polygon);

    expect(gateway.findBuildingsInPolygon).toHaveBeenCalledWith(polygon);
  });
});
