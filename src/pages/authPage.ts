import FormValidator from '../core/components/formValidator';
import Tag from '../core/templates/component';
import { PageIds } from '../core/types/enums';
import WebSocketClient from '../core/server/server';

export default class AuthPage {
    private form: Tag;
    private validator: FormValidator;
    private webSocketClient: WebSocketClient;

    constructor() {
        this.form = new Tag('form', { class: 'login-form' });
        const formElement = this.form.element as HTMLFormElement;
        this.validator = new FormValidator(formElement);
        this.webSocketClient = WebSocketClient.getInstance('ws://localhost:4000');
        
        this.form.element.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.validator.clearErrors();
                if (this.validator.validateInputs()) {
                    this.submitForm();
                    this.initialFormAfterSubmit();
                }
            }
        });

        this.addTitle('Login');
        this.addInput('username', 'Username', false);
        this.addInput('password', 'Password', true);
        this.addSubmitButton('Login');
        this.addAboutButton('About');
        this.addCornerImage();
    }

    private addTitle(text: string): void {
        const title = new Tag('h2', { class: 'login-form-header' });
        title.addText(text);
        this.form.addChild(title.render());
    }

    private addInput(name: string, placeholder: string, isPassword: boolean = false): void {
        const inputContainer = new Tag('div', { class: 'input-container' });

        const inputType = isPassword ? 'password' : 'text';
        const inputAttributes = {
            id: name,
            name,
            type: inputType,
            placeholder,
            class: 'input-field',
        };
        const input = new Tag('input', inputAttributes);
        input.element.addEventListener('input', () => this.updateSubmitButtonState());
        inputContainer.addChild(input.render());
        this.form.addChild(inputContainer.render());
    }

    private addSubmitButton(text: string): void {
        const button = new Tag('button', { type: 'submit', class: 'login-form-submit', disabled: 'true' });
        button.addText(text);
        button.element.addEventListener('click', (event) => {
            event.preventDefault();
            this.validator.clearErrors();
            if (this.validator.validateInputs()) {
                this.submitForm();
                this.initialFormAfterSubmit();
            }
        });
        this.form.addChild(button.render());
    }

    private addAboutButton(text: string): void {
        const button = new Tag('button', { class: 'login-form-about' });
        button.addText(text);
        button.element.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            window.location.hash = PageIds.About;
        });
        this.form.addChild(button.render());
    }

    private addCornerImage(): void {
        const cornerImage = new Tag('img', { src: 'https://freesvg.org/img/totoro.png', class: 'login-form-image' });
        this.form.addChild(cornerImage.render());
    }

    private initialFormAfterSubmit(): void {
        const inputs = document.querySelectorAll('.input-field');
        inputs.forEach((element) => {
            const field = element as HTMLInputElement;
            field.value = '';
        });
        const submitButton = document.querySelector('.login-form-submit') as HTMLButtonElement;
        submitButton.disabled = true;
    }

    private updateSubmitButtonState(): void {
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        const submitButton = document.querySelector('.login-form-submit') as HTMLButtonElement;

        submitButton.disabled = !username || !password;
    }

    private async submitForm(): Promise<void> {
        console.log('Submited');
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        this.webSocketClient.login(username, password);
        this.webSocketClient.onLoginSuccess = () => {
            window.location.hash = PageIds.Main;
            sessionStorage.setItem('isAuthentificated', 'true');
        };
        this.webSocketClient.onLoginError = (errorMessage: string) => {
            this.displayError(errorMessage);
        };
    }

    public displayError(message: string): void {
        const errorDiv = new Tag('div', { class: 'error-message' });
        errorDiv.addText(message);
        this.form.addChild(errorDiv.render());
    }

    render(): HTMLElement {
        return this.form.render();
    }
}
