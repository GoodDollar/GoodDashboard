import IPFS from 'ipfs'
import Log from 'ipfs-log'
import IdentityProvider from 'orbit-db-identity-provider'
const Identity = require('orbit-db-identity-provider/src/identity')
import logger from '../helpers/pino-logger'
import propertyProvider from './property'
const log = logger.child({ from: 'IPFS' })

export default class IPFSLog {
  ready: Promise<boolean>

  log: any

  identity: any

  ipfs: any

  constructor() {
    this.ready = this.init()
  }

  async init(): Promise<boolean> {
    const id: any = await propertyProvider.get('ipfsID').then(_ => _ && JSON.parse(_))
    // const id = false
    let identity
    if (id) {
      const isVerified = await IdentityProvider.verifyIdentity(id)
      identity = await IdentityProvider.createIdentity({ id: 'gooddashboard' })
      log.info('Found existing id', { isVerified, identity, id })
      // identity = new Identity(
      //   id.id,
      //   id.publicKey,
      //   id.signatures.id,
      //   id.signatures.publicKey,
      //   id.type,
      //   IdentityProvider.IdentityProvider
      // )
    } else {
      identity = await IdentityProvider.createIdentity({ id: 'gooddashboard' })
      await propertyProvider.set('ipfsID', JSON.stringify(identity.toJSON()))
    }
    log.debug({ identity })
    this.identity = identity
    const ipfs = new IPFS()
    await ipfs.ready
    this.ipfs = ipfs
    const multiHash = await propertyProvider.get('ipfsMultiHash')
    log.info('Reading events from ipfs:', { multiHash })
    const onProgressCallback = (hash: string, entry: any, length: number) =>
      length % 1000 === 0 && log.info('IPFS reading log:', { hash, length })
    if (multiHash) this.log = await Log.fromMultihash(ipfs, identity, multiHash, { length: 100, onProgressCallback })
    else this.log = new Log(ipfs, identity, { logId: 'fuse-events' })
    log.info('Log ready. records:', this.log.length)
    return true
  }

  logEventAsCSV(eventName: string, data: any): Promise<any> {
    const res = this.log.append(`${eventName},${Object.values(data).join(',')}`)
    return res
  }

  async persist(): Promise<any> {
    if (this.log.length) {
      const multiHash = await this.log.toMultihash()
      log.info('Persisting events to ipfs:', { multiHash })
      return propertyProvider.set('ipfsMultiHash', multiHash)
    }
  }
  async getAsCSV(): Promise<string> {
    const multiHash = await propertyProvider.get('ipfsMultiHash')
    const onProgressCallback = (hash: string, entry: any, length: number) =>
      length % 1000 === 0 && log.info('IPFS downloading log to csv progress:', { hash, length })
    const allRecords = await Log.fromMultihash(this.ipfs, this.identity, multiHash, { onProgressCallback })

    return allRecords.values.map((e: any) => e.payload).join('\n')
  }
}
