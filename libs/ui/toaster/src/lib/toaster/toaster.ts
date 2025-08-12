import { Component, ElementRef, inject, input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { fromEvent, Observer, timer } from "rxjs";
import { repeatWhen, takeUntil, tap } from "rxjs/operators";

@Component({
  imports: [CommonModule],
  selector: "bhp-toaster",
  templateUrl: "./toaster.html"
})
export class ToasterComponent<T> {
  
  private readonly elementRef = inject(ElementRef);

  readonly observer = input.required<Observer<T>>();

  readonly mouseenter$ = fromEvent(this.elementRef.nativeElement, "mouseenter");

  readonly mouseleave$ = fromEvent(this.elementRef.nativeElement, "mouseleave");

  readonly close$ = timer(3000).pipe(
    takeUntil(this.mouseenter$),
    repeatWhen(() => this.mouseleave$),
    tap(() => this.close())
  );

  close() {
    this.observer().complete();
  }
}
