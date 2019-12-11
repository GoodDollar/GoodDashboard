import SurveyModel from '../models/survey'

type survey = {
  hash: string,
  date: string,
  reason: string,
  amount: number,
  survey: string,
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

          params.push({
            updateOne: {
              filter: {hash: survey.hash},
              update: survey,
              upsert: true, new: true
            }
          })
        }
        if (params.length > 0) {
          await this.model.bulkWrite(params)
        }
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
