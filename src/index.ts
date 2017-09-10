import { ReplaySubject } from 'rxjs/ReplaySubject'

const subjects = new WeakMap()

export function ObservableInput() {
  return (target, propertyKey) => {
    delete target[propertyKey]

    Object.defineProperty(target, propertyKey, {
      set(value) {
        this[propertyKey].next(value)
      },
      get() {
        let subject = subjects.get(this)
        if (! subject)  {
          subject = new ReplaySubject<any>(1)
          subjects.set(this, subject)
        }
        return subject
      },
    })
  }
}
