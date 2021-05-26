import { parsePointParameter } from "./src/parse";
import { connectToDatabase } from "./src/connectToDatabase";
import { getBuildingsNear } from "./src/getBuildingsNear";

export const handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  console.log("event: ", event);

  switch (event.resource) {
    case "/buildings/{location}": {
      const location = parsePointParameter(event.pathParameters.location);
      connectToDatabase()
        .then((db) => getBuildingsNear(db, location))
        .then((result) => {
          const response = {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({
              data: result,
            }),
          };
          callback(null, response);
        })
        .catch((error) => {
          console.log("=> an error occurred: ", error);
          callback(error);
        });
      break;
    }
    default: {
      throw new Error("=> unrecognised resource");
    }
  }
};
