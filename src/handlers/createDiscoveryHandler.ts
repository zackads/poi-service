import {
  APIGatewayEvent,
  APIGatewayProxyResult,
  Callback,
  Context,
} from "aws-lambda";
import { DiscoveryDto } from "../data/DiscoveryDTO";
import { recordDiscovery } from "../useCases/recordDiscovery";
import { DynamoDiscoveryGateway } from "../gateways/DynamoDiscoveryGateway";
import { Discovery } from "../domain/Discovery";
import { DiscoveryGateway } from "../gateways/DiscoveryGateway";

export const main = async (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback,
  discoveryGateway: DiscoveryGateway = new DynamoDiscoveryGateway()
): Promise<APIGatewayProxyResult> => {
  const discoveryToRecord: Discovery = discoveryDtoToDiscovery(
    JSON.parse(event.body!),
    event.requestContext.identity.cognitoIdentityId!
  );

  const recordedDiscovery = await recordDiscovery(discoveryGateway)(
    discoveryToRecord
  );

  return {
    statusCode: 200,
    body: JSON.stringify(recordedDiscovery),
  };
};

const discoveryDtoToDiscovery = (
  dto: DiscoveryDto,
  userId: string
): Discovery => ({
  landmarkId: dto.landmarkId,
  remarks: dto.remarks,
  userId,
});
