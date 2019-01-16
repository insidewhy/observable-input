import { ReplaySubject } from 'rxjs'

type SubjectByProp = Map<string, ReplaySubject<any>>

const subjects: WeakMap<Object, SubjectByProp> = new WeakMap()

const getSubject = (instance: any, propertyKey: string): ReplaySubject<any> => {
  const subjectByProp: SubjectByProp = subjects.get(instance) || new Map()
  let subject = subjectByProp.get(propertyKey)
  if (subject) {
    return subject
  }
  subject = new ReplaySubject<any>(1)
  subjectByProp.set(propertyKey, subject)
  subjects.set(instance, subjectByProp)
  return subject
}

export function ObservableInput() {
  return (target, propertyKey) => {
    delete target[propertyKey]

    Object.defineProperty(target, propertyKey, {
      set(value) {
        const subject = getSubject(this, propertyKey)
        subject.next(value)
      },
      get() {
        const subject = getSubject(this, propertyKey)
        return subject.asObservable()
      },
    })
  }
}
