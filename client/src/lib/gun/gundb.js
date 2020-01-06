import Gun from '@gooddollar/gun-appendonly'

import 'gun/lib/rindexed'

let gunDb

const initGunDB = () => {

    if (!gunDb) {
        gunDb = Gun({
            localStorage: false,
            peers: ['https://etorogun-prod.herokuapp.com/gun']
        })
    }

  return gunDb
}
export default initGunDB()
