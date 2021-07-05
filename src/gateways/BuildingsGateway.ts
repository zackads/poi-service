import {Polygon} from "../domain/Polygon";
import {Building} from "../domain/Building";

export interface BuildingsGateway {
    getBuildingsInPolygon(polygon: Polygon): Building[],
}