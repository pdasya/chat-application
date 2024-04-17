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
        this.main.addChild(userListWrapper.render());
    }

    addChatWrapper(): void {
        const chatWrapper = new Tag('div', { class: 'chat-wrapper' });
        this.main.addChild(chatWrapper.render());
    }

    render(): HTMLElement {
        return this.main.render();
    }
}
