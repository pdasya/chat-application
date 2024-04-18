import Tag from '../templates/component';
import WebSocketClient from '../server/server';

export default class Main {
    private main: Tag;
    private webSocketClient: WebSocketClient;
    private userContent: Tag = new Tag('ul', { class: 'user-list-content' });

    constructor(webSocketClient: WebSocketClient) {
        this.main = new Tag('div', { class: 'main-app' });
        this.webSocketClient = webSocketClient;
        this.addUserList();
        this.addChatWrapper();
        this.fetchAndDisplayUsers();
    }

    addUserList(): void {
        const userListWrapper = new Tag('div', { class: 'user-list-wrapper' });
        const userHeader = new Tag('h2', { class: 'user-list-header' });
        userHeader.addText('User List');
        userListWrapper.addChild(userHeader.render());
        userListWrapper.addChild(this.userContent.render());
        this.main.addChild(userListWrapper.render());
    }

    addChatWrapper(): void {
        const chatWrapper = new Tag('div', { class: 'chat-wrapper' });
        const chatHeader = new Tag('h2', { class: 'chat-header' });
        const chatContent = new Tag('p', { class: 'chat-content' });
        chatHeader.addText('Communication lalala');
        chatContent.addText(
            'The list of authorized users will be presented here.The list of authorized users will be presented here.The list of authorized users will be presented here.The list of authorized users will be presented here'
        );
        chatWrapper.addChild(chatHeader.render());
        chatWrapper.addChild(chatContent.render());
        this.main.addChild(chatWrapper.render());
    }

    fetchAndDisplayUsers(): void {
        this.webSocketClient.onActiveUsers = (users) => {
            this.updateUserList(users);
        };
        this.webSocketClient.getAllAuthenticatedUsers();
    }

    updateUserList(users: Array<{ login: string; isLogined: boolean }>): void {
        // this.userContent.clear();
        users.forEach((user) => {
            const userItem = new Tag('li', {});
            userItem.addText(user.login);
            this.userContent.addChild(userItem.render());
        });
    }

    render(): HTMLElement {
        return this.main.render();
    }
}
