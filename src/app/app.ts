import AuthPage from '../pages/authPage';
import AboutPage from '../pages/aboutPage';
import MainPage from '../pages/mainPage';
import { PageIds } from '../core/types/enums';

export default class App {
    private static body: HTMLElement = document.body;
    private static url: string | null = PageIds.Default;

    private static auth = new AuthPage();

    static renderNewPage(idPage: string): void {
        if (!App.isPageAccessible(idPage)) {
            window.location.hash = PageIds.Auth;
            return;
        }
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

    static isAuthentificated(): boolean {
        return sessionStorage.getItem('isAuthentificated') === 'true';
    }

    static isPageAccessible(idPage: string): boolean {
        if (idPage === PageIds.Main && !App.isAuthentificated()) {
            return false;
        }
        return true;
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
        const initialPage = window.location.hash.slice(1) || PageIds.Auth;
        if (App.isPageAccessible(initialPage)) {
            App.renderNewPage(initialPage);
        } else {
            window.location.hash = PageIds.Auth;
        }
    }
}
