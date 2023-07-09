import EventEmitter from "events";
const eventEmitter = new EventEmitter();

const cleanup = () => {
  eventEmitter.removeAllListeners();
};

process.on("beforeExit", cleanup);
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

export default eventEmitter;
