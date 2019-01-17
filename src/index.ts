import { Observable, ReplaySubject } from 'rxjs'

interface SubjectAndObservable { observable: Observable<any>; subject: ReplaySubject<any> }
type ComponentSubjectsAndObservables = Map<string, SubjectAndObservable>

const subjectsAndObservables = new WeakMap<Object, ComponentSubjectsAndObservables>()

const getComponentSubjectsAndObservables = (instance: Object): ComponentSubjectsAndObservables => {
  const componentSubjectsAndObservables: ComponentSubjectsAndObservables = subjectsAndObservables.get(instance)
  if (componentSubjectsAndObservables) {
    return componentSubjectsAndObservables
  }
  const newComponentSubjectsAndObservables: ComponentSubjectsAndObservables = new Map()
  subjectsAndObservables.set(instance, newComponentSubjectsAndObservables)
  return newComponentSubjectsAndObservables
}

const getSubjectAndObservable = (instance: Object, propertyKey: string): SubjectAndObservable => {
  const componentSubjectsAndObservables = getComponentSubjectsAndObservables(instance)
  const subjectAndObservable = componentSubjectsAndObservables.get(propertyKey)
  if (subjectAndObservable) {
    return subjectAndObservable
  }
  const subject = new ReplaySubject<any>(1)
  const newSubjectAndObservable = { observable: subject.asObservable(), subject }
  componentSubjectsAndObservables.set(propertyKey, newSubjectAndObservable)
  return newSubjectAndObservable
}

export function ObservableInput() {
  return (target, propertyKey) => {
    delete target[propertyKey]

    Object.defineProperty(target, propertyKey, {
      set(value) {
        getSubjectAndObservable(this, propertyKey).subject.next(value)
      },
      get() {
        return getSubjectAndObservable(this, propertyKey).observable
      },
    })
  }
}
