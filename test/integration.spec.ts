import { testEnvironmentDeploy } from "./testEnvironmentDeploy";
import { testEnvironmentTeardown } from "./testEnvironmentTeardown";
import request from "supertest";
import * as stack from "../.build/stack.json";
import * as mockCreateBuilding from "./mocks/create-building.json";

describe("POST /buildings", () => {
  beforeAll(async () => {
    await testEnvironmentDeploy();
  });

  it("responds with 200", () => {
    request(stack.ServiceEndpoint)
      .post("/buildings")
      .send(mockCreateBuilding)
      .expect(200);
  });

  afterAll(async () => {
    await testEnvironmentTeardown();
  });
});
