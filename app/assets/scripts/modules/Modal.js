// klasa Modal przypisuje do wszystkich elementów (btn lub a ale właściwie mogą być też innych typów) o klasie btn--openModal wyświetlania modala/overlay
// każdy taki element musi mieć atrybut data-open-modal w którym wskazany jest selektor modala, który ma wyświetlać

// np. przy atrybucie data-open-modal="#priceList-more" ma wyświetlić się element o id priceList-more

// ---------------------- Przykłady użycia modal --------------------------------------
// 1) <button class="fGallery__el btn btn--openModal" data-open-modal="#taniaSroda-more"> ... </button>
//      Działający link/button do modala (ma klasę btn--openModal) a jako parametr wskazuje element o selektorze #taniaSroda-more (który istnieje w dokumencie)

// 2) <li class="primary-nav__element"><a class="btn--openModal" href="#">Repertuar</a></li> 
//      Niedziałający link/button do modala (chociaż ma klasę btn--openModal) - nie ma jednak parametru data-open-modal
//      Spowoduje komunikat w konsoli: "Modal.js - Nie można przypisać eventListenera click dla "Repertuar" ponieważ nie istnieje dla niego odpowiedni modal"

// 3) <li class="primary-nav__element"><a class="btn--openModal" data-open-modal="#nieMAtakiej" href="#">Filmy</a></li> 
//      Niedziałający link/button do modala (chociaż ma klasę btn--openModal) - jednak nie istnieje (w dokumencie) wskazany data-open-modal #nieMAtakiej
//      Spowoduje komunikat w konsoli: "Modal.js - Nie można przypisać eventListenera click dla "Repertuar" ponieważ nie istnieje dla niego odpowiedni modal"

// ---------------------- Struktura modala (tutaj #priceList-more) --------------------------------------

// <div class="modal" id="priceList-more">
//   <section class="modal__content">
//     <header class="modal__header group">
//          <button class="modal__closeBtn btn btn--dark btn--transparent">&times;</button>
//          <h1 class="modal__heading">Cennik - szczegóły</h1>
//     </header>
//     <div class="modal__body">
//          ...
//     </div>
//   </section>
// </div>

class Modal{
    constructor(){
        // dla wszystkich elementów (w uproszczeniu "przycisków") przypisanie na click funkcji otwierającej modal
        this.addEventListenerAll('.btn--openModal', 'click', this.addModalOpenEventListener.bind(this)); 
    }

    // metoda przypisująca buttonowi/linkowi obsługę zdarzenia (domyślnie click) tak aby wyświetlał on modal (element strony)
    // o selektorze podanym w atrybucie data-open-modal danemu przyciskowi
    // działa tylko jeśli dla btn zdefiniowano wartość atrybutu data-open-modal i w DOM istnieje element o selektorze podanym w tym atrybucie przycisku
    addModalOpenEventListener(btn, eventType = 'click'){ 
        const openModalSelector = btn.dataset.openModal; //stała przyjmująca wartość z data-open-modal przycisku/linku (selektor modala do wyświetlenia)
        const modalObj = document.body.querySelector(openModalSelector); //modal, który ma być wyświetlony [może być undefined, jeśli takiego nie ma]

        if(modalObj !== undefined && modalObj !== null){
        // jeśli w DOM istnieje element wskazujący na modal to przypisywany jest handler, który będzie po wystąpieniu zdarzenia (kliknięciu) dodawał klasę odpowiedzialną za widoczność modala
            btn.addEventListener(eventType, () => {
                document.body.classList.add('noScroll'); //dodanie do body dokumentu klasy zapobiegającej jego scrollowaniu, gdy jest otwarty modal
                return modalObj.classList.add('modal--is-visible')
            });

            // przypisanie przyciskowi zamknięcia danego oraz "tłu" modala (modalObj) event handlera zamykającego modal 
            // przycisk zawsze ma klasę .modal__closeBtn
            const currModalCloseBtn = modalObj.querySelector('.modal__closeBtn');
            currModalCloseBtn.addEventListener('click', this.hideModal.bind(modalObj));

            // przypadek kliknięcia "tła" modala
            this.addOutsideModalEventListener(modalObj);

            // przypadek kliknięcia w klawisz ESC
            this.addEscModalEventListener(modalObj);

        } else {
            console.log(`Modal.js - Nie można przypisać eventListenera ${eventType} dla "${btn.innerText}" ponieważ nie istnieje dla niego odpowiedni modal`);
        }
    }

    // metoda iterująca po tablicy/NodeList (btnNL) elementów i przypisująca im funkcje obsługi zdarzenia (callback)
    addEventListenerAll(buttonsSelector, eventType = 'click', callbackFunc){
        const buttonsSelectedArr = [...document.querySelectorAll(buttonsSelector)]; //tablica obiektów w DOM (button/a) wybranych za pomocą selektora
        buttonsSelectedArr.forEach(btn => callbackFunc(btn, eventType)); //dla każdego elementu w tablicy dodanie jako obsugi zdarzenia eventType (np. click) funkcji callbackFunc
    }

    // metoda ukrywająca modal (przez odebranie mu klasy .modal--is-visible)
    // modal przekazywany jest w this
    hideModal(){
        // sprawdzenie czy przekazano cokolwiek jako this i czy przekazany element ma klasę modal--is-visible
        // bo ukrycie modala polega na jej odebraniu

        if(this !== undefined && this !== null && this.classList.contains('modal--is-visible')){
            document.body.classList.remove('noScroll'); //odebranie z body dokumentu klasy zapobiegającej jego scrollowaniu, gdy jest otwarty modal
            this.classList.remove('modal--is-visible');
        }
    }

    // metoda obsługi przypadku kliknięcia w "tło" wyświetlonego modala (przekazany - obiekt jako modalObj)
    // przypisuje event listener w którego obsłudze jest sprawdzane, czy jest to "tło" modala
    // jeśli tak to modal jest ukrywany
    addOutsideModalEventListener(modalObj){

            // dodanie obsługi kliknięcia w obiekt window, które sprawdza, czy kliknięto w modalObj (czy e.target zawiera obiekt modalObj)
            // (i tylko w niego, nie żadne jego elementy - w ten sposób przechwytujemy kliknięcie tylko i wyłącznie w "tło")
            window.addEventListener('click', (e) => {
                if(e.target === modalObj){
                    // użycie metody hideModal ukrywającej modal z przekazaniem jako this modalObj (aktualnego obiektu modala)
                    this.hideModal.bind(modalObj)();
                }
            });
    }

    // metoda obsługi przypadku przyciśnięcia przycisku Esc, kiedy modal jest otwarty 
    // przypisuje eventListener w którego obsłudze jest sprawdzane, czy kliknięto właśnie Esc
    // jeśli tak, to modal jest ukrywany
    addEscModalEventListener(modalObj){

        // dodanie obsługi przyciśnięcia (keyup) klawisza, które sprawdza, czy jest to Esc (czy e.keyCode === 27)
        document.addEventListener('keyup', (e) => {
            if(e.keyCode === 27){
                // użycie metody hideModal ukrywającej modal z przekazaniem jako this modalObj (aktualnego obiektu modala)
                this.hideModal.bind(modalObj)();
            }
        });
    }

}

export default Modal;