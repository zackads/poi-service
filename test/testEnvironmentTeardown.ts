import { spawn } from "child_process";

export const testEnvironmentTeardown = async () => {
  console.log("Tearing down Serverless stack from test stage...");
  const slsDeploy = await spawn("sls", ["remove", "--stage", "test"]);

  slsDeploy.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
  });

  slsDeploy.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
};
