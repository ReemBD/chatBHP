import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Observer } from "rxjs";

interface Notification<I, O> {
  content: I;
  observer: Observer<O>;
}

/**
 * A service to show notifications to the user.
 * Make sure to have a `ToasterComponent` in the top of your html file.
 * 
 * @example
 * ```ts
 * readonly toasterService = inject(ToasterService);
 * toasterService.show('Hello, world!').subscribe();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ToasterService extends BehaviorSubject<readonly Notification<any, any>[]> {
  constructor() {
    super([]);
  }

  /**
   * Show a notification to the user.
   * @param content - The content to show.
   * @returns An observable that completes when the notification is closed.
   */
  show<I, O>(content: I): Observable<O> {
    return new Observable((observer: Observer<O>) => {
      const notification = {
        content,
        observer
      };

      this.next([...this.value, notification]);

      return () => {
          this.next(this.value.filter(item => item !== notification));
      };
    });
  }
}