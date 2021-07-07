import { getBuildingsInPolygonUseCase } from "./getBuildingsInPolygonUseCase";
import { BuildingsGateway } from "../gateways/BuildingsGateway";
import { Polygon } from "../domain/Polygon";

describe("getBuildingsInPolygonUseCase", () => {
  it("given a null polygon, returns no buildings", () => {
    const gateway: BuildingsGateway = {
      getBuildingsInPolygon: jest.fn(),
    };
    const nullPolygon: Polygon = [];

    const buildings = getBuildingsInPolygonUseCase(gateway)(nullPolygon);

    expect(buildings).toStrictEqual([]);
  });

  it("given a polygon, calls the gateway", () => {
    const gateway: BuildingsGateway = {
      getBuildingsInPolygon: jest.fn(),
    };
    const polygon: Polygon = [
      [0, 0],
      [0, 1],
      [1, 0],
      [0, 0],
    ];

    getBuildingsInPolygonUseCase(gateway)(polygon);

    expect(gateway.getBuildingsInPolygon).toHaveBeenCalledWith(polygon);
  });
});
