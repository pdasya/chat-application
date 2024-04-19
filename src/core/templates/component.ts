export default class Tag<T extends HTMLElement = HTMLElement> {
    element: T;

    constructor(tagName: string, attributes: { [key: string]: string } = {}) {
        this.element = document.createElement(tagName) as T;
        this.setAttributes(attributes);
    }

    setAttributes(attributes: { [key: string]: string }): void {
        Object.entries(attributes).forEach(([key, value]) => {
            this.element.setAttribute(key, value);
        });
    }

    addChild(child: HTMLElement): void {
        this.element.appendChild(child);
    }

    addText(text: string): void {
        const textNode = document.createTextNode(text);
        this.element.appendChild(textNode);
    }

    clear(): void {
        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
    }

    render(): HTMLElement {
        return this.element;
    }
}
