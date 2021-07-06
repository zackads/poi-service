import { Polygon } from "./domain/Polygon";
import { LatLng } from "./domain/LatLng";

export const parsePolygonParameter = (polygonString: string): Polygon => {
  // "0,0,3,6,6,1" ==> [ [ 0 , 0 ] , [ 6 , 3 ] , [ 1 , 6 ] ]
  return polygonString
    .split(",")
    .map(parseFloat)
    .reduce((result: any, value, index, array) => {
      if (index % 2 === 0) result.push(array.slice(index, index + 2));
      return result;
    }, [])
    .map((latLng: LatLng) => latLng.reverse());
};
