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

export default class WebSocketClient {
    private static instance: WebSocketClient;
    private ws: WebSocket;
    public onLoginSuccess?: (userLogin: string) => void;
    public onLoginError?: (errorMessage: string) => void;
    private currentUserLogin: string | null;

    constructor(url: string) {
        this.ws = new WebSocket(url);
        this.attachEventListeners();
        this.currentUserLogin = 'def1';
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
    }

    private onMessage(event: MessageEvent): void {
        console.log('Received response:', event.data);
        try {
            const response: LoginResponse | ErrorResponse = JSON.parse(event.data);
            switch (response.type) {
                case 'USER_LOGIN':
                    this.handleLoginResponse(response as LoginResponse);
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
            if (this.onLoginSuccess && this.currentUserLogin !== null) {
                this.onLoginSuccess(this.currentUserLogin);
            }
        } else {
            console.log('Login failed.');
            this.currentUserLogin = null;
            if (this.onLoginError) {
                this.onLoginError('Login failed. Please check your credentials and try again.');
            }
        }
    }

    public getLoggedUserName(): string | null {
        console.log('Current logged user name:', this.currentUserLogin);
        return this.currentUserLogin;
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
}
