import AuthPage from '../pages/authPage';
import { PageIds } from '../core/types/enums';

export default class App {
    private static body: HTMLElement = document.body;
    private static url: string | null = PageIds.Default;

    private static auth = new AuthPage();

    static renderNewPage(idPage: string): void {
        if (App.url) App.url = null;

        if (idPage === PageIds.Auth) {
            const page = new AuthPage();
            App.url = idPage;
            const content = page.render();
            App.body.innerHTML = '';
            App.body.appendChild(content);
        }
    }

    static enableRouteChange(): void {
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            App.renderNewPage(hash);
        });
    }

    static generatePage(): void {
        const pageWrapper = document.createElement('div');
        pageWrapper.classList.add('page-wrapper');
        pageWrapper.append(App.auth.render());
        App.body.append(pageWrapper);
    }

    static runApp(): void {
        App.generatePage();
        App.enableRouteChange();
        window.location.hash = PageIds.Auth;
        App.renderNewPage(PageIds.Auth);
    }
}
