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

  it("given a valid BuildingDTO request, calls the createBuilding use case", () => {
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
    const event: APIGatewayEvent = {
      body: JSON.stringify(buildingRequest),
    } as APIGatewayEvent;
    const createBuilding = jest.fn();

    main(event, dummyContext, dummyCallback, createBuilding);

    expect(createBuilding).toHaveBeenCalledWith(building);
  });
});
