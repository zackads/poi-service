import { BuildingGateway } from "../gateways/BuildingGateway";
import { Building } from "../domain/Building";
import { BuildingGrades } from "../domain/BuildingGrades";
import { saveBuilding } from "./saveBuilding";

describe("saveBuilding", () => {
  it("delegates building creation to the injected gateway", async () => {
    const gateway: BuildingGateway = {
      save: jest.fn(),
      findBuildingsInPolygon: jest.fn(),
    } as BuildingGateway;
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
    const gateway: BuildingGateway = {
      save: jest
        .fn()
        .mockResolvedValue({ ...building, id: "newly-created-building-id" }),
      findBuildingsInPolygon: jest.fn(),
    } as BuildingGateway;

    const savedBuilding = await saveBuilding(gateway)(building);

    expect(savedBuilding.id).toEqual("newly-created-building-id");
  });
});
