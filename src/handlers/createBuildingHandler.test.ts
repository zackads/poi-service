import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import { BuildingDTO } from "../data/BuildingDTO";
import { BuildingGrades } from "../domain/BuildingGrades";
import { Building } from "../domain/Building";
import { main } from "./createBuildingHandler";

describe("createBuildingHandler", () => {
  /*
   *  Parameter validation handled by API Gateway request schema validation.
   *
   *  See serverless.yml
   *
   * */

  const dummyContext = {} as Context;
  const dummyCallback = {} as Callback;
  const buildingRequest: BuildingDTO = {
    coordinates: { latitude: 0, longitude: 1 },
    grade: BuildingGrades.I,
    hyperlink:
      "https://historicengland.org.uk/listing/the-list/list-entry/1443732",
    listEntry: "1443732",
    location: "Adjacent to 23 Chandos Road, Cotham, Bristol, BS6 6PJ",
    name: "Chandos Road War Memorial",
  };
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

  it("given a valid BuildingDTO, calls the saveBuildingUseCase use case", async () => {
    const event: APIGatewayEvent = {
      body: JSON.stringify(buildingRequest),
    } as APIGatewayEvent;
    const createBuilding = jest.fn();

    await main(event, dummyContext, dummyCallback, createBuilding);

    expect(createBuilding).toHaveBeenCalledWith(building);
  });

  it("given a valid BuildingDTO, returns created building with an id property", async () => {
    const event: APIGatewayEvent = {
      body: JSON.stringify(buildingRequest),
    } as APIGatewayEvent;
    const createBuilding = jest.fn().mockResolvedValue({
      ...building,
      id: "newly-created-unique-id",
    });

    const resultBody = JSON.parse(
      (await main(event, dummyContext, dummyCallback, createBuilding)).body
    );

    expect(resultBody.id).toEqual("newly-created-unique-id");
  });
});
