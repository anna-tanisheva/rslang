type Class = { new (...args: unknown[]): unknown };

export const isInstanceOf = <T extends Class>(
  el: unknown,
  ctor: T
): el is T => Boolean(el) && el instanceof ctor;

export const isHTMLElement = (el: unknown): el is HTMLElement => isInstanceOf(el, HTMLElement);

export const isHTMLInputElement = (el: unknown): el is HTMLInputElement => isInstanceOf(el, HTMLInputElement);

export const isHTMLButtonElement = (el: unknown): el is HTMLButtonElement => isInstanceOf(el, HTMLButtonElement);

export const isWindow = (el: unknown): el is Window => isInstanceOf(el, Window);

export const isHTMLDivElement = (el: unknown): el is HTMLDivElement => isInstanceOf(el, HTMLDivElement);
