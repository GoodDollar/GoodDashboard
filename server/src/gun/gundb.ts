import Gun from '@gooddollar/gun-appendonly'
import 'gun/lib/rindexed'
import config from '../config'

let gunDb:any

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
