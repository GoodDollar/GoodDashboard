import gunDB from '../gundb'
import moment from 'moment'
class SurveyProperties {
  gun: any
  constructor() {
    this.gun = gunDB
  }

  async getByDate(date:any) {
    const result:any = {}
    const gunDate = moment(date).format('DDMMYY')

    await this.gun.get('survey').get(gunDate).on(async (data:any) => {
        if (data) {
          await this.gun.get('survey').get(gunDate).map().on((dataTx:any, hash:any) => {
            result[hash] = {
              date: moment(date).format('YYYY-MM-DD'),
              hash,
              amount: dataTx.amount,
              reason: dataTx.reason,
              survey: dataTx.survey,
            }
          })
        }
    })

    return Promise.resolve(result)
  }

}

export default new SurveyProperties()
