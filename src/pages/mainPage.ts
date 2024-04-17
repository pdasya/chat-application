import Tag from '../core/templates/component';
import Header from '../core/layouts/header';
import WebSocketClient from '../core/server/server';

export default class MainPage {
    private page: Tag;
    private header: Header;
    private webSocketClient: WebSocketClient;

    constructor() {
        this.webSocketClient = WebSocketClient.getInstance('ws://localhost:4000');
        this.page = new Tag('div', { class: 'main-wrapper' });
        this.header = new Header(this.webSocketClient);
        this.page.addChild(this.header.render());
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
