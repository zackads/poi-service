import * as MongoClient from "mongodb";
import { appConfig } from "../../appConfig";
import { Building } from "../domain/Building";
import { Polygon } from "../domain/Polygon";
import { BuildingsGateway } from "./BuildingsGateway";

interface MongoBuilding {
  _id: any;
  properties: {
    Name: any;
    ListEntry: any;
    Location: any;
    Grade: any;
    Hyperlink: any;
  };
  geometry: { type: any; coordinates: number[] };
}

export class MongoBuildingsGateway implements BuildingsGateway {
  private config = {
    databaseUri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}`,
    databaseName: "poi",
    collectionName: "buildings",
  };
  private dbInstance: MongoClient.Db | undefined;

  public getBuildingsInPolygon(polygon: Polygon): Promise<Building[]> {
    return this.connect()
      .then((db) => this.query(db, polygon))
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.log("=> an error occurred: ", error);
        throw error;
      });
  }

  private static mongoBuildingToBuilding(
    mongoBuilding: MongoBuilding
  ): Building {
    return {
      id: mongoBuilding._id,
      properties: {
        name: mongoBuilding.properties.Name,
        listEntry: mongoBuilding.properties.ListEntry,
        location: mongoBuilding.properties.Location,
        grade: mongoBuilding.properties.Grade,
        hyperlink: mongoBuilding.properties.Hyperlink,
      },
      geometry: {
        type: mongoBuilding.geometry.type,
        coordinates: [
          mongoBuilding.geometry.coordinates[1],
          mongoBuilding.geometry.coordinates[0],
        ],
      },
    };
  }

  private connect() {
    if (this.dbInstance) return Promise.resolve(this.dbInstance);

    return MongoClient.connect(this.config.databaseUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((client) => {
      this.dbInstance = client.db(this.config.databaseName);
      return this.dbInstance;
    });
  }

  private query(db: MongoClient.Db, polygon: Polygon) {
    console.log("Type!: " + typeof polygon);
    return db
      .collection(this.config.collectionName)
      .find({
        geometry: {
          $geoWithin: {
            $geometry: {
              type: "Polygon",
              coordinates: [polygon],
            },
          },
        },
      })
      .limit(appConfig.maxQueryRecords)
      .toArray()
      .then((buildings) =>
        buildings.map(MongoBuildingsGateway.mongoBuildingToBuilding)
      );
  }
}
