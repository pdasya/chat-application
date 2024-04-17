interface User {
    login: string;
    isLogined?: boolean;
}

interface Message {
    id?: string;
    from?: string;
    to: string;
    text: string;
    datetime?: number;
    status?: {
        isDelivered: boolean;
        isReaded?: boolean;
        isEdited?: boolean;
    };
}

export { User, Message };
