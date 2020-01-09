import Gun from '@gooddollar/gun-appendonly'
import Config from '../../config';
import 'gun/lib/rindexed'

let gunDb

const initGunDB = () => {

    if (!gunDb) {
        gunDb = Gun({
            localStorage: false,
            peers: [Config.gunUrl]
        })
    }

  return gunDb
}
export default initGunDB()
