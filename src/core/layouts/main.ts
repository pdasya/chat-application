import Tag from '../templates/component';
import WebSocketClient from '../server/server';

export default class Main {
    private main: Tag;
    private webSocketClient: WebSocketClient;
    private userContent: Tag = new Tag('ul', { class: 'user-list-content' });
    private searchInput: Tag<HTMLInputElement> = new Tag<HTMLInputElement>('input', {
        type: 'text',
        placeholder: 'Search users...',
        class: 'user-search-input',
    });
    private users: Array<{ login: string; isLogined: boolean }> = [];

    constructor(webSocketClient: WebSocketClient) {
        this.main = new Tag('div', { class: 'main-app' });
        this.webSocketClient = webSocketClient;
        this.webSocketClient.onUserUpdate = this.fetchAndDisplayUsers.bind(this);
        this.initializeUI();
        this.setupEventListeners();
        this.fetchAndDisplayUsers();
    }

    private initializeUI(): void {
        this.addUserList();
        this.addChatWrapper();
    }

    private setupEventListeners(): void {
        this.searchInput.element.addEventListener('input', () => {
            this.filterUsers(this.searchInput.element.value);
        });
        this.webSocketClient.onActiveUsers = (users) => {
            this.updateUserList(users, true);
        };
        this.webSocketClient.onInactiveUsers = (users) => {
            this.updateUserList(users, false);
        };
        this.webSocketClient.onUserUpdate = this.fetchAndDisplayUsers.bind(this);
    }

    addUserList(): void {
        const userListWrapper = new Tag('div', { class: 'user-list-wrapper' });
        const userHeader = new Tag('h2', { class: 'user-list-header' });
        userHeader.addText('User List');
        userListWrapper.addChild(userHeader.render());
        userListWrapper.addChild(this.searchInput.render());
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
            this.updateUserList(users, true);
        };
        this.webSocketClient.getAllAuthenticatedUsers();
        this.webSocketClient.onInactiveUsers = (users) => {
            this.updateUserList(users, false);
        };
        this.webSocketClient.getUnauthorizedUsers();
    }

    updateUserList(users: Array<{ login: string; isLogined: boolean }>, isAuthorized?: boolean): void {
        this.users = users;
        const currentUser = localStorage.getItem('currentUser');

        if (isAuthorized) {
            this.userContent.clear();
        }

        const filteredUsers = users.filter((user) => user.login !== currentUser);

        filteredUsers.forEach((user) => {
            // const statusText = isAuthorized ? 'Authorized' : 'Unauthorized';
            const backgroundColor = isAuthorized ? 'user-list-item-green' : 'user-list-item-red';
            const userItem = new Tag('li', { class: `user-list-item ${backgroundColor}` });
            userItem.addText(`${user.login}`);
            this.userContent.addChild(userItem.render());
        });
    }

    updateFiltetedUserList(users: Array<{ login: string; isLogined: boolean }>, isAuthorized?: boolean): void {
        this.userContent.clear();

        const currentUser = localStorage.getItem('currentUser');

        const filteredUsers = users.filter((user) => user.login !== currentUser);

        filteredUsers.forEach((user) => {
            const backgroundColor = isAuthorized ? 'user-list-item-green' : 'user-list-item-red';
            const userItem = new Tag('li', { class: `user-list-item ${backgroundColor}` });
            userItem.addText(`${user.login}`);
            this.userContent.addChild(userItem.render());
        });
    }

    private filterUsers(searchTerm: string): void {
        const currentUser = localStorage.getItem('currentUser');
        let filteredUsers = this.users;

        if (searchTerm.trim() !== '') {
            filteredUsers = this.users.filter(
                (user) => user.login.toLowerCase().includes(searchTerm.toLowerCase()) && user.login !== currentUser
            );
        }

        this.updateFiltetedUserList(filteredUsers);
    }

    render(): HTMLElement {
        return this.main.render();
    }
}
