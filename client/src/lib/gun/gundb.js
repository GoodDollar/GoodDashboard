import Gun from "gun";
import Config from "../../config";

let gunDb;

const initGunDB = () => {
  if (!gunDb) {
    gunDb = Gun({
      localStorage: true,
      peers: [Config.gunUrl],
    });
  }

  return gunDb;
};
export default initGunDB();
