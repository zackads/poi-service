// import * as MongoClient from "mongodb";
import { FilterQuery, MongoClient, UpdateWriteOpResult } from "mongodb";
import { appConfig } from "../../appConfig";
import { Building } from "../domain/Building";
import { Polygon } from "../domain/Polygon";
import { BuildingGateway } from "./BuildingGateway";

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

export class MongoBuildingsGateway implements BuildingGateway {
  private readonly uri: string = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}`;
  private readonly dbName: string = "poi";
  private readonly collectionName: string = "buildings";

  public async findBuildingsInPolygon(polygon: Polygon): Promise<Building[]> {
    return await this.find({
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
    const { upsertedId }: UpdateWriteOpResult = await (
      await this.collection()
    ).replaceOne(
      {
        properties: {
          ListEntry: building.properties.listEntry,
        },
      },
      MongoBuildingsGateway.buildingToMongoBuilding(building),
      { upsert: true }
    );

    return (
      await this.find({
        _id: upsertedId,
      })
    )[0];
  }

  private async collection() {
    const client = await MongoClient.connect(this.uri, {
      useNewUrlParser: true,
    });
    const db = client.db(this.dbName);
    return db.collection(this.collectionName);
  }

  private async find(query: FilterQuery<any>): Promise<Building[]> {
    return (await this.collection())
      .find(query)
      .limit(appConfig.maxQueryRecords)
      .toArray()
      .then((buildings) =>
        buildings.map(MongoBuildingsGateway.mongoBuildingToBuilding)
      );
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

  private static buildingToMongoBuilding(building: Building): MongoBuilding {
    return {
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
    };
  }
}
