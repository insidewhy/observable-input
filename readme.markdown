# Installation

```bash
npm install -S observable-input
```
or
```bash
yarn add observable-input
```

# Usage

```typescript
import { Component, Input } from '@angular/core'
import { Observable } from 'rxjs'
import { ObservableInput } from 'observable-input'

@Component({
  templateUrl: './some-component.html',
  selector: 'app-some-component',
})
class SomeComponent {
  @Input() @ObservableInput()
  private index: Observable<number>
}
```

It can be used like this with a non-observable input for `index`:
```html
<app-some-component index="nonObservableValue"></app-some-component>
```

# Details

This decorator works by replacing the input with a property, the getter returns a value with type `Observable<T>` while the setter expects a variable of type `T`. This introduces a few drawbacks:
 * While you should generally only be reading your input values and not setting them, the mismatch of types for the setter and getter here is still potentially a source of confusion.
 * For now the angular code (whether AOT compiled or not) only writes to a component's inputs (in this case via the setter) and never reads from them, if it did it would receive a value with type `Observable<T>` when it expects a value of type `T`.
 * The angular compiler does not type check the values passed to a component match the types of the `@Input`, if it did it would raise an error indicating that the input should be of type `Observable<T>` instead of `T`.
