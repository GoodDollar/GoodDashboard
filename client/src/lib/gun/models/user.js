import gunDB from '../gundb'
import Mutex from 'await-mutex'

class SurveyProperties {
  constructor() {
    this.gun = gunDB
    this.mutex = new Mutex()
    this.timer = null
  }

  clearTimer () {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  async getByAddress(address) {
    return new Promise(async (resolve) => {
      let release = await this.mutex.lock()
      let result = {
        fullName: '',
        avatar: ''
      }
      this.clearTimer()
      this.timer = setTimeout(() => {
        release()
        resolve(result)
      }, 2000)
      try {
        const profileToShow = this.gun
          .get('users/bywalletAddress')
          .get(address.toLowerCase())
          .get('profile')
        result.avatar = await profileToShow.get('avatar').get('display');
        result.fullName = await profileToShow.get('fullName').get('display');
        this.clearTimer()
        release()
        resolve(result)
      } catch (e) {
        console.log(e)
      }
      this.clearTimer()
      release()
      resolve(result)
    })

  }

}

export default new SurveyProperties()
