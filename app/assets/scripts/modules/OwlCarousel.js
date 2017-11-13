class OwlCarousel{
    constructor(){
        
        $(document).ready(function(){
            var owl = $('.owl-carousel');
            owl.owlCarousel({
                items:4,
                loop:true,
                center: true,
                margin:10,
                nav:true,
                dotsEach: true,
                autoWidth: true,
                autoplay:true,
                autoplayTimeout:2000,
                autoplayHoverPause:true
            });
        });
    }
}

export default OwlCarousel;