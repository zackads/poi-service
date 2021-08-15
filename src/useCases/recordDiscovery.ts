import { DiscoveryGateway } from "../gateways/DiscoveryGateway";
import { Discovery } from "../domain/Discovery";

export const recordDiscovery = (gateway: DiscoveryGateway) => (
  discovery: Discovery
) => gateway.create(discovery);
