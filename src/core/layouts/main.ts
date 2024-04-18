import Tag from '../templates/component';

export default class Main {
    private main: Tag;

    constructor() {
        this.main = new Tag('div', { class: 'main-app' });
        this.addUserList();
        this.addChatWrapper();
    }

    addUserList(): void {
        const userListWrapper = new Tag('div', { class: 'user-list-wrapper' });
        const userHeader = new Tag('h2', { class: 'user-list-header' });
        const userContent = new Tag('p', { class: 'user-list-content' });
        userHeader.addText('User List');
        userContent.addText(
            'The list of authorized users will be presented here.The list of authorized users will be presented here.The list of authorized users will be presented here.The list of authorized users will be presented here'
        );
        userListWrapper.addChild(userHeader.render());
        userListWrapper.addChild(userContent.render());
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

    render(): HTMLElement {
        return this.main.render();
    }
}
