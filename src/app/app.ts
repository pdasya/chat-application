import AuthPage from '../pages/authPage';

export default class App {
    private static body: HTMLElement = document.body;

    private static auth = new AuthPage();

    static generatePage(): void {
        const pageWrapper = document.createElement('div');
        pageWrapper.classList.add('page-wrapper');
        pageWrapper.append(App.auth.render());
        App.body.append(pageWrapper);
    }

    static runApp(): void {
        App.generatePage();
    }
}
