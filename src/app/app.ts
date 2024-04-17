import AuthPage from '../pages/authPage';
import AboutPage from '../pages/aboutPage';
import MainPage from '../pages/mainPage';
import { PageIds } from '../core/types/enums';

export default class App {
    private static body: HTMLElement = document.body;
    private static url: string | null = PageIds.Default;

    private static auth = new AuthPage();
    private static main = new MainPage();

    static renderNewPage(idPage: string): void {
        if (App.url) App.url = null;
        let content;

        switch (idPage) {
            case PageIds.Auth: {
                const authPage = new AuthPage();
                content = authPage.render();
                break;
            }
            case PageIds.Main: {
                const mainPage = new MainPage();
                content = mainPage.render();
                break;
            }
            case PageIds.About: {
                const aboutPage = new AboutPage();
                content = aboutPage.render();
                break;
            }
            default:
                return;
        }

        App.url = idPage;
        App.body.innerHTML = '';
        App.body.appendChild(content);
    }

    static handleLoginSuccess(): void {
        window.location.hash = PageIds.Main;
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
        if (!window.location.hash) {
            window.location.hash = PageIds.Auth;
        } else {
            App.renderNewPage(window.location.hash.slice(1));
        }
    }
}
