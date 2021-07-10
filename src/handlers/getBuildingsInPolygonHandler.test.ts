import {
  GetBuildingsInPolygonEvent,
  main,
  stringToPolygon,
} from "./getBuildingsInPolygonHandler";
import { UseCase } from "../useCases/UseCase";
import { Callback, Context } from "aws-lambda";
import { Building } from "../domain/Building";

describe("main", () => {
  const dummyContext = {} as Context;
  const dummyCallback = {} as Callback;

  it("given no polygon parameter, returns an error result", async () => {
    const event = {
      queryStringParameters: {},
    } as GetBuildingsInPolygonEvent;

    const result = await main(event, dummyContext, dummyCallback);

    expect(result.statusCode).toEqual(400);
    expect(result.body).toMatch(/error/i);
  });

  it("given empty string polygon parameter, returns an error result", async () => {
    const event = {
      queryStringParameters: {
        polygon: "",
      },
    } as GetBuildingsInPolygonEvent;

    const result = await main(event, dummyContext, dummyCallback);

    expect(result.statusCode).toEqual(400);
    expect(result.body).toMatch(/error/i);
  });

  it("given a valid polygon, requests buildings from the use case", async () => {
    const event = {
      queryStringParameters: {
        polygon:
          "51.45609276818087,-2.611441612243653,51.45609276818087,-2.5805425643920903,51.45209478972027,-2.5805425643920903,51.45209478972027,-2.611441612243653,51.45609276818087,-2.611441612243653",
      },
    } as GetBuildingsInPolygonEvent;
    const getBuildingsInPolygon: UseCase = jest.fn();

    await main(event, dummyContext, dummyCallback, getBuildingsInPolygon);

    expect(getBuildingsInPolygon).toHaveBeenCalledTimes(1);
  });

  it("given a valid polygon, returns found buildings", async () => {
    const event = {
      queryStringParameters: {
        polygon:
          "51.45609276818087,-2.611441612243653,51.45609276818087,-2.5805425643920903,51.45209478972027,-2.5805425643920903,51.45209478972027,-2.611441612243653,51.45609276818087,-2.611441612243653",
      },
    } as GetBuildingsInPolygonEvent;
    const building: Building = {
      id: "123",
      properties: {
        name: "Fun house",
        grade: "I",
        hyperlink: "funhouse.com",
        listEntry: "123-456-678",
        location: "Bristol",
      },
      geometry: {
        type: "Point",
        coordinates: [1, 2],
      },
    };
    const getBuildingsInPolygon: UseCase = jest
      .fn()
      .mockReturnValue([building]);

    const result = await main(
      event,
      dummyContext,
      dummyCallback,
      getBuildingsInPolygon
    );

    expect(result.body).toStrictEqual(JSON.stringify([building]));
  });

  it("responses contain CORS headers", async () => {
    const event = {
      queryStringParameters: {
        polygon:
          "51.45609276818087,-2.611441612243653,51.45609276818087,-2.5805425643920903,51.45209478972027,-2.5805425643920903,51.45209478972027,-2.611441612243653,51.45609276818087,-2.611441612243653",
      },
    } as GetBuildingsInPolygonEvent;
    const getBuildingsInPolygon: UseCase = jest.fn();

    const result = await main(
      event,
      dummyContext,
      dummyCallback,
      getBuildingsInPolygon
    );

    expect(result.headers).toMatchObject({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    });
  });
});

describe("stringToPolygon", () => {
  const expectations = [
    {
      in: "0,0,3,6,6,1",
      out: [
        [0, 0],
        [6, 3],
        [1, 6],
      ],
    },
    {
      in: "1,1,3,6,6,1",
      out: [
        [1, 1],
        [6, 3],
        [1, 6],
      ],
    },
    {
      in: "1.1,1.1,3.3,6.6,6.6,1.1",
      out: [
        [1.1, 1.1],
        [6.6, 3.3],
        [1.1, 6.6],
      ],
    },
    {
      in: "-1.1,1.1,3.3,6.6,6.6,1.1",
      out: [
        [1.1, -1.1],
        [6.6, 3.3],
        [1.1, 6.6],
      ],
    },
  ];

  expectations.forEach((expectation) => {
    it(`parses ${expectation.in} in to a GeoJSON polygon`, () => {
      expect(stringToPolygon(expectation.in)).toStrictEqual(expectation.out);
    });
  });
});
