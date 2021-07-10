import * as MongoClient from "mongodb";
import { appConfig } from "../../appConfig";
import { Building } from "../domain/Building";
import { Polygon } from "../domain/Polygon";
import { BuildingsGateway } from "./BuildingsGateway";
import { FilterQuery, InsertOneWriteOpResult } from "mongodb";

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
    databaseUri: `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}`,
    databaseName: "poi",
    collectionName: "buildings",
  };
  private dbInstance: MongoClient.Db | undefined;

  public findBuildingsInPolygon(polygon: Polygon): Promise<Building[]> {
    return this.find({
      geometry: {
        $geoWithin: {
          $geometry: {
            type: "Polygon",
            coordinates: [polygon],
          },
        },
      },
    });
  }

  public async save(building: Building): Promise<Building> {
    const result: InsertOneWriteOpResult<MongoBuilding> = await this.connect().then(
      (db) =>
        db
          .collection(this.config.collectionName)
          .insertOne(buildingToMongoBuilding(building))
    );
    const savedBuilding: MongoBuilding = result.ops[0];

    return mongoBuildingToBuilding(savedBuilding);
  }

  /* ---------------------- */

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

  private find(query: FilterQuery<any>) {
    return this.connect().then((db) =>
      db
        .collection(this.config.collectionName)
        .find(query)
        .limit(appConfig.maxQueryRecords)
        .toArray()
        .then((buildings) => buildings.map(mongoBuildingToBuilding))
    );
  }
}

const mongoBuildingToBuilding = (mongoBuilding: MongoBuilding): Building => ({
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
});

const buildingToMongoBuilding = (building: Building): MongoBuilding => ({
  _id: building.id,
  properties: {
    Name: building.properties.name,
    ListEntry: building.properties.listEntry,
    Location: building.properties.location,
    Grade: building.properties.grade,
    Hyperlink: building.properties.hyperlink,
  },
  geometry: {
    type: building.geometry.type,
    coordinates: [
      building.geometry.coordinates[0],
      building.geometry.coordinates[1],
    ],
  },
});
