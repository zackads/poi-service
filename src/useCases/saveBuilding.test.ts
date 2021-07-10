import { BuildingsGateway } from "../gateways/BuildingsGateway";
import { Building } from "../domain/Building";
import { BuildingGrades } from "../domain/BuildingGrades";
import { saveBuilding } from "./saveBuilding";

describe("saveBuilding", () => {
  it("delegates building creation to the injected gateway", async () => {
    const gateway: BuildingsGateway = {
      save: jest.fn(),
      getBuildingsInPolygon: jest.fn(),
    } as BuildingsGateway;
    const building: Building = {
      geometry: { coordinates: [0, 1], type: "Point" },
      properties: {
        grade: BuildingGrades.I,
        hyperlink:
          "https://historicengland.org.uk/listing/the-list/list-entry/1443732",
        listEntry: "1443732",
        location: "Adjacent to 23 Chandos Road, Cotham, Bristol, BS6 6PJ",
        name: "Chandos Road War Memorial",
      },
    };

    await saveBuilding(gateway)(building);

    expect(gateway.save).toHaveBeenCalledWith(building);
  });

  it("returns the created building with id", async () => {
    const building: Building = {
      geometry: { coordinates: [0, 1], type: "Point" },
      properties: {
        grade: BuildingGrades.I,
        hyperlink:
          "https://historicengland.org.uk/listing/the-list/list-entry/1443732",
        listEntry: "1443732",
        location: "Adjacent to 23 Chandos Road, Cotham, Bristol, BS6 6PJ",
        name: "Chandos Road War Memorial",
      },
    };
    const gateway: BuildingsGateway = {
      save: jest
        .fn()
        .mockResolvedValue({ ...building, id: "newly-created-building-id" }),
      getBuildingsInPolygon: jest.fn(),
    } as BuildingsGateway;

    const savedBuilding = await saveBuilding(gateway)(building);

    expect(savedBuilding.id).toEqual("newly-created-building-id");
  });
});
