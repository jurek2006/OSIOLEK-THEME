class SlickCarousel{
    constructor(){
        
        $(document).ready(function(){
            $('.slickCarousel--movies').slick({
              infinite: true,
              slidesToShow: 1,
              slidesToScroll: 1,
              autoplay: true,
              dots: true,
              variableWidth: true,
            });
        });
    }
}

export default SlickCarousel;