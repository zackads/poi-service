const { transform } = require("./transform");

export const queryDb = (db, query) =>
  db
    .collection("buildings")
    .find(query)
    .toArray()
    .then((buildings) => {
      console.log("=> first building found: ", buildings[0]);
      return buildings.map(transform);
    })
    .catch((error) => {
      console.log("=> an error occurred: ", error);
      return { statusCode: 500, body: "error" };
    });
