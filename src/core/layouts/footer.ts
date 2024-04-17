import Tag from '../templates/component';

export default class Footer {
    private footer: Tag;

    constructor() {
        this.footer = new Tag('div', { class: 'footer-app' });
        this.addLogo('RSSchool');
        this.addLink('pdasya');
        this.addYear('2024');
    }

    addLogo(text: string): void {
        const logoWrapper = new Tag('div', { class: 'footer-app-logo-wrapper' });
        const logo = new Tag('img', {
            class: 'footer-app-logo-img',
            src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWwZGdxtPxnbocfpsAWDEFZ6P4TrCqjZi3CfHDsX4AfQ&s',
            alt: 'rs-school-logo',
        });
        const logoDescr = new Tag('p', { class: 'footer-app-logo-descr' });
        logoDescr.addText(text);
        logoWrapper.addChild(logo.render());
        logoWrapper.addChild(logoDescr.render());
        this.footer.addChild(logoWrapper.render());
    }

    addLink(text: string): void {
        const link = new Tag('a', { class: 'footer-app-link', href: 'https://github.com/pdasya', target: '_blank' });
        link.addText(text);
        this.footer.addChild(link.render());
    }

    addYear(text: string): void {
        const year = new Tag('p', { class: 'footer-app-year' });
        year.addText(text);
        this.footer.addChild(year.render());
    }

    render(): HTMLElement {
        return this.footer.render();
    }
}
