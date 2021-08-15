import { Discovery } from "../domain/Discovery";

export interface DiscoveryGateway {
  create: (discovery: Discovery) => Promise<Discovery>;
}
