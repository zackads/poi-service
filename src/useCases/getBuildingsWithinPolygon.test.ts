import { getBuildingsWithinPolygon } from "./getBuildingsWithinPolygon";
import { BuildingsGateway } from "../gateways/BuildingsGateway";
import { Polygon } from "../domain/Polygon";

describe("getBuildingsWithinPolygon", () => {
  it("given a null polygon, returns no buildings", () => {
    const gateway: BuildingsGateway = {
      getBuildingsInPolygon: jest.fn(),
    };
    const nullPolygon: Polygon = [];

    const buildings = getBuildingsWithinPolygon(nullPolygon, gateway);

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

    getBuildingsWithinPolygon(polygon, gateway);

    expect(gateway.getBuildingsInPolygon).toHaveBeenCalledWith(polygon);
  });
});
