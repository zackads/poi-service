import * as MongoClient from "mongodb";
import { appConfig } from "../../appConfig";
import { Building } from "../domain/Building";
import { Polygon } from "../domain/Polygon";
import { BuildingsGateway } from "./BuildingsGateway";
import { FilterQuery, UpdateWriteOpResult } from "mongodb";

export interface MongoBuilding {
  _id?: string;
  properties: {
    Name: string;
    ListEntry: string;
    Location: string;
    Grade: string;
    Hyperlink: string;
  };
  geometry: { type: "Point"; coordinates: number[] };
}

export class MongoBuildingsGateway implements BuildingsGateway {
  private uri;
  private collection;
  private dbInstance: MongoClient.Db | undefined;

  constructor(
    uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}`,
    collection = "buildings"
  ) {
    this.uri = uri;
    this.collection = collection;
  }

  public async findBuildingsInPolygon(polygon: Polygon): Promise<Building[]> {
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
    try {
      const { upsertedId }: UpdateWriteOpResult = await this.connect().then(
        (db) =>
          db.collection(this.collection).replaceOne(
            {
              properties: {
                ListEntry: building.properties.listEntry,
              },
            },
            buildingToMongoBuilding(building),
            { upsert: true }
          )
      );

      return (
        await this.find({
          _id: upsertedId,
        })
      )[0];
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  /* ---------------------- */

  private connect() {
    if (this.dbInstance) return Promise.resolve(this.dbInstance);

    return MongoClient.connect(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((client) => {
      this.dbInstance = client.db();
      return this.dbInstance;
    });
  }

  private async find(query: FilterQuery<any>): Promise<Building[]> {
    try {
      return this.connect().then((db) =>
        db
          .collection(this.collection)
          .find(query)
          .limit(appConfig.maxQueryRecords)
          .toArray()
          .then((buildings) => buildings.map(mongoBuildingToBuilding))
      );
    } catch (e) {
      console.error(e);
      throw e;
    }
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
