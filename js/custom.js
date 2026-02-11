
  (function ($) {
  
  "use strict";

    // HERO LOAD ANIMATION
    var heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      window.addEventListener('load', function() {
        heroSection.classList.add('is-hero-ready');
      }, { once: true });
    }

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

    // EXPERIENCE CAROUSEL
    var experienceCarousel = document.querySelector('.experience-carousel');
    if (experienceCarousel) {
      var experienceCards = Array.prototype.slice.call(
        experienceCarousel.querySelectorAll('.experience-card')
      );
      var experienceDots = Array.prototype.slice.call(
        document.querySelectorAll('.experience-dots span')
      );

      var carouselTimer = null;
      var carouselIntervalMs = 3200;
      var carouselIndex = 0;

      function scrollCardIntoView(card) {
        if (!card) {
          return;
        }
        var targetLeft = card.offsetLeft - (experienceCarousel.clientWidth - card.clientWidth) / 2;
        experienceCarousel.scrollTo({
          left: targetLeft,
          behavior: 'smooth'
        });
      }

      function setActiveCard(nextIndex, shouldScroll) {
        if (!experienceCards.length) {
          return;
        }

        carouselIndex = (nextIndex + experienceCards.length) % experienceCards.length;

        experienceCards.forEach(function(card, idx) {
          card.classList.toggle('is-active', idx === carouselIndex);
        });

        if (experienceDots.length) {
          experienceDots.forEach(function(dot, idx) {
            dot.classList.toggle('is-active', idx === carouselIndex);
          });
        }

        if (shouldScroll !== false) {
          scrollCardIntoView(experienceCards[carouselIndex]);
        }
      }

      function rotateCarousel() {
        setActiveCard(carouselIndex + 1);
      }

      function startCarousel() {
        if (carouselTimer) {
          return;
        }
        carouselTimer = setInterval(rotateCarousel, carouselIntervalMs);
      }

      function stopCarousel() {
        if (!carouselTimer) {
          return;
        }
        clearInterval(carouselTimer);
        carouselTimer = null;
      }

      setActiveCard(0, false);
      startCarousel();

      experienceCarousel.addEventListener('mouseenter', stopCarousel);
      experienceCarousel.addEventListener('mouseleave', startCarousel);

      experienceCarousel.addEventListener('scroll', function() {
        if (!experienceCards.length) {
          return;
        }
        var carouselRect = experienceCarousel.getBoundingClientRect();
        var carouselCenter = carouselRect.left + carouselRect.width / 2;
        var closestIndex = 0;
        var closestDistance = Infinity;

        experienceCards.forEach(function(card, idx) {
          var cardRect = card.getBoundingClientRect();
          var cardCenter = cardRect.left + cardRect.width / 2;
          var distance = Math.abs(cardCenter - carouselCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = idx;
          }
        });

        if (closestIndex !== carouselIndex) {
          setActiveCard(closestIndex, false);
        }
      });
    }

    // ARTISTS FLY-IN ON SCROLL (RETRIGGER)
    var artistThumbs = Array.prototype.slice.call(
      document.querySelectorAll('.artists-thumb')
    );
    var artistsSection = document.querySelector('.artists-section');

    if (artistThumbs.length) {
      var flyDirections = ['fly-left', 'fly-right', 'fly-up', 'fly-down'];
      artistThumbs.forEach(function(card, idx) {
        card.classList.add('artist-fly');
        card.classList.add(flyDirections[idx % flyDirections.length]);
        card.style.transitionDelay = (idx % 4) * 120 + 'ms';
      });

      if ('IntersectionObserver' in window) {
        var artistObserver = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
            } else {
              entry.target.classList.remove('in-view');
            }
          });
        }, {
          threshold: 0.2
        });

        artistThumbs.forEach(function(card) {
          artistObserver.observe(card);
        });
      } else {
        artistThumbs.forEach(function(card) {
          card.classList.add('in-view');
        });
      }

      if (artistsSection && 'IntersectionObserver' in window) {
        var mobileActive = null;
        var mobileRatios = new Map();
        var mobileObserver = null;

        var enableMobileArtistScroll = function() {
          if (window.innerWidth >= 992) {
            if (artistsSection) {
              artistsSection.classList.remove('is-mobile-scroll');
            }
            artistThumbs.forEach(function(card) {
              card.classList.remove('mobile-active');
            });
            if (mobileObserver) {
              mobileObserver.disconnect();
              mobileObserver = null;
            }
            return;
          }

          artistsSection.classList.add('is-mobile-scroll');

          if (!mobileObserver) {
            mobileObserver = new IntersectionObserver(function(entries) {
              entries.forEach(function(entry) {
                mobileRatios.set(entry.target, entry.intersectionRatio);
              });

              var best = null;
              var bestRatio = 0;
              mobileRatios.forEach(function(ratio, el) {
                if (ratio > bestRatio) {
                  bestRatio = ratio;
                  best = el;
                }
              });

              if (best && best !== mobileActive) {
                if (mobileActive) {
                  mobileActive.classList.remove('mobile-active');
                }
                best.classList.add('mobile-active');
                mobileActive = best;
              }
            }, {
              threshold: [0, 0.25, 0.5, 0.75, 1]
            });

            artistThumbs.forEach(function(card) {
              mobileRatios.set(card, 0);
              mobileObserver.observe(card);
            });
          }
        };

        enableMobileArtistScroll();
        window.addEventListener('resize', enableMobileArtistScroll);
      }
    }

    // SECTION REVEAL ANIMATION
    var sectionEls = document.querySelectorAll('section');
    if (sectionEls.length) {
      sectionEls.forEach(function(section, index) {
        section.classList.add('section-animate');
        if (index % 3 === 0) {
          section.classList.add('is-fast');
        } else if (index % 3 === 2) {
          section.classList.add('is-slow');
        }
      });

      if ('IntersectionObserver' in window) {
        var sectionObserver = new IntersectionObserver(function(entries, observer){
          entries.forEach(function(entry){
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.15,
          rootMargin: '0px 0px -10% 0px'
        });

        sectionEls.forEach(function(section){
          sectionObserver.observe(section);
        });
      } else {
        sectionEls.forEach(function(section){
          section.classList.add('is-visible');
        });
      }
    }

    // SCHEDULE PUZZLE ANIMATION
    var scheduleTable = document.querySelector('.schedule-table');
    if (scheduleTable) {
      var schedulePieces = Array.prototype.slice.call(
        scheduleTable.querySelectorAll('th, td')
      );

      schedulePieces.forEach(function(cell, index) {
        cell.classList.add('puzzle-piece');
        var direction = index % 4;
        var offset = 48;
        var x = 0;
        var y = 0;

        if (direction === 0) {
          x = -offset;
        } else if (direction === 1) {
          x = offset;
        } else if (direction === 2) {
          y = -offset;
        } else {
          y = offset;
        }

        cell.style.setProperty('--puzzle-x', x + 'px');
        cell.style.setProperty('--puzzle-y', y + 'px');
        cell.style.setProperty('--puzzle-delay', (index * 40) + 'ms');
      });

      if ('IntersectionObserver' in window) {
        var scheduleObserver = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              scheduleTable.classList.add('puzzle-ready');
            } else {
              scheduleTable.classList.remove('puzzle-ready');
            }
          });
        }, {
          threshold: 0.25
        });

        scheduleObserver.observe(scheduleTable);
      } else {
        scheduleTable.classList.add('puzzle-ready');
      }
    }

    // PRICING BORDER "SNAKE" ANIMATION
    var pricingSection = document.querySelector('.pricing-section');
    var pricingThumbs = Array.prototype.slice.call(
      document.querySelectorAll('.pricing-thumb')
    );

    if (pricingSection && pricingThumbs.length) {
      var pricingObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            pricingThumbs.forEach(function(card) {
              card.classList.add('is-border-animate');
            });
          } else {
            pricingThumbs.forEach(function(card) {
              card.classList.remove('is-border-animate');
            });
          }
        });
      }, {
        threshold: 0.25
      });

      pricingObserver.observe(pricingSection);
    }

    // MERCH SECTION REVEAL
    var merchSection = document.querySelector('.merch-section');
    if (merchSection) {
      var merchCards = Array.prototype.slice.call(
        merchSection.querySelectorAll('.merch-card')
      );

      merchCards.forEach(function(card, index) {
        card.style.setProperty('--merch-delay', (index * 120) + 'ms');
      });

      if ('IntersectionObserver' in window) {
        var merchObserver = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              merchSection.classList.add('is-merch-visible');
            } else {
              merchSection.classList.remove('is-merch-visible');
            }
          });
        }, {
          threshold: 0.3
        });

        merchObserver.observe(merchSection);
      } else {
        merchSection.classList.add('is-merch-visible');
      }
    }

    // MAP LIGHTBOX
    var mapLightbox = document.getElementById('mapLightbox');
    var mapLightboxImage = mapLightbox ? mapLightbox.querySelector('.map-lightbox-image') : null;
    var mapLightboxClose = mapLightbox ? mapLightbox.querySelector('.map-lightbox-close') : null;
    var mapImages = document.querySelectorAll('.venue-map-image');

    function openMapLightbox(src, altText) {
      if (!mapLightbox || !mapLightboxImage) {
        return;
      }
      mapLightboxImage.src = src;
      mapLightboxImage.alt = altText || 'Venue map';
      mapLightbox.classList.add('is-visible');
      document.body.classList.add('map-lightbox-open');
      mapLightbox.setAttribute('aria-hidden', 'false');
    }

    function closeMapLightbox() {
      if (!mapLightbox || !mapLightboxImage) {
        return;
      }
      mapLightbox.classList.remove('is-visible');
      document.body.classList.remove('map-lightbox-open');
      mapLightbox.setAttribute('aria-hidden', 'true');
      mapLightboxImage.src = '';
      mapLightboxImage.alt = '';
    }

    if (mapImages.length && mapLightbox) {
      mapImages.forEach(function(image) {
        image.addEventListener('click', function() {
          openMapLightbox(image.currentSrc || image.src, image.alt);
        });
      });

      mapLightbox.addEventListener('click', function(event) {
        if (event.target === mapLightbox) {
          closeMapLightbox();
        }
      });

      if (mapLightboxClose) {
        mapLightboxClose.addEventListener('click', function() {
          closeMapLightbox();
        });
      }

      document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && mapLightbox.classList.contains('is-visible')) {
          closeMapLightbox();
        }
      });
    }

    // HERO PARALLAX
    heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      var heroMedia = heroSection.querySelector('.custom-video');
      var heroContent = heroSection.querySelector('.container');
      var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!reduceMotion) {
        var heroTicking = false;

        var updateHeroParallax = function() {
          heroTicking = false;
          var rect = heroSection.getBoundingClientRect();
          var heroTop = rect.top + window.scrollY;
          var heroHeight = rect.height || heroSection.offsetHeight || window.innerHeight;
          var progress = (window.scrollY - heroTop) / heroHeight;
          var clamped = Math.max(0, Math.min(1, progress));
          var bgMaxShift = 0;
          var textMaxShift = window.innerWidth < 992 ? 140 : 340;
          var bgShift = clamped * bgMaxShift;
          var textShift = clamped * textMaxShift * -1;

          heroSection.style.setProperty('--hero-parallax', bgShift + 'px');
          heroSection.style.setProperty('--hero-text-parallax', textShift + 'px');

          if (heroMedia) {
            heroMedia.style.transform = 'translate3d(0,0,0) scale(1.08)';
          }

          if (heroContent) {
            heroContent.style.transform =
              'translate3d(0,' + textShift + 'px,0)';
          }
        };

        var onHeroScroll = function() {
          if (heroTicking) {
            return;
          }
          heroTicking = true;
          window.requestAnimationFrame(updateHeroParallax);
        };

        updateHeroParallax();
        window.addEventListener('scroll', onHeroScroll, { passive: true });
        window.addEventListener('resize', updateHeroParallax);
      }
    }

    // ABOUT PARALLAX
    var aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
      var reduceAboutMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduceAboutMotion) {
        var aboutTicking = false;

        var updateAboutParallax = function() {
          aboutTicking = false;
          var rect = aboutSection.getBoundingClientRect();
          var viewportH = window.innerHeight || document.documentElement.clientHeight;
          var progress = (viewportH - rect.top) / (viewportH + rect.height);
          var clamped = Math.max(0, Math.min(1, progress));
          var shift = 50 + (clamped - 0.5) * 18;
          aboutSection.style.setProperty('--about-parallax', shift + '%');
        };

        var onAboutScroll = function() {
          if (aboutTicking) {
            return;
          }
          aboutTicking = true;
          window.requestAnimationFrame(updateAboutParallax);
        };

        updateAboutParallax();
        window.addEventListener('scroll', onAboutScroll, { passive: true });
        window.addEventListener('resize', updateAboutParallax);
      }
    }

    // HERO VIDEO AUTOPLAY (MOBILE SAFETY NET)
    var heroVideo = document.querySelector('.custom-video');
    if (heroVideo) {
      heroVideo.muted = true;
      heroVideo.playsInline = true;
      heroVideo.setAttribute('playsinline', '');
      heroVideo.setAttribute('webkit-playsinline', '');

      var tryPlay = function() {
        var playPromise = heroVideo.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function() {});
        }
      };

      if (document.readyState === 'complete') {
        tryPlay();
      } else {
        window.addEventListener('load', tryPlay, { once: true });
      }

      var kickstart = function() {
        tryPlay();
        window.removeEventListener('touchstart', kickstart);
        window.removeEventListener('click', kickstart);
      };
      window.addEventListener('touchstart', kickstart, { once: true, passive: true });
      window.addEventListener('click', kickstart, { once: true });
    }

    // MOBILE NAV: HIDE ON LOAD, SHOW AFTER SCROLL
    var mobileBreakpoint = 992;
    var navRevealScroll = 8;
    var navHiddenClass = 'nav-hidden';
    var ticketRevealScroll = 120;
    var navEl = document.querySelector('.navbar');

    function isMobileViewport() {
      return window.innerWidth < mobileBreakpoint;
    }

    function updateNavVisibility() {
      if (!isMobileViewport()) {
        document.body.classList.remove(navHiddenClass);
        if (navEl) {
          navEl.classList.toggle('is-ticket-visible', window.scrollY > ticketRevealScroll);
        }
        return;
      }

      if (window.scrollY > navRevealScroll) {
        document.body.classList.remove(navHiddenClass);
      } else {
        document.body.classList.add(navHiddenClass);
      }

      if (navEl) {
        navEl.classList.toggle('is-ticket-visible', window.scrollY > ticketRevealScroll);
      }
    }

    updateNavVisibility();
    window.addEventListener('scroll', updateNavVisibility, { passive: true });
    window.addEventListener('resize', updateNavVisibility);
  
  })(window.jQuery);
