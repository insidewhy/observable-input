import { Observable, ReplaySubject } from 'rxjs'

interface SubjectAndObservable { observable: Observable<any>; subject: ReplaySubject<any> }
type CacheByProp = Map<string, SubjectAndObservable>

const cache = new WeakMap<Object, CacheByProp>()

const getCacheByProp = (instance: Object): CacheByProp => {
  const cacheByProp: CacheByProp = cache.get(instance)
  if (cacheByProp) {
    return cacheByProp
  }
  const newCacheByProp: CacheByProp = new Map()
  cache.set(instance, newCacheByProp)
  return newCacheByProp
}

const getCacheOfProp = (instance: Object, propertyKey: string): SubjectAndObservable => {
  const cacheByProp = getCacheByProp(instance)
  const cacheOfProp = cacheByProp.get(propertyKey)
  if (cacheOfProp) {
    return cacheOfProp
  }
  const subject = new ReplaySubject<any>(1)
  const newCacheOfProp = { observable: subject.asObservable(), subject }
  cacheByProp.set(propertyKey, newCacheOfProp)
  return newCacheOfProp
}

export function ObservableInput() {
  return (target, propertyKey) => {
    delete target[propertyKey]

    Object.defineProperty(target, propertyKey, {
      set(value) {
        getCacheOfProp(this, propertyKey).subject.next(value)
      },
      get() {
        return getCacheOfProp(this, propertyKey).observable
      },
    })
  }
}
