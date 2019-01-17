import { Observable, ReplaySubject } from 'rxjs'

interface SubjectAndObservable { observable: Observable<any>; subject: ReplaySubject<any> }
type ComponentSubjectsAndObservables = Map<string, SubjectAndObservable>

const cache = new WeakMap<Object, ComponentSubjectsAndObservables>()

const getComponentSubjectsAndObservables = (instance: Object): ComponentSubjectsAndObservables => {
  const componentSubjectsAndObservables: ComponentSubjectsAndObservables = cache.get(instance)
  if (componentSubjectsAndObservables) {
    return componentSubjectsAndObservables
  }
  const newComponentSubjectsAndObservables: ComponentSubjectsAndObservables = new Map()
  cache.set(instance, newComponentSubjectsAndObservables)
  return newComponentSubjectsAndObservables
}

const getCacheOfProp = (instance: Object, propertyKey: string): SubjectAndObservable => {
  const componentSubjectsAndObservables = getComponentSubjectsAndObservables(instance)
  const cacheOfProp = componentSubjectsAndObservables.get(propertyKey)
  if (cacheOfProp) {
    return cacheOfProp
  }
  const subject = new ReplaySubject<any>(1)
  const newCacheOfProp = { observable: subject.asObservable(), subject }
  componentSubjectsAndObservables.set(propertyKey, newCacheOfProp)
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
