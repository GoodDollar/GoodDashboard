import SurveyModel from '../models/survey'

type survey = {
  service: number,
  product: number,
  other: number,
  date: string,
}

class SurveyTransaction {

  model:any

  constructor() {
    this.model = SurveyModel
  }

  async updateOrSet(surveys: object): Promise<boolean> {
      const params = [];
      if (surveys) {
        for(const i in surveys) {
          // @ts-ignore
          let survey: survey = surveys[i]
          let inc = {}
          for (let f in survey) {
            // @ts-ignore
            if (typeof survey[f] === 'number' && survey[f] > 0) {
              // @ts-ignore
              inc[f] = survey[f]
            }
          }
          params.push({
            updateOne: {
              filter: {date: survey.date},
              update: {
                date: survey.date,
                $inc: inc,
              },
              upsert: true, new: true
            }
          })
        }
        await this.model.bulkWrite(params)
      }

    return true
  }

  /**
   * Get all survey
   *
   * @returns {Promise<*>}
   */
  async getAll(skip: number = 1, limit: number = 20) {
    return this.model.find({}).sort({ date: 1 }).skip(skip).limit(limit);
  }

  async getCount() {
    return this.model.find().count()
  }

}

export default new SurveyTransaction()
