import IPFS from 'ipfs'
import Log from 'ipfs-log'
import IdentityProvider from 'orbit-db-identity-provider'
const Identity = require('orbit-db-identity-provider/src/identity');
import logger from '../helpers/pino-logger'
import propertyProvider from './property'
const log = logger.child({ from: 'IPFS' })

export default class IPFSLog {
  ready: Promise<boolean>

  log: any
  ipfs: any

  constructor() {
    this.ready = this.init()
    this.ipfs = new IPFS()
  }

  async init(): Promise<boolean> {
    log.info('init ipfs:')
    const id = await propertyProvider.get('ipfsID').then(_ => _ && JSON.parse(_))
    let identity
    if (id) {
      identity = new Identity(
        id.id,
        id.publicKey,
        id.signatures.id,
        id.signatures.publicKey,
        id.type,
        IdentityProvider.IdentityProvider
      )
    } else {
      identity = await IdentityProvider.createIdentity({ id: 'gooddashboard' })
      await propertyProvider.set('ipfsID', JSON.stringify(identity.toJSON()))
    }
    await this.ipfs.ready
    const multiHash = await propertyProvider.get('ipfsMultiHash')
    log.info('Reading events from ipfs:', { multiHash })

    if (multiHash) this.log = await Log.fromMultihash(this.ipfs, identity, multiHash)
    else this.log = new Log(this.ipfs, identity, { logId: 'fuse-events' })
    return true
  }

  logEventAsCSV(eventName: string, data: any): Promise<any> {
    const res = this.log.append(`${eventName},${Object.values(data).join(',')}`)
    return res
  }

  async persist(): Promise<any> {
    try {
      const multiHash = await this.log.toMultihash()
      log.info('Persisting events to ipfs:', { multiHash })
      return propertyProvider.set('ipfsMultiHash', multiHash)
    } catch (e) {
      console.log(e)
    }
  }

  getAsCSV(): string {
    log.info('getAsCSV to ipfs:')
    return this.log.values.map((e: any) => e.payload).join('\n')
  }

  async stop(): Promise<any> {
    return this.ipfs.stop()
  }
}
