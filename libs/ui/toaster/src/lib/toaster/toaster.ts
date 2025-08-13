import { Component, ElementRef, inject, input, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { fromEvent, Observer, Subject, timer } from "rxjs";
import { repeatWhen, takeUntil, tap } from "rxjs/operators";

@Component({
  imports: [CommonModule],
  selector: "bhp-toaster",
  templateUrl: "./toaster.html"
})
export class ToasterComponent<T> implements OnInit, OnDestroy {
  
  private readonly destroy$ = new Subject<void>();
  private readonly elementRef = inject(ElementRef);

  readonly observer = input.required<Observer<T>>();

  readonly mouseenter$ = fromEvent(this.elementRef.nativeElement, "mouseenter");

  readonly mouseleave$ = fromEvent(this.elementRef.nativeElement, "mouseleave");

  /**
   * Close the toaster after 3 seconds unless user hovers over it.
   */
  readonly close$ = timer(3000).pipe(
    takeUntil(this.mouseenter$),
    repeatWhen(() => this.mouseleave$),
    tap(() => this.close())
  );

  close() {
    this.observer().complete();
  }

  ngOnInit() {
    this.close$.pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
