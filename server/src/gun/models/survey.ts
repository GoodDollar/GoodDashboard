import gunDB from '../gundb'

class SurveyProperties {
  gun: any
  constructor() {
    this.gun = gunDB
  }

  async getGroupDataByDate(date: string) {
    const result = {
      service: 0,
      product: 0,
      other: 0
    }
    await this.gun
      .get('survey').get(date).map().on(function(data:any){
          switch(data.survey) {
            case 'A service':
              result.service += 1
              break
            case 'A product':
              result.product += 1
              break
            default:
              result.other += 1
          }
      })

    return result
  }

}

export default new SurveyProperties()
