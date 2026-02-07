
  (function ($) {
  
  "use strict";

    // MENU
    $('.navbar-collapse a').on('click',function(){
      $(".navbar-collapse").collapse('hide');
    });
    
    // CUSTOM LINK
    $('.smoothscroll').click(function(){
      var el = $(this).attr('href');
      var elWrapped = $(el);
      var header_height = $('.navbar').height();
  
      scrollToDiv(elWrapped,header_height);
      return false;
  
      function scrollToDiv(element,navheight){
        var offset = element.offset();
        var offsetTop = offset.top;
        var totalScroll = offsetTop-navheight;
  
        $('body,html').animate({
        scrollTop: totalScroll
        }, 300);
      }
    });

    // HERO AUTO SCROLL
    var heroScrollTimers = [];

    function clearHeroScrollTimers() {
      for (var i = 0; i < heroScrollTimers.length; i++) {
        clearTimeout(heroScrollTimers[i]);
      }
      heroScrollTimers = [];
    }

    function scrollToSection(selector) {
      var target = $(selector);
      if (!target.length) {
        return;
      }
      var headerHeight = $('.navbar').height();
      var offsetTop = target.offset().top;
      var totalScroll = offsetTop - headerHeight;

      $('body,html').animate({
        scrollTop: totalScroll 
      }, 500);
    }

    $('.hero-auto-scroll').on('click', function(e){
      e.preventDefault();
      clearHeroScrollTimers();

      scrollToSection('#hero_section_2');

      heroScrollTimers.push(setTimeout(function(){
        scrollToSection('#hero_section_3');
      }, 1500));

      heroScrollTimers.push(setTimeout(function(){
        scrollToSection('#hero_section_4');
      }, 3000));
       heroScrollTimers.push(setTimeout(function(){
        scrollToSection('#section_2');
      }, 5000));
    });

    // ABOUT REVEAL ANIMATION
    var revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
      if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function(entries, observer){
          entries.forEach(function(entry){
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.2,
          rootMargin: '0px 0px -10% 0px'
        });

        revealEls.forEach(function(el){
          revealObserver.observe(el);
        });
      } else {
        revealEls.forEach(function(el){
          el.classList.add('is-visible');
        });
      }
    }
  
  })(window.jQuery);
