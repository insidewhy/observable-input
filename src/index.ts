import { Observable, ReplaySubject } from 'rxjs'

type ObservableByProp = Map<string, Observable<any>>
type SubjectByProp = Map<string, ReplaySubject<any>>

const observables: WeakMap<Object, ObservableByProp> = new WeakMap()
const subjects: WeakMap<Object, SubjectByProp> = new WeakMap()

const getMap = <T> (weakMap: WeakMap<Object, Map<string, T>>, instance: Object): Map<string, T> => {
  const map: Map<string, T> = weakMap.get(instance)
  if (map) {
    return map
  }
  const newMap: Map<string, T> = new Map()
  weakMap.set(instance, newMap)
  return newMap
}

const getSubject = (instance: Object, propertyKey: string): ReplaySubject<any> => {
  const subjectByProp = getMap(subjects, instance)
  const subject = subjectByProp.get(propertyKey)
  if (subject) {
    return subject
  }
  const newSubject = new ReplaySubject<any>(1)
  subjectByProp.set(propertyKey, newSubject)
  return newSubject
}

const getObservable = (instance: Object, propertyKey: string): Observable<any> => {
  const observableByProp = getMap(observables, instance)
  const observable = observableByProp.get(propertyKey)
  if (observable) {
    return observable
  }
  const newObservable = getSubject(instance, propertyKey).asObservable()
  observableByProp.set(propertyKey, newObservable)
  return newObservable
}

export function ObservableInput() {
  return (target, propertyKey) => {
    delete target[propertyKey]

    Object.defineProperty(target, propertyKey, {
      set(value) {
        getSubject(this, propertyKey).next(value)
      },
      get() {
        return getObservable(this, propertyKey)
      },
    })
  }
}
