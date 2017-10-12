import $ from 'jquery';
import MovieSchedule from './modules/MovieSchedule';
import ModulTestowy from './modules/ModulTestowy';
import GenerateSchedule from './modules/GenerateSchedule';
import SlickCarousel from './modules/SlickCarousel';
import MobileMenu from './modules/MobileMenu';

const movieSchedule = new MovieSchedule();

// SLICK CAROUSEL
const slickCarousel = new SlickCarousel();

// DEVELOP
const generateSchedule = new GenerateSchedule();

// FUNKCJONALNOŚĆ DLA MENU MOBILNEGO 
const mobileMenu = new MobileMenu();

// TEST
const modulTestowy = new ModulTestowy();
