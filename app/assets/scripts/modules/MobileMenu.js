class MobileMenu{
    constructor(){
        // przycisk otwierający menu
        this.showMenuBtn = document.querySelector('.site-header__showMenuBtn');
        // zawartość menu
        this.nav = document.querySelector('.primary-nav');
        this.events();
    }

    events(){
        this.showMenuBtn.addEventListener('click', this.toggleMenu.bind(this));
    }

    toggleMenu(){
        this.nav.classList.toggle('primary-nav--is-visible');
    }
}

export default MobileMenu;