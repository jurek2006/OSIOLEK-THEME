class OwlCarousel{
    constructor(){
        
        $(document).ready(function(){
            var owl = $('.owl-carousel');
            owl.owlCarousel({
                items:4,
                loop:true,
                center: true,
                margin:1,
                nav:false,
                dotsEach: false,
                smartSpeed: 500,
                autoWidth: true,
                autoplay:true,
                autoplayTimeout:2000,
                autoplayHoverPause:false
            });
        });
    }
}

export default OwlCarousel;