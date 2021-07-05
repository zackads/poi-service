import {LatLng} from "./LatLng";

export interface Building {
    id: string,
    properties: {
        name: string,
        listEntry: string,
        location: string,
        grade: string,
        hyperlink: string
    },
    geometry: {
        type: "Point",
        coordinates: LatLng
    }
}