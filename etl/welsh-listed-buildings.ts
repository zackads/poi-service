import { LatLng } from "../src/domain/LatLng";
import * as fs from "fs";
import proj4 from "proj4";
import axios from "axios";
import { BuildingDTO } from "../src/data/BuildingDTO";

type EastingNorthing = [number, number];

interface SourceFile {
  type: "FeatureCollection";
  features: SourceListedBuilding[];
}

interface SourceListedBuilding {
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

const sourceToBuildingDTO = (source: SourceListedBuilding): BuildingDTO => ({
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
  source: SourceListedBuilding
): SourceListedBuilding => ({
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

const sendToService = async (building: BuildingDTO, uri: string) => {
  try {
    await axios.post(uri, JSON.stringify(building));
    return building;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const run = async (sourceFilePath: string) => {
  const source: SourceFile = JSON.parse(
    fs.readFileSync(sourceFilePath).toString()
  );

  const sourceListedBuildings: SourceListedBuilding[] = source.features;

  for (const sourceBuilding of sourceListedBuildings) {
    const buildingToSave = sourceToBuildingDTO(
      normaliseCoordinates(sourceBuilding)
    );
    const savedBuilding = await sendToService(
      buildingToSave,
      "https://9rc229lw41.execute-api.eu-west-2.amazonaws.com/dev/building"
    );
    console.log(savedBuilding);
  }
};

run("./welsh-listed-buildings.geojson");
