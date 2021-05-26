import { createResponse } from "../createResponse";
import { parsePolygonParameter } from "../parse";
import { connectToDatabase } from "../connectToDatabase";
import { getBuildingsWithin } from "../getBuildingsWithin";

export const main = createResponse(async (event) => {
  const polygon = parsePolygonParameter(event.queryStringParameters["polygon"]);

  connectToDatabase()
    .then((db) => getBuildingsWithin(db, polygon))
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log("=> an error occurred: ", error);
      throw error;
    });
});
