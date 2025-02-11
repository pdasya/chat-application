interface LoginRequest {
    id: string;
    type: string;
    payload: {
        user: {
            login: string;
            password: string;
        };
    };
}

interface LoginResponse {
    id: string;
    type: string;
    payload: {
        user: {
            login: string;
            isLogined: boolean;
        };
    };
}

interface ErrorResponse {
    id: string;
    type: string;
    payload: {
        error: string;
    };
}

interface LogoutRequest {
    id: string;
    type: string;
    payload: {
        user: {
            login: string;
            password: string;
        };
    };
}

interface LogoutResponse {
    id: string;
    type: string;
    payload: {
        user: {
            login: string;
            isLogined: boolean;
        };
    };
}

interface ExternalLoginResponse {
    id: string | null;
    type: 'USER_EXTERNAL_LOGIN';
    payload: {
        user: {
            login: string;
            isLogined: boolean;
        };
    };
}

interface ExternalLogoutResponse {
    id: string | null;
    type: 'USER_EXTERNAL_LOGOUT';
    payload: {
        user: {
            login: string;
            isLogined: boolean;
        };
    };
}

interface ActiveUsersResponse {
    id: string;
    type: 'USER_ACTIVE';
    payload: {
        users: Array<{
            login: string;
            isLogined: boolean;
        }>;
    };
}

interface InactiveUsersRequest {
    id: string;
    type: 'USER_INACTIVE';
    payload: null;
}

interface InactiveUsersResponse {
    id: string;
    type: 'USER_INACTIVE';
    payload: {
        users: Array<{
            login: string;
            isLogined: boolean;
        }>;
    };
}

interface ReceivedMessageResponse {
    id: string;
    type: 'MSG_SEND';
    payload: {
        message: {
            id: string;
            from: string;
            to: string;
            text: string;
            datetime: number;
            status: {
                isDelivered: boolean;
                isReaded: boolean;
                isEdited: boolean;
            };
        };
    };
}

export interface Message {
    id: string;
    from: string;
    to: string;
    text: string;
    datetime: number;
    status: {
        isDelivered: boolean;
        isReaded: boolean;
        isEdited: boolean;
    };
}

interface ReceivedMessageHistoryResponse {
    id: string;
    type: 'MSG_FROM_USER';
    payload: {
        messages: Message[];
    };
}

interface MessageDeliveryStatusChange {
    id: string;
    type: 'MSG_DELIVER';
    payload: {
        message: {
            id: string;
            status: {
                isDelivered: boolean;
            };
        };
    };
}

interface MessageReadStatusChangeResponse {
    id: string;
    type: 'MSG_READ';
    payload: {
        message: {
            id: string;
            status: {
                isReaded: boolean;
            };
        };
    };
}

export default class WebSocketClient {
    private static instance: WebSocketClient;
    private ws: WebSocket;
    public onLoginSuccess?: (userLogin: string) => void;
    public onLoginError?: (errorMessage: string) => void;
    private currentUserLogin: string | null;
    private currentUserPassword: string;
    public onActiveUsers?: (users: Array<{ login: string; isLogined: boolean }>) => void;
    public onUserUpdate?: () => void;
    public onInactiveUsers?: (users: Array<{ login: string; isLogined: boolean }>) => void;
    public onMessageReceived?: (message: ReceivedMessageResponse['payload']['message']) => void;
    public onMessageHistoryReceived?: (messages: Message[]) => void;
    public messages: Message[] = [];
    public sessionID: string;

    constructor(url: string) {
        this.ws = new WebSocket(url);
        this.attachEventListeners();
        this.currentUserLogin = null;
        this.currentUserPassword = 'def1';
        this.sessionID = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        this.loadSessionData();
    }

    private loadSessionData() {
        const userLogin = localStorage.getItem(`${this.sessionID}_user`);
        if (userLogin) {
            this.currentUserLogin = userLogin;
            this.currentUserPassword = '';
        } else {
            this.currentUserLogin = null;
            this.currentUserPassword = '';
        }
    }

    private clearSessionData() {
        localStorage.removeItem(`${this.sessionID}_user`);
    }

    public static getInstance(url: string): WebSocketClient {
        if (!WebSocketClient.instance) {
            WebSocketClient.instance = new WebSocketClient(url);
        }
        return WebSocketClient.instance;
    }

