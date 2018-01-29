import { ReplaySubject } from 'rxjs/ReplaySubject'

const subjects = new Map();

export function ObservableInput() {
  return (target, propertyKey) => {
    delete target[propertyKey];

    Object.defineProperty(target, propertyKey, {
      set(value) {
        this[propertyKey].next(value);
      },

      get() {
        let subject = subjects.get(propertyKey);
        if (!subject)  {
          subject = new ReplaySubject<any>(1);
          subjects.set(propertyKey, subject);
        }
        return subject;
      }
    });
  }
}
