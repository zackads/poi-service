import { Polygon } from "../domain/Polygon";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { LatLng } from "../domain/LatLng";
import { UseCase } from "../useCases/UseCase";

export interface GetBuildingsInPolygonEvent extends APIGatewayEvent {
  event: {
    queryStringParameters: {
      polygon: string;
    };
  };
}

export type GetBuildingsInPolygonHandler = (
  event: GetBuildingsInPolygonEvent
) => Promise<APIGatewayProxyResult>;

export const main: GetBuildingsInPolygonHandler = async (event) => {
  return await main2(event, []);
};

export const main2 = async (
  event: GetBuildingsInPolygonEvent,
  useCases: UseCase[]
): Promise<APIGatewayProxyResult> => {
  console.log(event);
  console.log(useCases);
  return {
    statusCode: 400,
    body: "Error: invalid request.  Parameter 'polygon' is required",
  };
};

export const parsePolygonParameter = (polygonString: string): Polygon => {
  // "0,0,3,6,6,1" ==> [ [ 0 , 0 ] , [ 6 , 3 ] , [ 1 , 6 ] ]
  return polygonString
    .split(",")
    .map(parseFloat)
    .reduce((result: any, value, index, array) => {
      if (index % 2 === 0) result.push(array.slice(index, index + 2));
      return result;
    }, [])
    .map((latLng: LatLng) => latLng.reverse());
};
