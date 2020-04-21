import Gun from "gun";
import "gun/lib/then";
import Config from "../../config";

let gunDb;

const initGunDB = () => {
  if (!gunDb) {
    global.gun = gunDb = Gun({
      localStorage: true,
      peers: [Config.gunUrl],
    });
  }

  return gunDb;
};
export default initGunDB();
