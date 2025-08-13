import { computed, Directive, input } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary';

/**
 * A button directive.
 * @example
 * ```html
 * <button bhp-button>Click me</button>
 * ```
 */
@Directive({
  selector: 'button[bhp-button]',
  exportAs: 'bhpButton',
  standalone: true,
  host: {
    '[class.primary]': 'isPrimary()',
    '[class.secondary]': 'isSecondary()',
    '[class.disabled]': 'disabled()',
  }
})
export class ButtonDirective {
  readonly variant = input<ButtonVariant>('primary');
  readonly disabled = input<boolean>(false);

  readonly isPrimary = computed(() => this.variant() === 'primary');
  readonly isSecondary = computed(() => this.variant() === 'secondary');
}
