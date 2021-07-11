import { getBuildingsInPolygonUseCase } from "../useCases/getBuildingsInPolygonUseCase";
import { MongoBuildingsGateway } from "../gateways/MongoBuildingsGateway";
import { UseCase } from "../useCases/UseCase";
import {
  APIGatewayEvent,
  APIGatewayProxyResult,
  Callback,
  Context,
} from "aws-lambda";
import { Polygon } from "../domain/Polygon";
import { LatLng } from "../domain/LatLng";

export interface GetBuildingsInPolygonEvent extends APIGatewayEvent {
  queryStringParameters: {
    polygon: string;
  };
}

export const main = async (
  event: GetBuildingsInPolygonEvent,
  context: Context,
  callback: Callback,
  getBuildingsInPolygon: UseCase = getBuildingsInPolygonUseCase(
    new MongoBuildingsGateway()
  )
): Promise<APIGatewayProxyResult> => {
  if (!isValid(event))
    return { statusCode: 400, body: "Error: Invalid request" };

  const polygon: Polygon = stringToPolygon(event.queryStringParameters.polygon);
  const buildings = await getBuildingsInPolygon(polygon);

  return {
    statusCode: 200,
    body: JSON.stringify({ data: buildings }),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };
};

const isValid = (event: GetBuildingsInPolygonEvent): boolean =>
  "polygon" in event.queryStringParameters &&
  !!event.queryStringParameters.polygon;

export const stringToPolygon = (s: string): Polygon => {
  // "0,0,3,6,6,1" ==> [ [ 0 , 0 ] , [ 6 , 3 ] , [ 1 , 6 ] ]
  return s
    .split(",")
    .map(parseFloat)
    .reduce((result: any, value, index, array) => {
      if (index % 2 === 0) result.push(array.slice(index, index + 2));
      return result;
    }, [])
    .map((latLng: LatLng) => latLng.reverse());
};
