import Tag from '../core/templates/component';

export default class AuthPage {
    private form: Tag;

    constructor() {
        this.form = new Tag('form', { class: 'login-form' });
        this.addTitle('Login Page');
        this.addInput('username', 'Username', false);
        this.addInput('password', 'Password', true);
        this.addSubmitButton('Login');
    }

    private addTitle(text: string): void {
        const title = new Tag('h2');
        title.addText(text);
        this.form.addChild(title.render());
    }

    private addInput(name: string, placeholder: string, isPassword: boolean = false): void {
        const inputType = isPassword ? 'password' : 'text';
        const inputAttributes = {
            id: name,
            name,
            type: inputType,
            placeholder,
        };
        const input = new Tag('input', inputAttributes);
        this.form.addChild(input.render());
    }

    private addSubmitButton(text: string): void {
        const button = new Tag('button', { type: 'submit' });
        button.addText(text);
        this.form.addChild(button.render());
    }

    render(): HTMLElement {
        return this.form.render();
    }
}
