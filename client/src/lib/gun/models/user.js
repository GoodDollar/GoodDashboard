import gunDB from '../gundb'

class SurveyProperties {
  constructor() {
    this.gun = gunDB
  }

  async getByAddress(address) {
    const profileToShow = this.gun
      .get('users/bywalletAddress')
      .get(address.toLowerCase())
      .get('profile')
    const [avatar = undefined, fullName = 'Unknown Name'] = await Promise.all([
      profileToShow.get('avatar').get('display'),
      profileToShow.get('fullName').get('display'),
    ])

    return { fullName, avatar }
  }

}

export default new SurveyProperties()
