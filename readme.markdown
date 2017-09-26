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
import { Observable } from 'rxjs/Observable'
import { ObservableInput } from 'observable-input'

@Component({
  templateUrl: './some-component.html',
  selector: 'app-some-component',
})
class SomeComponent {
  @Input() @ObservableInput()
  private index: Observable<number>

  @select()
  private selectedIndex: Observable<number>

  public isSelected = this.index.switchMap(
    index => this.selectedIndex.map(selectedIndex => selectedIndex === index)
  )
}
```

Then in `some-component.html`:
```html
<span [class.selected]="isSelected | async">maybe selected</span>
```

# Details

This decorator works by replacing the input with a property, the getter returns a value with type `Observable<T>` while the setter expects a variable of type `T`. While you should generally only be reading your input values and not setting them, the mismatch between types here is still potentially a source of great confusion. For now the angular code (whether AOT compiled or not) only writes to a component's inputs (in this case via the setter) and never reads from them, if this changes then the method utilised by this code will stop working.
