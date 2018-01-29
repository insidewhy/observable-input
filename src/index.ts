import { ReplaySubject } from 'rxjs/ReplaySubject'

const subjects = new WeakMap();

export function ObservableInput() {
  return (target, prop) => {
    delete target[prop];

    Object.defineProperty(target, prop, {
      set(value) {
        this[prop].next(value);
      },

      get() {
        const subjectByProp: Map<string, ReplaySubject<any>> = subjects.get(this) || new Map();
	let subject = subjectByProp.get(prop);
        if (!subject) {
          subject = new ReplaySubject<any>(1);
          subjectByProp.set(prop, subject);
	  subjects.set(this, subjectByProp);
        }
        return subject;
      }
    });
  }
}
