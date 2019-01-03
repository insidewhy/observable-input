import { ReplaySubject } from 'rxjs'

type SubjectByProp = Map<string, ReplaySubject<any>>

const subjects: WeakMap<Object, SubjectByProp> = new WeakMap()

export function ObservableInput() {
  return (target, propertyKey) => {
    delete target[propertyKey]

    Object.defineProperty(target, propertyKey, {
      set(value) {
        this[propertyKey].next(value)
      },
      get() {
        const subjectByProp: SubjectByProp = subjects.get(this) || new Map()
        let subject = subjectByProp.get(propertyKey)
        if (! subject)  {
          subject = new ReplaySubject<any>(1)
          subjectByProp.set(propertyKey, subject)
          subjects.set(this, subjectByProp)
        }
        return subject.asObservable()
      },
    })
  }
}
