import Tag from '../core/templates/component';
import { PageIds } from '../core/types/enums';

export default class AuthPage {
    private form: Tag;

    constructor() {
        this.form = new Tag('form', { class: 'login-form' });
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
        inputContainer.addChild(input.render());
        this.form.addChild(inputContainer.render());
    }

    private addSubmitButton(text: string): void {
        const button = new Tag('button', { type: 'submit', class: 'login-form-submit', disabled: 'true' });
        button.addText(text);
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

    render(): HTMLElement {
        return this.form.render();
    }
}
