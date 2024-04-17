import Tag from '../core/templates/component';

export default class MainPage {
    private page: Tag;

    constructor() {
        this.page = new Tag('div', { class: 'main-wrapper' });
        this.addTitle('Main');
    }

    private addTitle(text: string): void {
        const title = new Tag('h2', { class: 'main-page-header' });
        title.addText(text);
        this.page.addChild(title.render());
    }

    render(): HTMLElement {
        return this.page.render();
    }
}
