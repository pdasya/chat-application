export default class Tag {
    private element: HTMLElement;

    constructor(tagName: string, attributes: { [key: string]: string } = {}) {
        this.element = document.createElement(tagName);
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

    render(): HTMLElement {
        return this.element;
    }
}
