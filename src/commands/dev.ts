import { green } from "../utils/logs";

const defaultEntry = './example/index.tsx';
const defaultPort = 8080;

export const dev = async (_: string = defaultEntry) => {
  const port = parseInt(process.env.DEV_PORT || '', 10) || defaultPort;

  // TODO: run ts-node-dev
  green(`Server listening => http://localhost:${port}/example 👀`);
};
