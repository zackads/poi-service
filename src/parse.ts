import {Polygon} from "./domain/Polygon";

export const parsePolygonParameter = (polygonString): Polygon => {
  // "0,0,3,6,6,1" ==> [ [ [ 0 , 0 ] , [ 6 , 3 ] , [ 1 , 6 ] ] ]
  return [
    polygonString
      .split(",")
      .map(parseFloat)
      .reduce((result, value, index, array) => {
        if (index % 2 === 0) result.push(array.slice(index, index + 2));
        return result;
      }, [])
      .map((latLng) => latLng.reverse()),
  ];
};
