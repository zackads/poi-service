import { LatLng } from "../src/domain/LatLng";
import * as fs from "fs";
import proj4 from "proj4";
import { BuildingDTO } from "../src/data/BuildingDTO";
import { sendToService } from "./sendBuildingToApi";

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

const walesListedBuildingToDTO = (
  source: WalesListedBuilding
): BuildingDTO => ({
  name: source.properties.Name,
  listEntry: source.properties.RecordNumber.toString(),
  location: source.properties.Location,
  grade: source.properties.Grade,
  hyperlink: source.properties.Report,
  coordinates: {
    latitude: eastingNorthingToLatLng(
      source.geometry.coordinates as EastingNorthing
    )[0],
    longitude: eastingNorthingToLatLng(
      source.geometry.coordinates as EastingNorthing
    )[1],
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

const run = async (sourceFilePath: string) => {
  const source: WalesListedBuildingsFile = JSON.parse(
    fs.readFileSync(sourceFilePath).toString()
  );

  const buildings: BuildingDTO[] = source.features
    .map(normaliseCoordinates)
    .map(walesListedBuildingToDTO);

  await sendToService(
    buildings,
    "https://9rc229lw41.execute-api.eu-west-2.amazonaws.com/dev/building"
  );
};

run("welsh-listed-buildings.geojson");
