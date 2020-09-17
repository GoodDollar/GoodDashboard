import { isError, isFunction, isNumber } from 'lodash'
import { Observable, defer, from as fromPromise, timer, throwError } from 'rxjs'
import { retryWhen, mergeMap, timeout } from 'rxjs/operators'

export const retry = async (
  source: (() => Promise<any>) | Observable<any>,
  retries: number | null = 5,
  interval: number = 0,
  shouldRetry: (reson: any) => boolean = () => true
): Promise<any> => {
  const observable: Observable<any> = isFunction(source)
    ? defer(() => fromPromise(source())) : source
  return observable.pipe(
    retryWhen(attempts =>
      attempts.pipe(
        mergeMap((attempt, index) => {
          if (shouldRetry(attempt)) {
            const retryAttempt = index + 1
            if (!isNumber(retries) || (retries <= 0)
              || (retryAttempt <= retries)
            ) {
              return timer(interval || 0)
            }
          }
          return throwError(attempt)
        })
      )
    )
  )
    .toPromise()
}

export const retryTimeout = async (asyncFn: () => Promise<any>, timeoutMs = 10000): Promise<any> =>
  retry(
    defer(() => fromPromise(asyncFn())).pipe(timeout(timeoutMs)), null, 0,
    (error: any) => isError(error) && error.name === 'TimeoutError'
  )