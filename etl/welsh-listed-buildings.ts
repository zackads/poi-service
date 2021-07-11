import { LatLng } from "../src/domain/LatLng";
import * as fs from "fs";
import proj4 from "proj4";
import { MongoBuilding } from "../src/gateways/MongoBuildingsGateway";

/**
 * Source file download from http://lle.gov.wales/catalogue/item/ListedBuildings/?lang=en in GeoJSON
 */

type EastingNorthing = [number, number];

interface WalesListedBuildingsFile {
  type: "FeatureCollection";
  features: WalesListedBuilding[];
}

interface WalesListedBuilding {
  type: string;
  id: string;
  geometry: {
    type: "Point" | "MultiPoint";
    coordinates: EastingNorthing | EastingNorthing[];
  };
  geometry_name: string;
  properties: {
    RecordNumber: number;
    Name: string;
    Name_cy: string;
    DesignationDate: string;
    Grade: string;
    Location: string;
    BroadClass: string;
    BroadClass_cy: string;
    Report: string;
  };
}

const walesListedBuildingToMongoBuilding = (
  source: WalesListedBuilding
): MongoBuilding => ({
  properties: {
    Name: source.properties.Name,
    ListEntry: source.properties.RecordNumber.toString(),
    Location: source.properties.Location,
    Grade: source.properties.Grade,
    Hyperlink: source.properties.Report,
  },
  geometry: {
    type: "Point",
    coordinates: eastingNorthingToLatLng(
      source.geometry.coordinates as EastingNorthing
    ),
  },
});

const normaliseCoordinates = (
  source: WalesListedBuilding
): WalesListedBuilding => ({
  ...source,
  geometry: {
    ...source.geometry,
    type: "Point",
    coordinates: (source.geometry.type === "MultiPoint"
      ? source.geometry.coordinates[0]
      : source.geometry.coordinates) as EastingNorthing,
  },
});

const eastingNorthingToLatLng = (eastingNorthing: EastingNorthing): LatLng => {
  const britishNationalGridProjection =
    "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs";
  return proj4(britishNationalGridProjection, "WGS84", eastingNorthing);
};

const run = (sourcePath: string, destinationPath: string) => {
  const source: WalesListedBuildingsFile = JSON.parse(
    fs.readFileSync(sourcePath).toString()
  );

  const buildings: MongoBuilding[] = source.features
    .map(normaliseCoordinates)
    .map(walesListedBuildingToMongoBuilding);

  fs.writeFileSync(destinationPath, JSON.stringify(buildings));
};

run("welsh-listed-buildings-in.geojson", "welsh-listen-buildings-out.json");
