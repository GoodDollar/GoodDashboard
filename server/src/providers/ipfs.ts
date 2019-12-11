import IPFS from 'ipfs'
import Log from 'ipfs-log'
import IdentityProvider from 'orbit-db-identity-provider'
import conf from '../config'
import logger from '../helpers/pino-logger'
import propertyProvider from './property'
const log = logger.child({ from: 'IPFS' })

export default class IPFSLog {
  ready: Promise<boolean>

  log: any

  constructor() {
    this.ready = this.init()
  }

  async init(): Promise<boolean> {
    const identity = await IdentityProvider.createIdentity({ id: 'gooddashboard' })
    log.debug({ identity })
    const ipfs = new IPFS()
    await ipfs.ready
    const multiHash = await propertyProvider.get('ipfsMultiHash')
    log.info('Reading events from ipfs:', { multiHash })

    if (multiHash) this.log = await Log.fromMultihash(ipfs, identity, multiHash)
    else this.log = new Log(ipfs, identity, { logId: 'fuse-events' })
    return true
  }

  logEventAsCSV(eventName: string, data: any): Promise<any> {
    const res = this.log.append(`${eventName},${Object.values(data).join(',')}`)
    return res
  }

  async persist(): Promise<any> {
    const multiHash = await this.log.toMultihash()
    log.info('Persisting events to ipfs:', { multiHash })
    return propertyProvider.set('ipfsMultiHash', multiHash)
  }
  getAsCSV(): string {
    return this.log.values.map((e: any) => e.payload).join('\n')
  }
}
