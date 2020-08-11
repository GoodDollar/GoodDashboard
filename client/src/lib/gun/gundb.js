import Gun from "@gooddollar/gun";
import SEA from "@gooddollar/gun/sea";
import Config from "../../config";
import { delay } from "../../utils/async";
let gunDb;

Gun.chain.onThen = function(cb, timeout = 5000) {
  var gun = this,
    p = new Promise(function(res, rej) {
      delay(5000).then(_ => res());
      gun.on(function(v, k, at, event) {
        event.off();
        res(v);
      });
    });
  return cb ? p.then(cb) : p;
};

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
      peers: [Config.gunUrl]
    });
  }

  return gunDb;
};
export default initGunDB();
