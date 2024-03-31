import cluster from "node:cluster";
import process from "node:process";
import { startServer } from "./server/server";

function numCPUs() {
  const regex = /-?\d*\.?\d+/g;
  const numCluster = regex.test(process.env.CLUSTER || "")
    ? parseInt(process.env.CLUSTER || "")
    : 1;

  if (numCluster > 1) {
    return numCluster + Math.ceil(numCluster / 2);
  }

  return 1;
}

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs(); i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  startServer();
}
