import Tag from '../templates/component';
import WebSocketClient from '../server/server';
import { PageIds } from '../types/enums';

export default class Header {
    private header: Tag;
    private webSocketClient: WebSocketClient;

    constructor(webSocketClient: WebSocketClient) {
        this.webSocketClient = webSocketClient;
        this.header = new Tag('header', { class: 'header-app' });
        this.addCurrentUserName();
        this.addAppName('Fun chat');
        this.addLogoutButton('logout');
    }

    addCurrentUserName(): void {
        const name = this.webSocketClient.getLoggedUserName();
        if (name) {
            const userNameTag = new Tag('p', { class: 'header-user-name' });
            userNameTag.addText(name);
            this.header.addChild(userNameTag.render());
        } else {
            console.log('No user found');
        }
    }

    addAppName(text: string): void {
        const addName = new Tag('p', { class: 'header-app-name' });
        addName.addText(text);
        this.header.addChild(addName.render());
    }

    addLogoutButton(text: string): void {
        const logoutButton = new Tag('button', { class: 'header-logout-button' });
        logoutButton.addText(text);
        logoutButton.element.addEventListener('click', () => {
            this.webSocketClient.logout();
            window.location.hash = PageIds.Auth;
            sessionStorage.removeItem('isAuthentificated');
        });
        this.header.addChild(logoutButton.render());
    }

    render(): HTMLElement {
        return this.header.render();
    }
}
