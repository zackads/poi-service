import * as MongoClient from "mongodb";
import {appConfig} from "../../appConfig";
import {Building} from "../domain/Building";
import {Polygon} from "../domain/Polygon";
import {BuildingsGateway} from "./BuildingsGateway";

export class MongoBuildingsGateway implements BuildingsGateway {
    private config = {
        databaseUri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}`,
        databaseName: "poi",
        collectionName: "buildings"
    }
    private dbInstance;

    getBuildingsInPolygon(polygon: Polygon): Building[] {
        return this.connect()
            .then((db) => this.query(db, polygon))
            .then((result) => {
                return result;
            }).catch((error) =>
                console.log("=> an error occurred: ", error));
    }

    private connect() {
        if (this.dbInstance) return Promise.resolve(this.dbInstance);

        return MongoClient.connect(this.config.databaseUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
            .then((client) => {
                this.dbInstance = client.db(this.config.databaseName);
                return this.dbInstance;
            })
            .catch((error) => {
                console.log("=> an error occurred: ", error);
                throw error;
            });
    }

    private query(db, polygon) {
        return db
            .collection(this.config.collectionName)
            .find({
                geometry: {
                    $geoWithin: {
                        $geometry: {
                            type: "Polygon",
                            coordinates: polygon,
                        },
                    },
                },
            })
            .limit(appConfig.maxQueryRecords)
            .toArray()
            .then((buildings) => buildings.map(MongoBuildingsGateway.transform)
                .catch((error) => {
                    console.log("=> an error occurred: ", error);
                    return { statusCode: 500, body: "error" };
                }));
    }

    private static transform(dbBuilding): Building {
        return {
            id: dbBuilding._id,
            properties: {
                name: dbBuilding.properties.Name,
                listEntry: dbBuilding.properties.ListEntry,
                location: dbBuilding.properties.Location,
                grade: dbBuilding.properties.Grade,
                hyperlink: dbBuilding.properties.Hyperlink,
            },
            geometry: {
                type: dbBuilding.geometry.type,
                coordinates: [
                    dbBuilding.geometry.coordinates[1],
                    dbBuilding.geometry.coordinates[0],
                ],
            },
        };
    }
}