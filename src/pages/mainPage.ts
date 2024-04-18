import Tag from '../core/templates/component';
import Header from '../core/layouts/header';
import WebSocketClient from '../core/server/server';
import Footer from '../core/layouts/footer';
import Main from '../core/layouts/main';

export default class MainPage {
    private page: Tag;
    private header: Header;
    private main: Main;
    private footer: Footer;
    private webSocketClient: WebSocketClient;

    constructor() {
        this.webSocketClient = WebSocketClient.getInstance('ws://localhost:4000');
        this.page = new Tag('div', { class: 'main-wrapper' });
        this.header = new Header(this.webSocketClient);
        this.footer = new Footer();
        this.main = new Main(this.webSocketClient);
        this.page.addChild(this.header.render());
        this.page.addChild(this.main.render());
        this.page.addChild(this.footer.render());
    }

    render(): HTMLElement {
        return this.page.render();
    }
}
