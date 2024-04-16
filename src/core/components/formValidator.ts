import Tag from '../templates/component';

export default class FormValidator {
    private formElement: HTMLFormElement;

    constructor(formElement: HTMLFormElement) {
        this.formElement = formElement;
    }

    public validateInputs(): boolean {
        const username = (this.formElement.querySelector('#username') as HTMLInputElement).value;
        const password = (this.formElement.querySelector('#password') as HTMLInputElement).value;

        const isUsernameLong = username.length > 3;
        const isPasswordLong = password.length > 3;

        const isUsernameLatin = /^[A-Za-z]+$/.test(username);
        const isPasswordLatin = /^[A-Za-z]+$/.test(password);

        this.clearErrors();

        if (!isUsernameLong || !isPasswordLong) {
            this.displayError('Username and password must be longer than 3 characters.');
            return false;
        }

        if (!isUsernameLatin || !isPasswordLatin) {
            this.displayError('Username and password must contain only Latin characters.');
            return false;
        }
        return true;
    }

    public displayError(message: string): void {
        const errorDiv = new Tag('div', { class: 'error-message' });
        errorDiv.addText(message);
        this.formElement.appendChild(errorDiv.render());
    }

    public clearErrors(): void {
        const errors = this.formElement.querySelectorAll('.error-message');
        errors.forEach((error) => error.remove());
    }
}
