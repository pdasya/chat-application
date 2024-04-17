import Tag from '../core/templates/component';
import Header from '../core/layouts/header';
import WebSocketClient from '../core/server/server';
import Footer from '../core/layouts/footer';

export default class MainPage {
    private page: Tag;
    private header: Header;
    private footer: Footer;
    private webSocketClient: WebSocketClient;

    constructor() {
        this.webSocketClient = WebSocketClient.getInstance('ws://localhost:4000');
        this.page = new Tag('div', { class: 'main-wrapper' });
        this.header = new Header(this.webSocketClient);
        this.footer = new Footer();
        this.page.addChild(this.header.render());
        this.addTitle('Main');
        this.page.addChild(this.footer.render());
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
