import Tag from '../templates/component';
import WebSocketClient, { Message } from '../server/server';

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
        this.webSocketClient.onMessageHistoryReceived = this.displayMessages.bind(this);
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
        const chatHeader = new Tag('div', { class: 'chat-header' });
        const chatUser = new Tag('div', { class: 'chat-header-user' });
        const chatUserStatus = new Tag('div', { class: 'chat-header-user-status' });
        const chatContent = new Tag('p', { class: 'chat-content' });
        const chatInput = new Tag<HTMLInputElement>('input', {
            type: 'text',
            placeholder: 'Type your message here...',
            class: 'chat-input',
        });
        const chatSendButton = new Tag('button', { class: 'chat-send-button' });
        chatSendButton.addText('Send');

        chatHeader.addText('Communication area');
        chatContent.addText('Messages will appear here.');

        chatHeader.addChild(chatUser.render());
        chatHeader.addChild(chatUserStatus.render());
        chatWrapper.addChild(chatHeader.render());
        chatWrapper.addChild(chatContent.render());
        chatWrapper.addChild(chatInput.render());
        chatWrapper.addChild(chatSendButton.render());
        this.main.addChild(chatWrapper.render());

        chatSendButton.element.addEventListener('click', () => {
            this.sendMessage(chatInput.element.value);
            chatInput.element.value = '';
        });

        chatInput.element.addEventListener('keypress', (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                this.sendMessage(chatInput.element.value);
                chatInput.element.value = '';
                event.preventDefault();
            }
        });
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
        const currentUser = localStorage.getItem(`${this.webSocketClient.sessionID}_user`);

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

            userItem.element.addEventListener('click', () => {
                this.openChatWithUser(user);
            });
        });
    }

    updateFiltetedUserList(users: Array<{ login: string; isLogined: boolean }>, isAuthorized?: boolean): void {
        this.userContent.clear();

        const currentUser = localStorage.getItem(`${this.webSocketClient.sessionID}_user`);

        const filteredUsers = users.filter((user) => user.login !== currentUser);

        filteredUsers.forEach((user) => {
            const backgroundColor = isAuthorized ? 'user-list-item-green' : 'user-list-item-red';
            const userItem = new Tag('li', { class: `user-list-item ${backgroundColor}` });
            userItem.addText(`${user.login}`);
            this.userContent.addChild(userItem.render());

            userItem.element.addEventListener('click', () => {
                this.openChatWithUser(user);
            });
        });
    }

    private filterUsers(searchTerm: string): void {
        const currentUser = localStorage.getItem(`${this.webSocketClient.sessionID}_user`);
        let filteredUsers = this.users;

        if (searchTerm.trim() !== '') {
            filteredUsers = this.users.filter(
                (user) => user.login.toLowerCase().includes(searchTerm.toLowerCase()) && user.login !== currentUser
            );
        }

        this.updateFiltetedUserList(filteredUsers);
    }

    private openChatWithUser(user: { login: string; isLogined: boolean }): void {
        const chatWindow = document.querySelector('.chat-wrapper');
        if (chatWindow) {
            const chatUser = chatWindow.querySelector('.chat-header-user') as HTMLElement;
            const chatUserStatus = chatWindow.querySelector('.chat-header-user-status') as HTMLElement;
            const chatContent = chatWindow.querySelector('.chat-content') as HTMLElement;

            if (chatUser && chatUserStatus && chatContent) {
                chatUser.textContent = user.login;
                chatUserStatus.textContent = user.isLogined ? 'Online' : 'Offline';
                chatContent.innerHTML = '';

                this.webSocketClient.fetchMessageHistory(user.login);
            } else {
                console.error('Chat user elements not found');
            }
        } else {
            console.error('Chat window element not found');
        }
    }

    private sendMessage(messageText: string): void {
        if (!messageText.trim()) {
            this.displayNotification('Impossible to send a message with no content');
            return;
        }

        const chatUserElement = document.querySelector('.chat-header-user');
        const chatUser = chatUserElement ? chatUserElement.textContent : '';

        if (!chatUser) {
            console.error('No user selected for chat.');
            return;
        }

        this.webSocketClient.sendMessage(chatUser, messageText);

        // Add the message to the UI
        this.addMessageToUI('You', messageText, new Date(), false, false);
    }

    private displayMessages(messages: Message[]) {
        const chatContent = document.querySelector('.chat-content');
        const currentUser = localStorage.getItem(`${this.webSocketClient.sessionID}_user`);

        if (chatContent) {
            chatContent.innerHTML = '';
            messages.forEach((message) => {
                const messageElement = document.createElement('p');
                let statusText = `${new Date(message.datetime).toLocaleString()}: ${message.text}`;

                if (message.from === currentUser) {
                    const deliveredStatus = message.status.isDelivered ? 'Delivered' : 'Not Delivered';
                    const readStatus = message.status.isReaded ? 'Read' : 'Unread';
                    statusText += ` (${deliveredStatus}, ${readStatus})`;
                }

                messageElement.textContent = `${message.from} [${statusText}]`;
                chatContent.appendChild(messageElement);
            });
        }
    }

    private displayNotification(message: string): void {
        const chatWrapper = document.querySelector('.chat-wrapper');
        if (chatWrapper) {
            const notification = new Tag('div', { class: 'chat-notification' });
            notification.addText(message);
            chatWrapper.appendChild(notification.render());

            setTimeout(() => {
                if (notification.element.parentNode) {
                    notification.element.parentNode.removeChild(notification.element);
                }
            }, 3000);
        }
    }

    private addMessageToUI(from: string, text: string, datetime: Date, isDelivered: boolean, isReaded: boolean) {
        const chatContent = document.querySelector('.chat-content');
        if (chatContent) {
            const messageElement = document.createElement('p');
            let statusText;
            if (isDelivered) {
                statusText = isReaded ? 'Read' : 'Delivered';
            } else {
                statusText = 'Sending...';
            }
            messageElement.textContent = `${from} [${datetime.toLocaleTimeString()}]: ${text} (${statusText})`;
            chatContent.appendChild(messageElement);
        }
    }

    render(): HTMLElement {
        return this.main.render();
    }
}
