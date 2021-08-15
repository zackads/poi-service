import { DiscoveryGateway } from "./DiscoveryGateway";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { Discovery } from "../domain/Discovery";

export class DynamoDiscoveryGateway implements DiscoveryGateway {
  private readonly tableName: string = "landmarkist-users";
  public async create(discovery: Discovery): Promise<Discovery> {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    console.log("here!");

    const discoveryToCreate: Discovery = {
      ...discovery,
      discoveryId: uuidv4().toString(),
      createdAt: new Date().toISOString(),
    };

    await dynamoDb
      .put({
        TableName: this.tableName,
        Item: discoveryToCreate,
      })
      .promise();

    return discoveryToCreate;
  }
}
