import { spawn } from "child_process";

export const testEnvironmentDeploy = async () => {
  console.log("Deploying Serverless stack to test stage...");
  const slsDeploy = await spawn("sls", ["deploy", "--stage", "test"]);

  slsDeploy.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
  });

  slsDeploy.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
};
