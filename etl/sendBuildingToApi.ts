import { BuildingDTO } from "../src/data/BuildingDTO";
import axios from "axios";
import axiosRetry from "axios-retry";

axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay });

export const sendToService = async (
  buildingDTOs: BuildingDTO[],
  uri: string
): Promise<void> => {
  try {
    for (const dto of buildingDTOs) {
      console.log(dto);
      await axios.post(uri, JSON.stringify(dto));
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
};
