import Gun from "gun";
import SEA from "gun/sea";
import Config from "../../config";

let gunDb;
Gun.chain.then = function(cb) {
  var gun = this,
    p = new Promise(function(res, rej) {
      gun.once(res, { wait: 1000 });
    });
  return cb ? p.then(cb) : p;
};
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