    private attachEventListeners(): void {
        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onmessage = this.onMessage.bind(this);
        this.ws.onclose = this.onClose.bind(this);
        this.ws.onerror = this.onError.bind(this);
    }

    private onOpen(): void {
        console.log('Connected to the server!');
    }

    public login(login: string, password: string): void {
        const request: LoginRequest = {
            id: this.generateUniqueId(),
            type: 'USER_LOGIN',
            payload: {
                user: {
                    login,
                    password,
                },
            },
        };
        this.ws.send(JSON.stringify(request));
        this.currentUserLogin = login;
        this.currentUserPassword = password;
        this.saveSessionData();
    }

    private saveSessionData() {
        const userData = this.currentUserLogin as string;
        localStorage.setItem(`${this.sessionID}_user`, userData);
    }

    private onMessage(event: MessageEvent): void {
        console.log('Received response:', event.data);
        try {
            const response:
                | LoginResponse
                | LogoutResponse
                | ErrorResponse
                | ActiveUsersResponse
                | InactiveUsersResponse
                | ReceivedMessageResponse
                | ReceivedMessageHistoryResponse
                | MessageDeliveryStatusChange
                | MessageReadStatusChangeResponse = JSON.parse(event.data);
            switch (response.type) {
                case 'USER_ACTIVE':
                    this.handleActiveUsersResponse(response as ActiveUsersResponse);
                    break;
                case 'USER_LOGIN':
                    this.handleLoginResponse(response as LoginResponse);
                    break;
                case 'USER_LOGOUT':
                    this.handleLogoutResponse(response as LogoutResponse);
                    break;
                case 'USER_EXTERNAL_LOGIN':
                    this.handleExternalLogin(response as ExternalLoginResponse);
                    break;
                case 'USER_EXTERNAL_LOGOUT':
                    this.handleExternalLogout(response as ExternalLogoutResponse);
                    break;
                case 'USER_INACTIVE':
                    this.handleInactiveUsersResponse(response as InactiveUsersResponse);
                    break;
                case 'MSG_SEND':
                    this.handleReceivedMessage(response as ReceivedMessageResponse);
                    break;
                case 'MSG_FROM_USER':
                    this.handleMessageHistoryResponse(response as ReceivedMessageHistoryResponse);
                    break;
                case 'MSG_DELIVER':
                    this.handleMessageDelivered(response as MessageDeliveryStatusChange);
                    break;
                case 'MSG_READ':
                    this.handleMessageRead(response as MessageReadStatusChangeResponse);
                    break;
                case 'ERROR':
                    this.handleError(response as ErrorResponse);
                    break;
                default:
                    console.log('Unhandled message type:', response.type);
            }
        } catch (error) {
            console.error('Failed to parse response:', error);
        }
    }

    private handleLoginResponse(response: LoginResponse): void {
        if (response.payload.user.isLogined) {
            console.log(`Login successful for user ${response.payload.user.login}`);
            this.currentUserLogin = response.payload.user.login;
            this.saveSessionData();
            if (this.onLoginSuccess && this.currentUserLogin !== null) {
                this.onLoginSuccess(this.currentUserLogin);
            }
        } else {
            console.log('Login failed.');
            this.currentUserLogin = null;
            this.currentUserPassword = '';
            this.clearSessionData();
            if (this.onLoginError) {
                this.onLoginError('Login failed. Please check your credentials and try again.');
            }
        }
    }

    private handleLogoutResponse(response: LogoutResponse): void {
        console.log(`Logout successful for user ${response.payload.user.login}`);
        this.currentUserLogin = null;
        this.currentUserPassword = '';
        this.clearSessionData();
    }

    private handleExternalLogin(response: ExternalLoginResponse): void {
        console.log(`External login: User ${response.payload.user.login} has logged in.`);
        if (this.onUserUpdate) {
            this.onUserUpdate();
        }
    }

    private handleExternalLogout(response: ExternalLogoutResponse): void {
        console.log(`External logout: User ${response.payload.user.login} has logged out.`);
        if (this.onUserUpdate) {
            this.onUserUpdate();
        }
    }

    public getLoggedUserName(): string | null {
        console.log('Current logged user name:', this.currentUserLogin);
        return localStorage.getItem(`${this.sessionID}_user`);
    }

