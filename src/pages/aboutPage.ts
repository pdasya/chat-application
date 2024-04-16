import Tag from '../core/templates/component';
import { PageIds } from '../core/types/enums';

export default class AboutPage {
    private page: Tag;

    constructor() {
        const description =
            'Fun chat  is an advanced instant messaging application developed using cutting-edge technologies such as TypeScript, Webpack, and WebSocket. This solution allows users to stay in constant contact by enabling them to send text messages, files, and make voice and video calls. The implementation based on WebSocket ensures high data transfer speed and instant message reception, while TypeScript and Webpack provide security, modularity, and optimized application loading. Additionally, user and message deletions are conducted once daily to maintain data integrity and optimize performance.';
        this.page = new Tag('div', { class: 'about-wrapper' });
        this.addTitle('About');
        this.addDescription(description);
        this.addAuthorLink('Please visit author profile');
        this.addReturnButton('Back to auth page');
    }

    private addTitle(text: string): void {
        const title = new Tag('h2', { class: 'about-page-header' });
        title.addText(text);
        this.page.addChild(title.render());
    }

    private addDescription(text: string): void {
        const appDescr = new Tag('p', { class: 'about-page-description' });
        appDescr.addText(text);
        this.page.addChild(appDescr.render());
    }

    private addAuthorLink(text: string): void {
        const ghLink = new Tag('a', { class: 'about-page-link', href: 'https://github.com/pdasya', target: '_blank' });
        ghLink.addText(text);
        this.page.addChild(ghLink.render());
    }

    private addReturnButton(text: string): void {
        const button = new Tag('button', { class: 'about-page-button' });
        button.addText(text);
        button.element.addEventListener('click', () => {
            window.location.hash = PageIds.Auth;
        });
        this.page.addChild(button.render());
    }

    render(): HTMLElement {
        return this.page.render();
    }
}
