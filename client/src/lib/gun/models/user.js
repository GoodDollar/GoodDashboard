import gunDB from '../gundb'
import Mutex from 'await-mutex'

class SurveyProperties {
  constructor() {
    this.gun = gunDB
    this.mutex = new Mutex()
  }

  async getByAddress(address) {
    let release = await this.mutex.lock()
    try {
      const profileToShow = this.gun
        .get('users/bywalletAddress')
        .get(address.toLowerCase())
        .get('profile')
      const avatar = await profileToShow.get('avatar').get('display');
      const fullName = await profileToShow.get('fullName').get('display');
      release()
      return { fullName, avatar }
    } catch (e) {
      console.log(e)
      release()
    }

    return {}
  }

}

export default new SurveyProperties()