    private handleError(response: ErrorResponse): void {
        console.error('Error:', response.payload.error);
        if (this.onLoginError) {
            this.onLoginError(response.payload.error);
        }
    }

    private onClose(): void {
        console.log('Disconnected from the server');
    }

    private onError(error: Event): void {
        console.error('WebSocket error:', error);
    }

    private generateUniqueId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    public logout(): void {
        if (!this.currentUserLogin) {
            console.error('No user is logged in.');
            return;
        }
        const request: LogoutRequest = {
            id: this.generateUniqueId(),
            type: 'USER_LOGOUT',
            payload: {
                user: {
                    login: this.currentUserLogin,
                    password: this.currentUserPassword,
                },
            },
        };
        this.ws.send(JSON.stringify(request));
    }

    public getAllAuthenticatedUsers(): void {
        const request = {
            id: this.generateUniqueId(),
            type: 'USER_ACTIVE',
            payload: null,
        };
        this.ws.send(JSON.stringify(request));
        console.log('Request sent for all authenticated users:', request);
    }

    public handleActiveUsersResponse(response: ActiveUsersResponse): void {
        console.log('Active users received:', response.payload.users);
        if (this.onActiveUsers) {
            this.onActiveUsers(response.payload.users);
        }
    }

    public getUnauthorizedUsers(): void {
        const request: InactiveUsersRequest = {
            id: this.generateUniqueId(),
            type: 'USER_INACTIVE',
            payload: null,
        };
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(request));
            console.log('Request sent for all unauthorized users:', request);
        } else {
            console.log('WebSocket is not open.');
        }
    }

    private handleInactiveUsersResponse(response: InactiveUsersResponse): void {
        console.log('Inactive users received:', response.payload.users);
        if (this.onInactiveUsers) {
            this.onInactiveUsers(response.payload.users);
        }
    }

    public sendMessage(to: string, text: string): void {
        const messageRequest = {
            id: this.generateUniqueId(),
            type: 'MSG_SEND',
            payload: {
                message: {
                    to,
                    text,
                },
            },
        };
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(messageRequest));
            console.log('Message sent:', messageRequest);
        } else {
            console.error('WebSocket is not open. Unable to send message.');
        }
    }

    private handleReceivedMessage(response: ReceivedMessageResponse): void {
        console.log('Message received from', response.payload.message.from, ':', response.payload.message.text);

        if (!response.payload.message.status.isDelivered) {
            response.payload.message.status.isDelivered = true;
        }

        if (this.onMessageReceived) {
            this.onMessageReceived(response.payload.message);
        }
    }

    public fetchMessageHistory(userLogin: string): void {
        const request = {
            id: this.generateUniqueId(),
            type: 'MSG_FROM_USER',
            payload: {
                user: {
                    login: userLogin,
                },
            },
        };

        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(request));
            console.log('Fetching message history for:', userLogin);
        } else {
            console.error('WebSocket is not open. Cannot fetch message history.');
        }
    }

    private handleMessageHistoryResponse(response: ReceivedMessageHistoryResponse): void {
        console.log('Received message history:', response.payload.messages);
        if (this.onMessageHistoryReceived) {
            this.onMessageHistoryReceived(response.payload.messages);
        }
    }

    private handleMessageDelivered(response: MessageDeliveryStatusChange): void {
        console.log(
            'Message delivery status updated:',
            response.payload.message.id,
            'isDelivered:',
            response.payload.message.status.isDelivered
        );
        const message = this.messages.find((msg) => msg.id === response.payload.message.id);
        if (message) {
            message.status.isDelivered = true;
        }
    }

    private handleMessageRead(response: MessageReadStatusChangeResponse): void {
        console.log(
            'Message read status updated:',
            response.payload.message.id,
            'isReaded:',
            response.payload.message.status.isReaded
        );
        const message = this.messages.find((msg) => msg.id === response.payload.message.id);
        if (message) {
            message.status.isReaded = true;
        }
    }

    markMessageAsRead(messageId: string): void {
        const request = {
            id: this.generateUniqueId(),
            type: 'MSG_READ',
            payload: {
                message: {
                    id: messageId,
                },
            },
        };
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(request));
            console.log('Marking message as read:', messageId);
        }
    }
}
