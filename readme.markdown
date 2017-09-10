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
