import { ApplicationRef, DOCUMENT, Injectable, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, take, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class InitialLoaderService {
  private readonly appRef = inject(ApplicationRef);
  private readonly document = inject(DOCUMENT);

  $loader = toSignal(this.appRef.isStable.pipe(
    tap((d) => console.log(d)),
    filter(Boolean),
    take(1)
  ))

  $loaderEffect = effect(() => {
    if(this.$loader()) {
      // this.hideLoader()
    }
  })

  private hideLoader(): void {
    const loader = this.document.getElementById('ragnaLoader');

    if (!loader) {
      return;
    }

    loader.classList.add('fade-out');
    loader.remove();
  }
}
