function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

const remToPixels = (rem) => rem * 16;

/* cookie banner */
let cookieBanner = document.querySelector(".cookie-banner"),
  cookieButton = document.querySelector(".cookie-banner__button");

document.addEventListener("DOMContentLoaded", function () {
  if (cookieBanner) {
    if (Cookies.get("cookieBannerDismissed")) {
      cookieBanner.parentNode.removeChild(cookieBanner);
    } else {
      cookieBanner.style.pointerEvents = "all";
      cookieBanner.style.opacity = "1";
    }

    cookieButton.addEventListener("click", function () {
      cookieBanner.style.opacity = "0";

      setTimeout(() => {
        cookieBanner.parentNode.removeChild(cookieBanner);
        Cookies.set("cookieBannerDismissed", true);
      }, "300");
    });
  }
});

/* hide cursor when exiting the window */
$(window).on("mouseenter", function () {
  $(".cursor-wrapper").css("opacity", "1");
});

$(window).on("mouseout", function () {
  $(".cursor-wrapper").css("opacity", "0");
});

/* reload automatically, script that needs to be updated on resize */
let resizeTimeout;

function debounce(func, delay) {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(func, delay);
}
//the indiviual resize is being checked on afterEnter of each page, so i don't call the script in the wrong page

/* register the gsap plugins */
gsap.registerPlugin(Draggable,InertiaPlugin,ScrollTrigger,SplitText,CustomEase)


CustomEase.create("asset-index", "0,0,0,1");
CustomEase.create("blinking-line", ".25, 0, .15, 1");
CustomEase.create("splitLines", ".4, 0, 0, 1");

const cleanGSAP = () => {
  ScrollTrigger.getAll().forEach((t) => t.kill(false));
  ScrollTrigger.refresh();
};

/* barba configs */
barba.hooks.beforeEnter(function () {
  //only things that are common to all pages
  cleanGSAP();
  customCursors();
  currentYear();
});

barba.hooks.beforeLeave(function (data) {
  // Clean up Objects page listeners when leaving
  if (data.current.namespace === "objects") {
    cleanupObjectsListeners();
  }
});

barba.hooks.leave(function (data) {
  // Also clean up during the leave transition
  if (data.current.namespace === "objects") {
    cleanupObjectsListeners();
  }
});

barba.hooks.enter(function (data) {
  let burgerText = data.next.namespace;

  if (data.next.namespace === "objects-single") {
    burgerText = "objects";
  } else if (data.next.namespace === "artworks-single") {
    burgerText = "art";
  } else if (data.next.namespace === "home") {
    burgerText = "work";
  } else if (data.next.namespace === "projects") {
    burgerText = "work";
  }

  document.querySelector(".navbar__burger-btn").textContent = burgerText;
});

barba.hooks.after(function (data) {
  resetWebflow(data);

  if (!isTouchDevice()) {
    hoverTyping();
  }
});

let scrollY = 0; //set initial scroll position for page change

/* search animation related */
const searchLottie = document.getElementById("search-icon"),
  searchOpen = document.querySelector(".navbar__search"),
  searchClose = document.querySelector(".search-leave-animation");

if (searchLottie) {
  searchOpen.addEventListener("click", function () {
    searchLottie.setDirection(1);
    searchLottie.play();
  });
}

mobileBurger();

barba.init({
  prefetchIgnore: true,
  preventRunning: true,
  cacheIgnore: true,
  views: [
    {
      namespace: "home",
      beforeEnter() {
        homepageHeroLines();
        homepageHeroDesktop();
        homepageHeroMobile();
        projectsIndex();
      },
      afterEnter() {
        //flag resize
        function homepageResize() {
          homepageHeroLines();
          homepageHeroDesktop();
          homepageHeroMobile();
          projectsIndex();
        }
        window.addEventListener("resize", function () {
          debounce(homepageResize, 1000); // 1 second delay after resize
        });
      },
    },
    {
      namespace: "projects",
      beforeEnter() {
        iframePoster();
        stickyReturn();
        projectsSwiper();
        scrollDownAnimation();
        videoComponent();
      },
      afterEnter() {
        document.querySelector(".project-hero").style.opacity = "1";
        projectsNavigation();
        projectScrollAnimations();

        //flag resize
        function projectResize() {
          scrollDownAnimation();
          stickyReturn();
        }
        window.addEventListener("resize", function () {
          debounce(projectResize, 1000); // 1 second delay after resize
        });
      },
    },
    {
      namespace: "objects",
      beforeEnter() {
        objectsHeroDesktop();
        objectsHeroLines();
        objectsIndex();
        enquireHover();
        objectsEnquire();
        iframePoster();
      },
      afterEnter() {
        objectsEnquire();

        //flag resize
        function objectsResize() {
          objectsHeroLines();
          objectsHeroDesktop();
          objectsIndex();
          enquireHover();
          objectsEnquire();
        }
        window.addEventListener("resize", function () {
          debounce(objectsResize, 1000); // 1 second delay after resize
        });
      },
    },
    {
      namespace: "objects-single",
      beforeEnter() {
        iframePoster();
        objectsDownload();
        videoComponent();
        enquireHover();
        objectsEnquire();
      },
      afterEnter() {
        objectsSwiper();
        objectsEnquire();

        //flag resize
        function objectSingleResize() {
          objectsSwiper();
          enquireHover();
          objectsEnquire();
        }
        window.addEventListener("resize", function () {
          debounce(objectSingleResize, 1000); // 1 second delay after resize
        });
      },
    },
    {
      namespace: "artworks",
      beforeEnter() {
        iframePoster();
        artworksSetInitialState();
      },
      afterEnter() {
        artworksFitText();
        firstArtworkFadeIn();
        artworksFadeIn();
        artworksMarquee();

        //flag resize
        function artworksResize() {
          artworksFitText();
          artworksSetInitialState();
          firstArtworkFadeIn();
          artworksFadeIn();
          artworksMarquee();
        }
        window.addEventListener("resize", function () {
          debounce(artworksResize, 1000); // 1 second delay after resize
        });
      },
    },
    {
      namespace: "artworks-single",
      beforeEnter() {
        iframePoster();
        projectsSwiper();
        videoComponent();
      },
      afterEnter() {
        artworksFitText();
        projectScrollAnimations();

        //flag resize
        function artworkSingleResize() {
          artworksFitText();
        }
        window.addEventListener("resize", function () {
          debounce(artworkSingleResize, 1000); // 1 second delay after resize
        });
      },
    },
    {
      namespace: "about",
      beforeEnter() {
        iframePoster();
        aboutIndexes();
        locationHover();
      },
      afterEnter() {
        aboutVideo();
        aboutSectionsHover(); //only for the 2 cols


        //flag resize
        function aboutResize() {
          aboutIndexes();
        }
        window.addEventListener("resize", function () {
          debounce(aboutResize, 1000); // 1 second delay after resize
        });
      },
    },
    {
      namespace: "search",
      beforeEnter() {
        searchEnter();
        search();
      },
    },
    {
      namespace: "error",
      beforeEnter() {
        errorPage();
      },
    },
    {
      namespace: "privacy",
    },
  ],
  transitions: [
    {
      name: "default-transition",
      leave(data) {
        return gsap.to(data.current.container, {
          opacity: 0,
        });
      },
      enter(data) {
        gsap.defaults({
          ease: "power2.inOut",
          duration: 1,
        });

        data.next.container.classList.add("fixed");

        showScrollbar(); //show scrollbar, hidden on objects carousel

        //reveal page
        return gsap.fromTo(
          data.next.container,
          { opacity: 0 },
          {
            opacity: 1,
            onStart: () => {
              window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
              });
            },
            onComplete: () => {
              data.next.container.classList.remove("fixed");

              setTimeout(() => {
                //show hero on project singles
                if (document.querySelector(".project-hero")) {
                  document.querySelector(".project-hero").style.opacity = "1";
                }
              }, 100);
            },
          }
        );
      },
    },
    {
      name: "project-enter",
      from: {
        namespace: ["home"],
      },
      to: {
        namespace: ["projects"],
      },
      leave(data) {
        scrollY = barba.history.current.scroll.y;

        return gsap.to(data.current.container, {
          opacity: 0,
        });
      },
      enter(data) {
        gsap.defaults({
          ease: "power2.inOut",
          duration: 1,
        });

        data.next.container.classList.add("fixed");

        //reveal page
        return gsap.fromTo(
          data.next.container,
          { opacity: 0 },
          {
            opacity: 1,
            onStart: () => {
              window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
              });
            },
            onComplete: () => {
              data.next.container.classList.remove("fixed");
            },
          }
        );
      },
    },
    {
      name: "project-leave",
      from: {
        namespace: ["projects"],
      },
      to: {
        namespace: ["home"],
      },
      leave(data) {
        return gsap.to(data.current.container, {
          opacity: 0,
          display: "none", //so you can see the new container opacity changing without position fixed
        });
      },
      enter(data) {
        gsap.defaults({
          ease: "power2.inOut",
          duration: 1,
        });

        //reveal page
        return gsap.fromTo(
          data.next.container,
          { opacity: 0 },
          {
            opacity: 1,
            onStart: () => {
              window.scrollTo({
                top: scrollY,
                left: 0,
              });
            },
          }
        );
      },
    },
    {
      name: "objects-enter",
      from: {
        namespace: ["objects"],
      },
      to: {
        namespace: ["objects-single"],
      },
      leave(data) {
        scrollY = barba.history.current.scroll.y;

        return gsap.to(data.current.container, {
          opacity: 0,
        });
      },
      enter(data) {
        gsap.defaults({
          ease: "power2.inOut",
          duration: 1,
        });

        data.next.container.classList.add("fixed");

        hideScrollbar(); //hide scrollbar

        //reveal page
        return gsap.fromTo(
          data.next.container,
          { opacity: 0 },
          {
            opacity: 1,
            onStart: () => {
              window.scrollTo({
                top: 0,
                left: 0,
              });
            },
            onComplete: () => {
              data.next.container.classList.remove("fixed");
            },
          }
        );
      },
    },
    {
      name: "objects-leave",
      from: {
        namespace: ["objects-single"],
      },
      to: {
        namespace: ["objects"],
      },
      leave(data) {
        return gsap.to(data.current.container, {
          opacity: 0,
          display: "none", //so you can see the new container opacity changing without position fixed
        });
      },
      enter(data) {
        gsap.defaults({
          ease: "power2.inOut",
          duration: 1,
        });

        //reveal page
        return gsap.fromTo(
          data.next.container,
          { opacity: 0 },
          {
            opacity: 1,
            onStart: () => {
              window.scrollTo({
                top: scrollY,
                left: 0,
              });
            },
          }
        );
      },
    },
    {
      name: "artworks-enter",
      from: {
        namespace: ["artworks"],
      },
      to: {
        namespace: ["artworks-single"],
      },
      leave(data) {
        scrollY = barba.history.current.scroll.y;

        return gsap.to(data.current.container, {
          opacity: 0,
        });
      },
      enter(data) {
        gsap.defaults({
          ease: "power2.inOut",
          duration: 1,
        });

        data.next.container.classList.add("fixed");

        hideScrollbar(); //hide scrollbar

        //reveal page
        return gsap.fromTo(
          data.next.container,
          { opacity: 0 },
          {
            opacity: 1,
            onStart: () => {
              window.scrollTo({
                top: 0,
                left: 0,
              });
            },
            onComplete: () => {
              data.next.container.classList.remove("fixed");
            },
          }
        );
      },
    },
    {
      name: "artworks-leave",
      from: {
        namespace: ["artworks-single"],
      },
      to: {
        namespace: ["artworks"],
      },
      leave(data) {
        return gsap.to(data.current.container, {
          opacity: 0,
          display: "none", //so you can see the new container opacity changing without position fixed
        });
      },
      enter(data) {
        gsap.defaults({
          ease: "power2.inOut",
          duration: 1,
        });

        //reveal page
        return gsap.fromTo(
          data.next.container,
          { opacity: 0 },
          {
            opacity: 1,
            onStart: () => {
              window.scrollTo({
                top: scrollY,
                left: 0,
              });
            },
          }
        );
      },
    },
    {
      name: "search-enter",
      to: {
        namespace: ["search"],
      },
      leave(data) {
        return gsap.to(data.current.container, {
          opacity: 0,
        });
      },
      enter(data) {
        gsap.defaults({
          ease: "power2.inOut",
          duration: 1,
        });

        data.next.container.classList.add("fixed");

        //reveal page
        return gsap.fromTo(
          data.next.container,
          { opacity: 0 },
          {
            opacity: 1,
            onStart: () => {
              window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
              });
            },
            onComplete: () => {
              data.next.container.classList.remove("fixed");
            },
          }
        );
      },
    },
    {
      name: "search-leave",
      from: {
        namespace: ["search"],
      },
      leave(data) {
        searchLottie.setDirection(-1);
        searchLottie.play();

        return gsap.to(data.current.container, {
          opacity: 0,
          y: -50,
          onComplete: () => {
            document
              .querySelector(".search-input__wrapper")
              .classList.remove("active");
            document
              .querySelector(".navbar__search")
              .removeEventListener("click", searchIconHandler);
          },
        });
      },
      enter(data) {
        gsap.defaults({
          ease: "power2.inOut",
          duration: 1,
        });

        data.next.container.classList.add("fixed");

        //reveal page
        return gsap.fromTo(
          data.next.container,
          { opacity: 0 },
          {
            opacity: 1,
            onStart: () => {
              window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
              });
            },
            onComplete: () => {
              data.next.container.classList.remove("fixed");
            },
          }
        );
      },
    },
  ],
});

/* Smooth scroll */
const lenis = new Lenis();

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

/* For transitions */
function resetWebflow(data) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data.next.html, "text/html");
  const webflowPageId = dom.querySelector("html").getAttribute("data-wf-page");
  document.querySelector("html").setAttribute("data-wf-page", webflowPageId);
  if (window.Webflow) {
    window.Webflow.destroy();
    window.Webflow.ready();
    window.Webflow.require("ix2").init();
  }
  if (window.FsAttributes) {
    window.FsAttributes.destroy();
    window.FsAttributes.copyclip.init();
  }
}

/* Logo interaction */
if (!isTouchDevice()) {
  let text = new SplitText(".navbar__logo", { type: "chars" }),
    letters = text.chars;

  gsap.utils.toArray(letters).forEach(function (letter, index) {
    letter.addEventListener("mouseenter", () => {
      gsap.to(letter, {
        y: -3,
        x: 2,
        duration: 0.2,
        onStart: function () {
          letter.classList.add("active");
        },
      });

      //animate the previous letter if it exists
      if (index > 0) {
        const prevLetter = letters[index - 1];

        gsap.to(prevLetter, {
          y: -2,
          x: 1,
          duration: 0.2,
          onStart: function () {
            prevLetter.classList.add("active");
          },
        });

        //animate the 2nd previous letter if it exists
        if (index > 1) {
          const prevLetter2 = letters[index - 2];
          gsap.to(prevLetter2, {
            y: -1,
            x: 0,
            duration: 0.2,
            onStart: function () {
              prevLetter2.classList.add("active");
            },
          });
        }
      }

      //animate the next letter if it exists
      if (index < letters.length - 1) {
        const nextLetter = letters[index + 1];

        gsap.to(nextLetter, {
          y: -2,
          x: 1,
          duration: 0.2,
          onStart: function () {
            nextLetter.classList.add("active");
          },
        });

        //animate the 2nd next letter if it exists
        if (index < letters.length - 2) {
          const nextLetter2 = letters[index + 2];
          gsap.to(nextLetter2, {
            y: -1,
            x: 0,
            duration: 0.2,
            onStart: function () {
              nextLetter2.classList.add("active");
            },
          });
        }
      }
    });

    letter.addEventListener("mouseleave", () => {
      //reset animation for the current letter
      gsap.to(letter, {
        y: 0,
        x: 0,
        duration: 0.2,
        onStart: function () {
          letter.classList.remove("active");
        },
      });

      //reset animation for the previous letter if it exists
      if (index > 0) {
        const prevLetter = letters[index - 1];

        gsap.to(prevLetter, {
          y: 0,
          x: 0,
          duration: 0.2,
          onStart: function () {
            prevLetter.classList.remove("active");
          },
        });

        //reset animation for the 2nd previous letter if it exists
        if (index > 1) {
          const prevLetter2 = letters[index - 2];
          gsap.to(prevLetter2, {
            y: 0,
            x: 0,
            duration: 0.2,
            onStart: function () {
              prevLetter2.classList.remove("active");
            },
          });
        }
      }

      //reset animation for the next letter if it exists
      if (index < letters.length - 1) {
        const nextLetter = letters[index + 1];

        gsap.to(nextLetter, {
          y: 0,
          x: 0,
          duration: 0.2,
          onStart: function () {
            nextLetter.classList.remove("active");
          },
        });

        //reset animation for the 2nd next letter if it exists
        if (index < letters.length - 2) {
          const nextLetter2 = letters[index + 2];
          gsap.to(nextLetter2, {
            y: 0,
            x: 0,
            duration: 0.2,
            onStart: function () {
              nextLetter2.classList.remove("active");
            },
          });
        }
      }
    });
  });
}

/* Remove blinking spans from touch devices */
if (isTouchDevice()) {
  let blinkingSpans = document.querySelectorAll(".blinking-span"),
    nestedBlinking = document.querySelectorAll(".nested-blinking-span");

  let allBlinks = [...blinkingSpans].concat([...nestedBlinking]);

  allBlinks.forEach(function (el) {
    if (!el.closest(".loading")) {
      el.remove();
    }
  });
}

/* Typing hover interaction */
function hoverTyping() {
  const hoverEls = document.querySelectorAll('[data-hover="type"]');

  hoverEls.forEach((element) => {
    let splitText = new SplitText(element, { type: "words,chars" });
    let chars = splitText.chars;

    let elementTimeline = gsap.timeline({ paused: true });
    elementTimeline.addLabel("start");

    element.addEventListener("mouseenter", () => {
      if (!elementTimeline.isActive()) {
        elementTimeline.clear().seek("start"); //so it always finishes

        elementTimeline.from(chars, {
          duration: 0.01,
          opacity: 0,
          ease: "none",
          stagger: 0.05,
        });

        elementTimeline.play();
      }
    });
  });
}

if (!isTouchDevice()) {
  //so it works when there's no barba action too
  hoverTyping();
}

/** CURSOR */
function customCursors() {
  const cursors = document.querySelector(".cursor-wrapper");
  const customCursors = document.querySelectorAll("[data-cursor]");

  if (!isTouchDevice()) {
    // move the cursors with the mouse position
    let isPointer = false;
    let lastKnownMousePosition = { x: 0, y: 0 };

    document.addEventListener("mousemove", (e) => {
      lastKnownMousePosition.x = e.clientX;
      lastKnownMousePosition.y = e.clientY;

      cursors.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;

      updateCursorVisibility(e.target);
    });

    lenis.on(
      "scroll",
      () => {
        const elementUnderCursor = document.elementFromPoint(
          lastKnownMousePosition.x,
          lastKnownMousePosition.y
        );
        updateCursorVisibility(elementUnderCursor);
      },
      true
    );

    function updateCursorVisibility(element) {
      if (window.getComputedStyle(element).cursor === "pointer") {
        isPointer = true;
        cursors.style.opacity = "0";
      } else if (window.getComputedStyle(element).cursor === "grab") {
        isPointer = true;
        cursors.style.opacity = "0";
      } else if (!isPointer) {
        cursors.style.opacity = "1";
      }
    }

    document.addEventListener("mouseout", () => {
      isPointer = false;
      cursors.style.opacity = "1";
    });

    // check if a custom cursor is needed
    customCursors.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        toggleCursorDefault();

        const cursorType = element.dataset.cursor;
        const cursor = document.querySelector(".cursor-" + cursorType);

        cursor.style.display = "block";

        if (cursorType == "carousel") {
          let carousel = element.querySelector(".swiper"),
            carouselName = carousel.dataset.carouselName,
            totalSlides = carousel.querySelectorAll(".swiper-slide").length,
            currentSlide = 1;

          function addZero(number, length) {
            return number.toString().padStart(length, "0");
          }

          carousel.querySelectorAll(".swiper-slide").forEach((slide, index) => {
            slide.addEventListener("mouseenter", () => {
              currentSlide = index + 1;
              document.querySelector(
                ".cursor-carousel .current-slide"
              ).innerHTML = addZero(currentSlide, 2) + "/";
            });
          });

          if (carouselName) {
            document.querySelector(
              ".cursor-carousel .carousel-name"
            ).innerHTML = carouselName;
          }
          document.querySelector(".cursor-carousel .total-slides").innerHTML =
            addZero(totalSlides, 2);
          document.querySelector(".cursor-carousel .current-slide").innerHTML =
            currentSlide + "/";
        }
      });

      element.addEventListener("mouseleave", () => {
        const cursors = document.querySelectorAll(".cursor");

        cursors.forEach((element) => {
          element.style.display = "none";
        });

        toggleCursorDefault();
      });
    });

    // toggle default cursor visibility
    function toggleCursorDefault() {
      const cursor = document.querySelector(".cursor-default");

      if (cursor.style.display === "none") {
        cursor.style.display = "block";
      } else {
        cursor.style.display = "none";
      }
    }
  } else {
    cursors.style.display = "none"; //hide all cursors on mobile
  }
}

function iframePoster() {
  setTimeout(function () {
    document
      .querySelectorAll("[data-vimeo-poster='true']")
      .forEach(function (componentEl) {
        const iframeEl = componentEl.querySelector("iframe");

        if (!componentEl.classList.contains("w-condition-invisible")) {
          if (
            iframeEl.hasAttribute("data-src") &&
            !iframeEl.hasAttribute("src")
          ) {
            let dataSrc = iframeEl.getAttribute("data-src");
            iframeEl.setAttribute("src", dataSrc);
          }
        }

        let player = new Vimeo.Player(iframeEl);

        player.on("play", function () {
          iframeEl.style.opacity = 1;
        });
      });
  }, 300);
}

function currentYear() {
  let copyrightYear = document.querySelectorAll(".copyright_year"),
    currentYear = new Date().getFullYear();

  copyrightYear.forEach((el) => {
    //because there will be more than 1 when transition barbajs, the after hook doesn't work for some reason
    el.textContent = currentYear;
  });
}

/* hide/show scrollbar, used for objects singles carousel */
function hideScrollbar() {
  document.body.classList.add("hide-scrollbar");
}
function showScrollbar() {
  document.body.classList.remove("hide-scrollbar");
}

/** Moible navbar logic */
function mobileBurger() {
  const navbarBurger = document.querySelector(".navbar__burger");
  const navbarSub = document.querySelector(".navbar__sub");
  const navbarLinks = document.querySelectorAll(".navbar__link");

  function openNavbar() {
    gsap.to(navbarSub, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "splitLines",
    });

    navbarLinks.forEach((link) => {
      gsap.to(link, {
        opacity: 1,
        duration: 0.25,
        ease: "splitLines",
      });
    });
  }

  function closeNavbar() {
    gsap.to(navbarSub, {
      opacity: 0,
      y: "-50%",
      duration: 0.7,
      ease: "splitLines",
    });

    navbarLinks.forEach((link) => {
      gsap.to(link, {
        opacity: 0,
        duration: 0.25,
        ease: "splitLines",
      });
    });
  }

  let navbarOpen = false;

  if (navbarBurger) {
    navbarBurger.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 991px)").matches) {
        navbarOpen = !navbarOpen;

        if (navbarOpen) {
          openNavbar();
        } else {
          closeNavbar();
        }
      }
    });
  }

  // close navbar when clicking outside of it
  document.addEventListener("click", (event) => {
    if (window.matchMedia("(max-width: 991px)").matches) {
      if (!event.target.closest(".navbar")) {
        closeNavbar();
        navbarOpen = false;
      }
    }
  });

  document
    .querySelectorAll(".navbar__search, .navbar__link, .navbar__logo")
    .forEach((el) => {
      el.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 991px)").matches) {
          if (navbarOpen != "false") {
            closeNavbar();
          }
        }
      });
    });
}

/** HOMEPAGE */
let homepageHeroSplitLines;
function homepageHeroLines() {
  const homepageHeroText = document.querySelector(".hero__clients-collection");

  homepageHeroText.style.pointerEvents = "none";

  if (window.matchMedia("(min-width: 992px)").matches) {
    gsap.set(homepageHeroText, { opacity: 1 });

    if (homepageHeroSplitLines) {
      homepageHeroSplitLines.revert();
    }

    homepageHeroSplitLines = new SplitText(homepageHeroText, {
      type: "lines",
      linesClass: "line line++",
    });

    gsap.from(homepageHeroSplitLines.lines, {
      yPercent: 100,
      duration: 0.6,
      opacity: 0,
      stagger: 0.1,
      ease: "splitLines",
      onComplete() {
        gsap.set(homepageHeroSplitLines.lines, { clearProps: "all" });
        homepageHeroText.classList.add("animated");
        homepageHeroText.style.pointerEvents = "auto";
      },
    });
  } else {
    gsap.set(homepageHeroText, { opacity: 1 });

    const lines = homepageHeroText.querySelectorAll(".hero__client-wrapper");

    if (!homepageHeroText.classList.contains("animated")) {
      gsap.from(lines, {
        yPercent: 100,
        duration: 0.6,
        opacity: 0,
        stagger: 0.05,
        ease: "splitLines",
        onComplete: function () {
          homepageHeroText.classList.add("animated");
          homepageHeroText.style.pointerEvents = "auto";
        },
      });
    }
  }
}

function homepageHeroDesktop() {
  const homepageHeroText = document.querySelector(".hero__clients-collection");

  if (window.matchMedia("(min-width: 992px)").matches) {
    //the hover effect to not trigger the "sensitive" area with css
    $(".hero__client-link").hover(
      function () {
        $(".hero__client-link").not(this).addClass("inactive");
      },
      function () {
        $(".hero__client-link").removeClass("inactive");
      }
    );

    const clients = document.querySelectorAll(".hero__client-wrapper"); //get all clients elements

    clients.forEach((el) => {
      let clientName = el.querySelector(".hero__client-text");

      let assetContainer = el.querySelector(".hero__client-background"),
        video = assetContainer.querySelector("video"),
        loader = el.querySelector(".hero__client-loader"),
        isVideoLoaded = false,
        isMouseOver = false; //so videos dont play right away when they're ready, only when hovered

      if (video) {
        if (video.readyState >= 2) {
          //the video was loaded already
          isVideoLoaded = true;
          checkMouseOver();
        } else {
          video.addEventListener("canplay", function () {
            //the video is loaded for the 1st time
            isVideoLoaded = true;
            checkMouseOver();
          });
        }
      } else {
        isVideoLoaded = true;
      }

      el.addEventListener("mouseover", () => {
        if(!homepageHeroText.classList.contains("animated")) {
          return;
        }

        isMouseOver = true;
        checkMouseOver();
      });

      el.addEventListener("mouseout", () => {
        isMouseOver = false;
        loader.style.opacity = 0;

        assetContainer.style.opacity = 0;
        clientName.style.color = "#070707";

        if (video) {
          video.pause();
        }
      });

      function checkMouseOver() {
        if (isMouseOver) {
          if (!isVideoLoaded) {
            //if video is not loaded
            loader.style.opacity = 1;
          } else {
            loader.style.opacity = 0; //video loaded, hide loader

            if (clientName.getAttribute("data-hover") === "light") {
              clientName.style.color = "#f8f8f8";
            }

            if (video) {
              video.play();
            }

            assetContainer.style.opacity = 1;
          }
        }
      }
    });
  }
}

function homepageHeroMobile() {
  if (window.matchMedia("(max-width: 991px)").matches) {
    document.addEventListener("DOMContentLoaded", function () {
      const clients = document.querySelectorAll(".hero__client-wrapper");
      let activeIndex;

      gsap.timeline({
        scrollTrigger: {
          trigger: ".homepage__hero",
          pin: true,
          scrub: 3,
          start: "+=2px",
          end: "+=100%",
          anticipatePin: 1,
          //markers: true,
          onUpdate: (self) => {
            activeIndex = Math.round(self.progress * (clients.length - 1));

            clients.forEach((client, i) => {
              let image = client.querySelector(".hero__client-background");
              let text = client.querySelector(".hero__client-text");

              gsap.to(text, { opacity: i === activeIndex ? 1 : 0.5 });

              gsap.to(image, {
                duration: 0.25,
                opacity: i === activeIndex ? 1 : 0,
                onStart: function () {
                  text.style.color =
                    i === activeIndex &&
                    text.getAttribute("data-hover") === "light"
                      ? "#f8f8f8"
                      : "#070707";
                },
              });
            });
          },
          onLeave: (trigger) => {
            if (trigger.trigger !== ".homepage__hero") {
              resetStyles();
            }
          },
          onLeaveBack: (trigger) => {
            if (trigger.trigger !== ".homepage__hero") {
              resetStyles();
            }
          },
        },
      });

      function resetStyles() {
        clients.forEach((client) => {
          let image = client.querySelector(".hero__client-background");
          let text = client.querySelector(".hero__client-text");
          gsap.to(image, { opacity: 0 });
          text.style.color = "#070707";
          gsap.to(text, { opacity: 1 });
        });
        activeIndex = -1;
      }
    });
  }
}

function projectsIndex() {
  if (window.matchMedia("(min-width: 992px)").matches) {
    const projectsContainer = document.querySelector('[data-index="projects"]');
    const projects = document.querySelectorAll(".project-index__link"); //get all projects inside the list
    const assetContainer = document.querySelector(
      ".project-index__asset-wrapper"
    ); //get the wrapper for the asset

    //opacity animation for the asset container
    projectsContainer.addEventListener("mouseenter", () => {
      let firstMouseMove = true;

      projectsContainer.addEventListener("mousemove", function (e) {
        //no mousemove, mexe o asset container
        if (firstMouseMove) {
          assetContainer.style.top = "0";
          assetContainer.style.left = "0";
          firstMouseMove = false;
        }

        assetContainer.style.transform = `translate(${e.clientX + 20}px, ${
          e.clientY + 20
        }px)`;
      });

      gsap.to(assetContainer, {
        autoAlpha: 1,
        duration: 0.25,
        ease: "blinking-line",
      });
    });

    projectsContainer.addEventListener("mouseleave", () => {
      gsap.to(assetContainer, {
        autoAlpha: 0,
        duration: 0.25,
        ease: "blinking-line",
      });
    });

    //animation for each project line - asset change
    projects.forEach((el) => {
      //em cada item da lista
      const assetWrapper = document.querySelector(".project-index__assets"); //vou buscar o container do asset
      let isVideoPlaying;
      let singleUrl = el.getAttribute("href");

      el.addEventListener("click", () => {
        barba.prefetch(singleUrl);
      });

      el.addEventListener("mouseenter", () => {
        //no mouseenter
        let projectImage = el.querySelector(
            'input[name="project-image"]'
          ).value, //valor da imagem
          projectVideo = el.querySelector('input[name="project-video"]').value; //valor do video id

        if (projectVideo) {
          //se existir vÃ­deo
          let vimeoWrapper = document.createElement("div");
          vimeoWrapper.className = "vimeo-wrapper";
          vimeoWrapper.style.background =
            "url(" + projectImage + ") center/cover no-repeat";

          let iframe = document.createElement("iframe");
          iframe.style.width = "100%";
          iframe.style.height = "100%";
          iframe.style.position = "relative";
          iframe.src =
            "https://player.vimeo.com/video/" +
            projectVideo +
            "?background=1&quality=720p&autoplay=1";
          iframe.allow = "autoplay";
          iframe.setAttribute("webkitallowfullscreen", "");
          iframe.setAttribute("mozallowfullscreen", "");
          iframe.setAttribute("allowfullscreen", "");

          //create the element
          vimeoWrapper.appendChild(iframe);

          let projectAsset = document.createElement("div");
          projectAsset.className = "project-index__asset";
          projectAsset.appendChild(vimeoWrapper);

          document
            .querySelector(".project-index__assets")
            .appendChild(projectAsset); //create the element inside the container

          projectAsset.style.zIndex = 2;

          gsap.set(projectAsset, { autoAlpha: 1 });

          gsap.to(projectAsset, {
            scale: 1.05,
            duration: 0.5,
            ease: "asset-index",
          });

          let player = new Vimeo.Player(iframe);

          player.on("play", function () {
            iframe.style.opacity = 1;
            isVideoPlaying = true;
          });

          player.getPaused().then(function (paused) {
            //check if video is paused before playing it
            if (paused) {
              player
                .play()
                .then(function () {
                  iframe.style.opacity = 1;
                  isVideoPlaying = true;
                })
                .catch(function (error) {
                  console.error("Failed to play video:", error);
                  isVideoPlaying = false;
                });
            }
          });
        } else if (projectImage) {
          //se existir imagem
          let img = document.createElement("img");
          img.src = projectImage;
          img.className = "project-index__asset";

          document.querySelector(".project-index__assets").appendChild(img);

          img.style.zIndex = 2;

          gsap.set(img, { autoAlpha: 1 });

          gsap.to(img, {
            scale: 1.05,
            duration: 0.5,
            ease: "asset-index",
          });
        }
      });

      el.addEventListener("mouseleave", () => {
        let projectAsset = document.querySelector(
          ".project-index__asset:first-of-type"
        );

        if (projectAsset) {
          projectAsset.style.zIndex = 1;

          gsap.to(projectAsset, {
            autoAlpha: 0,
            scale: 1,
            duration: 0.5,
            ease: "asset-index",
            onComplete: function () {
              //not working with the varibale
              document
                .querySelector(".project-index__asset:first-of-type")
                .remove();
            },
          });

          if (isVideoPlaying) {
            isVideoPlaying = false;
          }
        }
      });
    });
  }
}

/** PROJECTS */
function scrollDownAnimation() {
  if (window.matchMedia("(min-width: 992px)").matches) {
    setTimeout(() => {
      //wait for barbajs transition
      let scrollEl = document.querySelector(".btn-project-scroll");

      scrollEl.addEventListener("mouseenter", function () {
        gsap.to(".btn-project-scroll__word", {
          duration: 0.4,
          y: 10,
          ease: "power1.inOut",
          stagger: 0.1,
        });
      });

      scrollEl.addEventListener("mouseleave", function () {
        gsap.to(".btn-project-scroll__word", {
          duration: 0.4,
          y: 0,
          ease: "power1.inOut",
          stagger: 0.1,
        });
      });

      document
        .querySelector(".btn-project-scroll")
        .addEventListener("click", function () {
          const scrollPin = document.querySelector(".scroll-to-placeholder");
          window.scrollTo({
            top: scrollPin.offsetTop - 110,
            behavior: "smooth",
          });
        });
    }, 1000);
  }
}

function projectsSwiper() {
  new Swiper(".proj-general-carousel__wrapper", {
    loop: true,
    slidesPerView: 1.1,
    spaceBetween: 10,
    height: "auto",
    breakpoints: {
      768: {
        spaceBetween: 20,
        slidesPerView: 2,
      },
    },
    on: {
      click: function () {
        this.slideNext();
      },
    },
  });

  new Swiper(".proj-16x9-carousel__wrapper", {
    loop: true,
    slidesPerView: 1.1,
    spaceBetween: 10,
    height: "auto",
    breakpoints: {
      768: {
        spaceBetween: 20,
        slidesPerView: 1,
      },
    },
    on: {
      click: function () {
        this.slideNext();
      },
    },
  });

  new Swiper(".proj-9x16-carousel3__wrapper", {
    loop: true,
    slidesPerView: 2.2,
    spaceBetween: 10,
    height: "auto",
    breakpoints: {
      768: {
        spaceBetween: 20,
        slidesPerView: 3,
      },
    },
    on: {
      click: function () {
        this.slideNext();
      },
    },
  });

  new Swiper(".proj-9x16-carousel2__wrapper", {
    loop: true,
    slidesPerView: 2.2,
    spaceBetween: 10,
    height: "auto",
    breakpoints: {
      768: {
        spaceBetween: 20,
        slidesPerView: 2,
      },
    },
    on: {
      click: function () {
        this.slideNext();
      },
    },
  });

  new Swiper(".proj-4x5-carousel2__wrapper", {
    loop: true,
    slidesPerView: 2.2,
    spaceBetween: 10,
    height: "auto",
    breakpoints: {
      768: {
        spaceBetween: 20,
        slidesPerView: 2,
      },
    },
    on: {
      click: function () {
        this.slideNext();
      },
    },
  });

  new Swiper(".proj-1x1-carousel__wrapper", {
    loop: true,
    slidesPerView: 2.2,
    spaceBetween: 10,
    height: "auto",
    breakpoints: {
      768: {
        spaceBetween: 20,
        slidesPerView: 2,
      },
    },
    on: {
      click: function () {
        this.slideNext();
      },
    },
  });

  new Swiper(".proj-similar__wrapper", {
    slidesPerView: 1.1,
    spaceBetween: 10,
    height: "auto",
    breakpoints: {
      768: {
        spaceBetween: 20,
        slidesPerView: 2,
      },
    },
    on: {
      click: function () {
        this.slideNext();
      },
    },
  });
}

function videoComponent() {
  document
    .querySelectorAll("[js-vimeo-element='component']")
    .forEach(function (componentEl) {

      const iframeEl = componentEl.querySelector("iframe");
      const coverEl = componentEl.querySelector("[js-vimeo-element='cover']");
      const coverImage = componentEl.querySelector(
        "[js-vimeo-element='media']"
      );
      const timeline = componentEl.querySelector(".proj-video-timeline");
      if(timeline) {
        timeline.remove();
      }

      let currentSrc = iframeEl.getAttribute("src");
      if (!currentSrc.includes("?")) {
        currentSrc += "?";
      } else if (!currentSrc.endsWith("&")) {
        currentSrc += "&";
      }
      currentSrc += "playsinline=0&autopause=0";
      iframeEl.setAttribute("src", currentSrc);

      let player = new Vimeo.Player(iframeEl);
      
      // Disable loop so the 'ended' event fires
      player.setLoop(false);
      
      player.on("play", function () {
        componentEl.classList.add("is-playing");
      });
      player.on("pause", function () {
        componentEl.classList.remove("is-playing");
      });
      player.on("ended", function () {
        componentEl.classList.remove("is-playing");
        coverEl.style.cssText = "opacity: 1; pointer-events: auto;";
        coverImage.style.cssText = "opacity: 1; pointer-events: auto;";
        playButton.innerHTML = "Play";
        playButton.classList.remove("is-playing");
        player.setCurrentTime(0);
      });

      let controlBackground = document.createElement("div");
      controlBackground.classList.add("proj-video-controls__background");
      componentEl.appendChild(controlBackground);

      controlBackground.addEventListener("click", function () {
        playButton.click();
      });

      let controls = document.createElement("div");
      controls.classList.add("proj-video-controls");

      let volume = document.createElement("div");
      volume.classList.add("proj-video-controls__volume");
      controls.appendChild(volume);
      
      let muteButton = document.createElement("button");
      muteButton.classList.add("proj-video-controls__mute");
      muteButton.innerHTML = "Mute";
      volume.appendChild(muteButton);

      let volumeBar = document.createElement("div");
      volumeBar.classList.add("proj-video-controls__volume-bar");
      volume.appendChild(volumeBar);

      let volumeBarFill = document.createElement("div");
      volumeBarFill.classList.add("proj-video-controls__volume-bar-fill");
      volumeBar.appendChild(volumeBarFill);

      let progressBar = document.createElement("div");
      progressBar.classList.add("proj-video-controls__progress-bar");
      controls.appendChild(progressBar);

      let progressBarFill = document.createElement("div");
      progressBarFill.classList.add("proj-video-controls__progress-bar-fill");
      progressBar.appendChild(progressBarFill);

      let playButton = document.createElement("button");
      playButton.classList.add("proj-video-controls__play");
      playButton.innerHTML = "Play";
      progressBar.appendChild(playButton);

      let time = document.createElement("div");
      time.classList.add("proj-video-controls__time");
      progressBar.appendChild(time);

      let timeElapsed = document.createElement("div");
      timeElapsed.classList.add("proj-video-controls__time-elapsed");
      timeElapsed.innerHTML = "0:00";
      time.appendChild(timeElapsed);
      
      let totalTime = document.createElement("div");
      totalTime.classList.add("proj-video-controls__time-total");
      totalTime.innerHTML = "0:00";
      time.appendChild(totalTime);

      componentEl.appendChild(controls);

      // prevent time display from triggering seek
      time.addEventListener("mousedown", function (event) {
        event.stopPropagation();
      });
      
      time.addEventListener("click", function (event) {
        event.stopPropagation();
      });

      componentEl.addEventListener("mouseenter", () => {
        controls.classList.add("is-visible");
      });

      componentEl.addEventListener("mouseleave", () => {
        controls.classList.remove("is-visible");
      });

      // Prevent mousedown on playButton from triggering progress bar drag
      playButton.addEventListener("mousedown", function (event) {
        event.stopPropagation();
      });
      
      playButton.addEventListener("click", function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (componentEl.classList.contains("is-playing")) {
          player.pause();
          playButton.innerHTML = "Play";
          playButton.classList.remove("is-playing");
        } else {
          player.play();
          playButton.innerHTML = "Pause";
          playButton.classList.add("is-playing");
        }
      });

      // when clicking the cover play the video
      coverEl.addEventListener("click", function () {
        coverEl.style.cssText = "opacity: 0;";
        coverImage.style.cssText = "opacity: 0";
        coverEl.style.pointerEvents = "none";
        coverImage.style.pointerEvents = "none";

        player.play();
        playButton.innerHTML = "Pause";
        playButton.classList.add("is-playing");
      });

      // update timeline
      player.getDuration().then(function (duration) {
        setInterval(updateTimelineBar, 100, duration);

        totalTime.innerHTML = formatTime(duration);

        // make progress bar clickable and draggable to seek
        let isDraggingProgress = false;
        
        function updateProgress(event) {
          const rect = progressBar.getBoundingClientRect();
          const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
          const progress = x / rect.width;
          const newTime = progress * duration;
          player.setCurrentTime(newTime);
        }
        
        progressBar.addEventListener("mousedown", function (event) {
          event.stopPropagation();
          event.preventDefault();
          isDraggingProgress = true;
          updateProgress(event);
          
          function onMouseMove(e) {
            if (isDraggingProgress) {
              updateProgress(e);
            }
          }
          
          function onMouseUp() {
            isDraggingProgress = false;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
          }
          
          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        });
      });

      function updateTimelineBar(duration) {
        player.getCurrentTime().then(function (time) {
          var progress = (time / duration) * 100;
          progressBarFill.style.width = progress + "%";
          timeElapsed.innerHTML = formatTime(time);
          totalTime.innerHTML = formatTime(duration);
        });
      }

      function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }

      function updateVolumeClasses(volume) {
        if (volume > 0.75) {
          muteButton.classList.remove("is-medium", "is-low");
        } else if (volume >= 0.25) {
          muteButton.classList.add("is-medium");
          muteButton.classList.remove("is-low");
        } else {
          muteButton.classList.add("is-low");
          muteButton.classList.remove("is-medium");
        }
      }

      muteButton.addEventListener("click", function () {
        if (muteButton.classList.contains("is-muted")) {
          player.setVolume(1);
          muteButton.classList.remove("is-muted");
          volumeBar.classList.add("is-active");
          volumeBarFill.style.height = "100%";
          updateVolumeClasses(1);
        } else {
          player.setVolume(0);
          muteButton.classList.add("is-muted");
          volumeBar.classList.remove("is-active");
          volumeBarFill.style.height = "0%";
          updateVolumeClasses(0);
        }
      });

      player.getVolume().then(function (volume) {
        if(volume === 0) {
          muteButton.classList.add("is-muted");
          volumeBar.classList.remove("is-active");
        }
        volumeBarFill.style.height = volume * 100 + "%";
        updateVolumeClasses(volume);
      });

      volume.addEventListener("mouseenter", function () {
        if(!muteButton.classList.contains("is-muted")) {
          volumeBar.classList.add("is-active");
        }
      });

      // make volume bar clickable and draggable
      let isDraggingVolume = false;

      volume.addEventListener("mouseleave", function () {
        if(!muteButton.classList.contains("is-muted") && !isDraggingVolume) {  
          volumeBar.classList.remove("is-active");
        }
      });
      
      function updateVolumeFromEvent(event) {
        const rect = volumeBar.getBoundingClientRect();
        const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height));
        const volume = Math.max(0, Math.min(1, 1 - (y / rect.height)));

        volumeBarFill.style.height = volume * 100 + "%";

        player.setVolume(volume);
        
        if (volume === 0) {
          muteButton.classList.add("is-muted");
          volumeBar.classList.remove("is-active");
        } else {
          muteButton.classList.remove("is-muted");
        }
        
        updateVolumeClasses(volume);
      }
      
      volumeBar.addEventListener("mousedown", function (event) {
        event.stopPropagation();
        event.preventDefault();
        isDraggingVolume = true;
        updateVolumeFromEvent(event);
        
        function onMouseMove(e) {
          if (isDraggingVolume) {
            updateVolumeFromEvent(e);
          }
        }
        
        function onMouseUp() {
          isDraggingVolume = false;
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
        }
        
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });
    });
}

function stickyReturn() {
  if (window.matchMedia("(min-width: 768px)").matches) {
    //from tablet on
    setTimeout(() => {
      //wait for the barbajs finish the transition
      let heroButtons = document.querySelector(".project-hero__buttons"),
        backButton = heroButtons.querySelector(".project-hero__back");

      ScrollTrigger.create({
        trigger: heroButtons,
        start: "top-=12.5rem top",
        end: ScrollTrigger.maxScroll(window),
        // markers: true,
        onEnter: () => backButton.classList.add("sticky"),
        onEnterBack: () => backButton.classList.add("sticky"),
        onLeave: () => backButton.classList.remove("sticky"),
        onLeaveBack: () => backButton.classList.remove("sticky"),
      });
    }, 1000);
  }
}

function projectsNavigation() {
  const currentUrl = window.location.href;
  const currentSlug = currentUrl.substring(currentUrl.lastIndexOf("/") + 1);

  $("<div />").load("/", function (data) {
    let allProjects = $(data).find(".homepage__projects");
    let currentProject = allProjects
        .find('[href$="' + currentSlug + '"]')
        .closest(".projects-index"),
      prevProject = allProjects
        .find(".projects-index")
        .eq(currentProject.index() - 1),
      prevAssets = allProjects
        .find(".project-index__data")
        .eq(currentProject.index() - 1),
      nextProject = allProjects
        .find(".projects-index")
        .eq(currentProject.index() + 1),
      nextAssets = allProjects
        .find(".project-index__data")
        .eq(currentProject.index() + 1);

    let prevTitle = prevProject
        .find(".project-info__title p:last-of-type")
        .text(),
      prevYear = prevProject.find(".project-info__year").text(),
      prevImage = prevAssets.find('input[name="project-image"]').val(),
      prevUrl = prevProject.find(".project-index__link").attr("href");

    let nextTitle = nextProject
        .find(".project-info__title p:last-of-type")
        .text(),
      nextYear = nextProject.find(".project-info__year").text(),
      nextImage = nextAssets.find('input[name="project-image"]').val(),
      nextUrl = nextProject.find(".project-index__link").attr("href");

    document.querySelector(
      '.proj-others__wrapper[data-proj-others="prev"]'
    ).href = prevUrl;
    document.querySelector('.proj-others__image[data-proj-others="prev"]').src =
      prevImage;
    document.querySelector(
      '.proj-others__name[data-proj-others="prev"]'
    ).innerHTML = prevTitle;
    document.querySelector(
      '.proj-others__year[data-proj-others="prev"]'
    ).innerHTML = prevYear;

    document.querySelector(
      '.proj-others__wrapper[data-proj-others="next"]'
    ).href = nextUrl;
    document.querySelector('.proj-others__image[data-proj-others="next"]').src =
      nextImage;
    document.querySelector(
      '.proj-others__name[data-proj-others="next"]'
    ).innerHTML = nextTitle;
    document.querySelector(
      '.proj-others__year[data-proj-others="next"]'
    ).innerHTML = nextYear;
  });
}

function projectScrollAnimations() {
  setTimeout(() => {
    const sectionsLines = [
      ".proj-text-col6",
      ".proj-text-col8",
      ".proj-text-block",
    ];

    const sections = [
      ".proj-text-intro",
      ".proj-text-caption",
      ".proj-text-col6",
      ".proj-text-col8",
      ".proj-text-block",
      ".proj-credits",
      ".proj-credits-inline",
      ".proj-16x9-col6",
      ".proj-16x9-col10",
      ".proj-16x9-col12",
      ".proj-16x9-gallery2",
      ".proj-16x9-gallery3",
      ".proj-16x9-gallery4",
      ".proj-general-full",
      ".proj-general-carousel",
      ".proj-16x9-col10-carousel",
      ".proj-16x9-col12-carousel",
      ".proj-9x16-col4",
      ".proj-16x9-video",
      ".proj-9x16-col8-gallery2",
      ".proj-9x16-col10-gallery2",
      ".proj-9x16-gallery3",
      ".proj-9x16-gallery2",
      ".proj-9x16-carousel3",
      ".proj-9x16-carousel2",
      ".proj-9x16-video",
      ".proj-1x1-col3",
      ".proj-1x1-col4",
      ".proj-1x1-col6",
      ".proj-1x1-col10",
      ".proj-1x1-col12",
      ".proj-1x1-gallery2",
      ".proj-1x1-gallery4",
      ".proj-1x1-carousel",
      ".proj-1x1-video",
      ".proj-4x5-col4",
      ".proj-4x5-col6",
      ".proj-4x5-col12",
      ".proj-4x5-gallery",
      ".proj-4x5-carousel2",
      ".proj-4x5-video",
      ".proj-video-loop",
      ".proj-wide-image",
      ".proj-wide-video",
      ".proj-others",
    ];

    sections.forEach((classSelector) => {
      const elements = document.querySelectorAll(classSelector);

      elements.forEach((el) => {
        if (!el.classList.contains("animated")) {
          gsap.fromTo(
            el,
            { y: 40, opacity: 0 },
            {
              y: 0,
              duration: 0.8,
              opacity: 1,
              ease: "power4",
              scrollTrigger: {
                trigger: el,
                start: "top-=40 bottom-=100",
                end: "bottom bottom",
              },
              before: function () {
                let artworksContent = document.querySelector(".artworks-content");
                if (artworksContent) {
                  artworksContent.style.opacity = "1";
                }
              },
              onComplete: function () {
                el.classList.add("animated");
              },
            }
          );
        }
      });
    });

    sectionsLines.forEach((classSelector) => {
      const elements = document.querySelectorAll(classSelector);

      elements.forEach((el) => {
        const splitLines = new SplitText(
          el.querySelector(".proj-text__paragraph"),
          {
            type: "lines",
            linesClass: "line line++",
          }
        );

        const blockLink = el.querySelector(".proj-text-block__link");

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top-=40 bottom-=200",
            end: "bottom bottom",
          },
        });

        timeline.from(splitLines.lines, {
          // lines animation
          yPercent: 50,
          duration: 1,
          opacity: 0,
          stagger: 0.1,
          ease: "power4",
        });

        if (blockLink) {
          // check if blockLink exists and add its animation to the timeline
          gsap.set(blockLink, { opacity: 0 });

          timeline.to(blockLink, {
            opacity: 0.5,
            duration: 0.6,
            ease: "power4",
          });
        }
      });
    });
  }, 1000);
}

/** OBJECTS */
function objectsHeroLines() {
  if (window.matchMedia("(min-width: 992px)").matches) {
    document.fonts.ready.then(function () {
      let objectsHeroText = document.querySelector(".objects-hero__text");

      if (objectsHeroText && !objectsHeroText.classList.contains("has-animated")) {
        objectsHeroText.classList.add("has-animated");

        gsap.set(document.querySelector(".objects-hero"), { opacity: 1 });

        const splitLines = new SplitText(objectsHeroText, {
          type: "lines",
          linesClass: "line line++",
        });

        gsap.from(splitLines.lines, {
          yPercent: 60,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "splitLines",
          onComplete() {
            const finish = gsap.timeline();

            finish
              .to(splitLines.lines, { clearProps: "all" })
              .to(
                objectsHeroText.style,
                { color: "#dedede", mixBlendMode: "difference" },
                0
              ) // synchronize color and mixBlendMode
              .call(() => {
                document
                  .querySelectorAll(".objects-index__text--areas")
                  .forEach(function (el) {
                    el.classList.add("obj-areas-underline");
                  });
              });
          },
        });
      }
    });
  } else {
    document.fonts.ready.then(function () {
      let objectsHeroText = document.querySelector(".objects-hero__text");

      if (!objectsHeroText.classList.contains("has-animated")) {
        objectsHeroText.classList.add("has-animated");

        gsap.set(document.querySelector(".objects-hero"), { opacity: 1 });

        const splitLines = new SplitText(objectsHeroText, {
          type: "lines",
          linesClass: "line line++",
        });

        gsap.from(splitLines.lines, {
          yPercent: 60,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "splitLines",
          onComplete() {
            const finish = gsap.timeline();
            finish.to(splitLines.lines, { clearProps: "all" });
            gsap.to(".objects-hero__asset-mobile", {
              opacity: 1,
              duration: 0.4,
              ease: "blinking-line",
            });
          },
        });
      }
    });
  }
}

// Store all Objects page event handlers for cleanup
let objectsMousemoveHandler = null;
let objectsEventListeners = [];

function objectsHeroDesktop() {
  if (window.matchMedia("(min-width: 992px)").matches) {
    // when videos are ready, show the container
    document
      .querySelectorAll(".objects-hero__assets .vimeo-wrapper")
      .forEach(function (componentEl) {
        const iframeEl = componentEl.querySelector("iframe");
        const wrapper = document.querySelector(".objects-hero__assets");
        let player = new Vimeo.Player(iframeEl);

        player.on("play", function () {
          iframeEl.style.opacity = 1;
          wrapper.style.opacity = 1;
        });
      });

    const heroWords = document.querySelectorAll("[data-obj-word]");
    const images = document.querySelectorAll("[data-obj-video]");
    let activeImage = images[0]; // select the activeImage = active asset, start with first one (its called image cause it wasnt suppose to have video initially)

    if (activeImage) {
      activeImage.classList.add("active"); //show current asset
    }

    // trigger the mousemove interaction for the active image
    if (activeImage) {
      objectsMousemoveHandler = (e) => {
        let xPos = (e.clientX - activeImage.offsetLeft) * 0.1;
        let yPos = (e.clientY - activeImage.offsetTop) * 0.1;

        activeImage.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
      };
      
      document.addEventListener("mousemove", objectsMousemoveHandler);
    }

    heroWords.forEach(function (word) {
      const mouseenterHandler = function () {
        let code = this.getAttribute("data-obj-word");
        let imageEl = document.querySelector('[data-obj-video="' + code + '"]');

        if (imageEl && imageEl !== activeImage) {
          activeImage.classList.remove("active"); //remove previous active img

          imageEl.classList.add("active");
          activeImage = imageEl;
        }
      };
      
      word.addEventListener("mouseenter", mouseenterHandler);
      objectsEventListeners.push({ element: word, event: "mouseenter", handler: mouseenterHandler });
    });
  }
}

// Function to clean up Objects page event listeners
function cleanupObjectsListeners() {
  console.log("Cleaning up Objects page listeners...");
  
  // Remove global mousemove handler
  if (objectsMousemoveHandler) {
    document.removeEventListener("mousemove", objectsMousemoveHandler);
    objectsMousemoveHandler = null;
    console.log("Removed global mousemove handler");
  }
  
  // Remove all stored event listeners
  objectsEventListeners.forEach(({ element, event, handler }) => {
    if (element && element.removeEventListener) {
      element.removeEventListener(event, handler);
    }
  });
  
  console.log(`Removed ${objectsEventListeners.length} event listeners`);
  
  // Clear the array
  objectsEventListeners = [];
}

function objectsIndex() {
  if (window.matchMedia("(min-width: 992px)").matches) {
    const objectsContainer = document.querySelector('[data-index="objects"]');
    const objects = document.querySelectorAll(".objects-index__link");
    const allAssets = document.querySelectorAll(".objects-index__assets"); //get all images/videos
    const assetContainer = document.querySelector(
      ".objects-index__asset-wrapper"
    ); //get the wrapper for the asset
    let isVideoPlaying = false;

    // Store mousemove handler for cleanup
    let containerMousemoveHandler = null;

    // opacity animation for the asset container
    const mouseenterHandler = () => {
      let firstMouseMove = true;

      containerMousemoveHandler = function (e) {
        //no mousemove, mexe o asset container
        if (firstMouseMove) {
          assetContainer.style.top = "0";
          assetContainer.style.left = "0";
          firstMouseMove = false;
        }

        assetContainer.style.transform = `translate(${e.clientX + 20}px, ${
          e.clientY + 20
        }px)`;
      };

      objectsContainer.addEventListener("mousemove", containerMousemoveHandler);

      gsap.to(assetContainer, {
        autoAlpha: 1,
        duration: 0.25,
        ease: "blinking-line",
      });
    };

    const mouseleaveHandler = () => {
      gsap.to(assetContainer, {
        autoAlpha: 0,
        duration: 0.25,
        ease: "blinking-line",
      });
    };

    objectsContainer.addEventListener("mouseenter", mouseenterHandler);
    objectsContainer.addEventListener("mouseleave", mouseleaveHandler);

    // Store these listeners for cleanup
    objectsEventListeners.push(
      { element: objectsContainer, event: "mouseenter", handler: mouseenterHandler },
      { element: objectsContainer, event: "mouseleave", handler: mouseleaveHandler }
    );

    objects.forEach((el, index) => {
      //em cada item da lista
      let singleUrl = el.getAttribute("href");

      const clickHandler = () => {
        barba.prefetch(singleUrl);
      };

      const mouseenterHandler = () => {
        //no mouseenter
        let currentAsset = allAssets[index];

        let iframe = currentAsset.querySelector("iframe");

        if (currentAsset) {
          //se este elemento da lista tiver asset
          currentAsset.style.zIndex = 1;

          gsap.set(currentAsset, { autoAlpha: 1 });

          gsap.to(currentAsset, {
            scale: 1.05,
            duration: 0.5,
            autoAlpha: 1,
            ease: "asset-index",
          });

          if (iframe && iframe.dataset.videoId) {
            if (!iframe.src) {
              iframe.src = iframe.dataset.src;
            }

            let player = new Vimeo.Player(iframe);

            player
              .ready()
              .then(function () {
                player
                  .play()
                  .then(function () {
                    iframe.style.opacity = 1;
                    isVideoPlaying = true;
                  })
                  .catch(function (error) {
                    console.error("Failed to play video:", error);
                    isVideoPlaying = false;
                  });
              })
              .catch(function (error) {
                console.error("Failed to load video:", error);
              });
          }
        }
      };

      const mouseleaveHandler = () => {
        let currentAsset = allAssets[index];

        let iframe = currentAsset.querySelector("iframe");

        currentAsset.style.zIndex = 0;

        gsap.to(currentAsset, {
          autoAlpha: 0,
          scale: 1,
          duration: 0.5,
          ease: "asset-index",
        });

        if (iframe && iframe.dataset.videoId && isVideoPlaying) {
          let player = new Vimeo.Player(iframe);

          player.pause();
          isVideoPlaying = false;
        }
      };

      el.addEventListener("click", clickHandler);
      el.addEventListener("mouseenter", mouseenterHandler);
      el.addEventListener("mouseleave", mouseleaveHandler);

      // Store these listeners for cleanup
      objectsEventListeners.push(
        { element: el, event: "click", handler: clickHandler },
        { element: el, event: "mouseenter", handler: mouseenterHandler },
        { element: el, event: "mouseleave", handler: mouseleaveHandler }
      );
    });
  }
}

function enquireHover() {
  if (window.matchMedia("(min-width: 768px)").matches) {
    document.querySelectorAll(".enquire-button").forEach((button) => {
      const mouseenterHandler = function (event) {
        let hoverText = this.getAttribute("data-text-hover");
        if (!hoverText) {
          hoverText = this.getAttribute("data-text-original");
        }

        if (!this.classList.contains("is-hover")) {
          this.style.width = this.offsetWidth + "px";
          this.style.height = this.offsetHeight + "px";
          this.classList.add("is-hover");

          gsap.to(this, {
            opacity: 0,
            duration: 0.3,
            onComplete: function () {
              button.textContent = hoverText;

              let splitHoverText = new SplitText(button, {
                type: "words,chars",
              });
              gsap.set(splitHoverText.chars, { opacity: 0 });

              gsap.to(splitHoverText.chars, {
                opacity: 1,
                stagger: 0.05,
                duration: 0.01,
                ease: "none",
              });

              gsap.to(button, { opacity: 1, duration: 0.3 });
            },
          });
        }
      };

      const mouseleaveHandler = function (event) {
        let originalText = this.getAttribute("data-text-original");

        if (this.classList.contains("is-hover")) {
          gsap.to(this, {
            opacity: 0,
            duration: 0.3,
            onComplete: function () {
              button.textContent = originalText;
              gsap.to(button, { opacity: 1, duration: 0.3 });
            },
          });
          this.classList.remove("is-hover");
        }
      };

      button.addEventListener("mouseenter", mouseenterHandler);
      button.addEventListener("mouseleave", mouseleaveHandler);

      // Store these listeners for cleanup
      objectsEventListeners.push(
        { element: button, event: "mouseenter", handler: mouseenterHandler },
        { element: button, event: "mouseleave", handler: mouseleaveHandler }
      );
    });
  }
}

let objetcsSlideshow; //so i can access it on the else, doesn't work inside the function objectsSwiper

function objectsSwiper() {
  if (window.matchMedia("(min-width: 768px)").matches) {
    //init swiper only from tablet on
    objetcsSlideshow = new Swiper(".objects-carousel__wrapper", {
      slidesPerView: "auto",
      spaceBetween: remToPixels(1.25),
      freeMode: true,
      mousewheel: {
        enabled: true,
        sensitivity: 4,
      },
      on: {
        init: function () {
          let slidesInView = [
            this.slides[0],
            this.slides[1],
            this.slides[2],
            this.slides[3],
          ];

          gsap.to(slidesInView, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "blinking-line",
          });
        },
        slideChange: function () {
          let currentSlide = this.slides[this.activeIndex + 2];

          gsap.to(currentSlide, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "blinking-line",
          });
        },
      },
    });
  } else {
    if (objetcsSlideshow !== undefined) {
      objetcsSlideshow.destroy(true, true);
    }

    setTimeout(() => {
      //wait for barba transition
      let slides = document.querySelectorAll(".objects-carousel__slide");

      slides.forEach((el) => {
        if (!el.classList.contains("animated")) {
          gsap.fromTo(
            el,
            { y: 40, opacity: 0 },
            {
              y: 0,
              duration: 0.8,
              opacity: 1,
              ease: "power4",
              scrollTrigger: {
                trigger: el,
                start: "top-=40 bottom-=100",
                end: "bottom bottom",
              },
              onComplete: function () {
                el.classList.add("animated");
              },
            }
          );
        }
      });
    }, 1000);
  }
}

function objectsEnquire() {
  if (window.matchMedia("(min-width: 768px)").matches) {
    const emailToCopy = "hello@yambo.me";

    gsap.set(document.querySelector(".enquire-close"), { opacity: 0, y: 5 });

    document.querySelectorAll("[data-enquire]").forEach(function (button) {
      let availability = button.textContent;

      if (availability == "Enquire") {
        const clickHandler = function () {
          document.querySelector(".objects-enquire").classList.add("active");

          gsap.fromTo(
            ".enquire-info__line",
            { display: "none" },
            { duration: 0.4, display: "block", stagger: 0.3 }
          );

          gsap.fromTo(
            ".enquire-close",
            {
              duration: 0.4,
              y: 20,
              opacity: 0,
              ease: "power1.inOut",
            },
            {
              opacity: 1,
              y: 0,
            }
          );

          navigator.clipboard.writeText(emailToCopy);
        };

        button.addEventListener("click", clickHandler);
        objectsEventListeners.push({ element: button, event: "click", handler: clickHandler });
      }
    });

    document.querySelectorAll(".enquire-close").forEach(function (button) {
      const closeHandler = function () {
        this.closest(".objects-enquire").classList.remove("active");
      };

      button.addEventListener("click", closeHandler);
      objectsEventListeners.push({ element: button, event: "click", handler: closeHandler });
    });
  }
}

function objectsDownload() {
  let downloadButtons = document.querySelectorAll(
    ".objects-single_download-btn"
  );

  downloadButtons.forEach(function (el) {
    let currentUrl = el.getAttribute("href");

    if (currentUrl.includes("www.dropbox.com") && currentUrl.includes("dl=0")) {
      let modifiedUrl = currentUrl.replace("dl=0", "dl=1");
      el.setAttribute("href", modifiedUrl);
    }
  });
}

/** ABOUT */
function aboutVideo() {
  setTimeout(() => {
    //wait for the barbajs finish the transition, otherwise the containers would be on top of each other and the start/end point would be calculated wrong
    let videoWrapper = document.querySelector("#aboutVideo"),
      aboutIframe = videoWrapper.querySelector("iframe"),
      aboutVideo = new Vimeo.Player(aboutIframe);

    aboutVideo.pause();

    ScrollTrigger.matchMedia({
      "(min-width: 992px)": function () {
        ScrollTrigger.create({
          trigger: videoWrapper,
          start: "top center",
          end: "bottom center",
          onEnter: () => aboutVideo.play(),
          onEnterBack: () => aboutVideo.play(),
          onLeave: () => aboutVideo.pause(),
          onLeaveBack: () => aboutVideo.pause(),
        });
      },
      "(max-width: 991px)": function () {
        ScrollTrigger.create({
          trigger: videoWrapper,
          start: "top bottom-=10%",
          end: "bottom top+=10%",
          onEnter: () => aboutVideo.play(),
          onEnterBack: () => aboutVideo.play(),
          onLeave: () => aboutVideo.pause(),
          onLeaveBack: () => aboutVideo.pause(),
        });
      },
    });

    aboutVideo.on("play", function () {
      aboutIframe.style.opacity = 1; //for the poster, not using iframeVideo function because it would create another player
    });
  }, 1000);
}

function aboutIndexes() {
  if (window.matchMedia("(min-width: 992px)").matches) {
    const aboutIndexesSections = document.querySelectorAll(".about-three-col"); // Replace with the class that identifies your sections

    aboutIndexesSections.forEach((section) => {
      let indexCode = section
        .querySelector("[data-index]")
        .getAttribute("data-index");
      let sectionContainer = document.querySelector(
        `[data-index=${CSS.escape(indexCode)}]`
      );

      const indexes = section.querySelectorAll(".about-three-col__link");
      const allAssets = section.querySelectorAll(".about-three-col__assets"); //get all images/videos
      const assetContainer = section.querySelector(
        ".about-three-col__asset-wrapper"
      ); //get the wrapper for the asset
      let isVideoPlaying = false;

      //opacity animation for the asset container
      sectionContainer.addEventListener("mouseenter", () => {
        let firstMouseMove = true;

        sectionContainer.addEventListener("mousemove", function (e) {
          //no mousemove, mexe o asset container
          if (firstMouseMove) {
            assetContainer.style.top = "0";
            assetContainer.style.left = "0";
            firstMouseMove = false;
          }

          assetContainer.style.transform = `translate(${e.clientX + 20}px, ${
            e.clientY + 20
          }px)`;
        });

        gsap.to(assetContainer, {
          autoAlpha: 1,
          duration: 0.25,
          ease: "blinking-line",
        });
      });

      sectionContainer.addEventListener("mouseleave", () => {
        gsap.to(assetContainer, {
          autoAlpha: 0,
          duration: 0.25,
          ease: "blinking-line",
        });
      });

      //animation for each project line
      indexes.forEach((el, index) => {
        //em cada item da lista
        el.addEventListener("mouseenter", () => {
          //no mouseenter
          let currentAsset = allAssets[index];

          let iframe = currentAsset.querySelector("iframe");

          if (currentAsset) {
            //se este elemento da lista tiver asset
            currentAsset.style.zIndex = 1;

            gsap.set(currentAsset, { autoAlpha: 1 });

            gsap.to(currentAsset, {
              scale: 1.05,
              duration: 0.5,
              autoAlpha: 1,
              ease: "asset-index",
            });

            if (iframe && iframe.dataset.videoId) {
              if (!iframe.src) {
                iframe.src = iframe.dataset.src;
              }

              let player = new Vimeo.Player(iframe);

              player
                .ready()
                .then(function () {
                  player
                    .play()
                    .then(function () {
                      iframe.style.opacity = 1;
                      isVideoPlaying = true;
                    })
                    .catch(function (error) {
                      console.error("Failed to play video:", error);
                      isVideoPlaying = false;
                    });
                })
                .catch(function (error) {
                  console.error("Failed to load video:", error);
                });
            }
          }
        });

        el.addEventListener("mouseleave", () => {
          let currentAsset = allAssets[index];

          let iframe = currentAsset.querySelector("iframe");

          currentAsset.style.zIndex = 0;

          gsap.to(currentAsset, {
            autoAlpha: 0,
            scale: 1,
            duration: 0.5,
            ease: "asset-index",
          });

          if (iframe && iframe.dataset.videoId && isVideoPlaying) {
            let player = new Vimeo.Player(iframe);

            player.pause();
            iframe.style.opacity = 0;
            isVideoPlaying = false;
          }
        });
      });
    });
  }
}

function locationHover() {
  if (!isTouchDevice()) {
    let hoverTrigger = document.querySelector(".about-location-hover");
    let hoverImage = document.querySelector(".about-location-image");

    let isActive = false;

    hoverTrigger.addEventListener("mouseover", () => {
      hoverImage.style.opacity = 1;
      isActive = true;

      document.addEventListener("mousemove", onMouseMove);
    });

    hoverTrigger.addEventListener("mouseout", () => {
      hoverImage.style.opacity = 0;
      isActive = false;

      document.removeEventListener("mousemove", onMouseMove);
    });

    function onMouseMove(e) {
      if (isActive) {
        let xPos = (e.clientX - hoverImage.offsetLeft) * 0.1;
        let yPos = (e.clientY - hoverImage.offsetTop) * 0.1;

        hoverImage.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
      }
    }
  }
}

function aboutSectionsHover() {
  //only for the 2 cols
  let sections = document.querySelectorAll(".about-two-col");

  sections.forEach(function (el) {
    el.addEventListener("mouseover", () => {
      el.classList.add("active");
    });

    el.addEventListener("mouseleave", () => {
      el.classList.remove("active");
    });
  });
}

/** SEARCH */
function searchIconHandler(event) {
  let resetButton = document.querySelector(".search-reset");

  event.preventDefault();
  resetButton.click();
}

function searchEnter() {
  //so the transition animation works on refresh too
  setTimeout(function () {
    document.querySelector(".search-input__wrapper").classList.add("active");

    setTimeout(function () {
      document.getElementById("search").focus();
    }, 600);

    /* change behavior of search icon*/
    document
      .querySelector(".navbar__search")
      .addEventListener("click", searchIconHandler);
  }, 800);
}

function search() {
  // prevent form submit
  $("#search-form").submit(function () {
    return false;
  });

  let projectResults = document.querySelector('[data-search="projects"]'), //wrapper para onde vÃ£o os match de projectos
    objectsResults = document.querySelector('[data-search="objects"]'), //wrapper para onde vÃ£o os match de objetos
    artworksResults = document.querySelector('[data-search="artworks"]'), //wrapper para onde vÃ£o os match de artworks
    searchInput = document.getElementById("search"); //o input

  gsap.set(".search-empty", { autoAlpha: 0 }); // oculta a linha de 0 results
  gsap.set(projectResults, { display: "none", autoAlpha: 0 }); //oculta o wrapper dos projetos
  gsap.set(objectsResults, { display: "none", autoAlpha: 0 }); //oculta o wrapper dos objects
  gsap.set(artworksResults, { display: "none", autoAlpha: 0 }); //oculta o wrapper dos artworks
  gsap.set(".search-result-col", { display: "none", autoAlpha: 0 });

  // attach event listeners for input changes
  let typingTimeout;

  searchInput.addEventListener("keydown", function () {
    //faz trigger do search no keydown apÃ³s 1seg
    clearTimeout(typingTimeout); //clear existing timeout

    typingTimeout = setTimeout(function () {
      searchItems();
    }, 1000);
  });

  function searchItems() {
    //funÃ§Ã£o para o search em si
    document.activeElement.blur();

    document.querySelector(".search").classList.add("searched");
    gsap.to(".search-empty", { autoAlpha: 0, duration: 0.3 }); //de cada vez que faÃ§o search quero ocultar o empty state

    let searchTerm = searchInput.value.toLowerCase(); //vai buscar o valor que o user escreveu no input e coloca em minÃºsculas

    if (searchTerm === "") {
      //se o input tiver vazio Ã© pq Ã© para fazer um reset
      resetSearch();
      return;
    }

    let filterItems = document.querySelectorAll(".search-result-col");
    let matchedTimeline = gsap.timeline({ paused: true });

    filterItems.forEach(function (item) {
      let project = item.getAttribute("data-search-name").toLowerCase(); //nome do projeto
      let client = item.getAttribute("data-search-client"); //nome do cliente

      if (searchTerm !== "") {
        //existe algo no input? ...
        client = client ? client.toLowerCase() : ""; //check if client exists and, if so, convert it to lowercase for comparison

        if (client.includes(searchTerm) || project.includes(searchTerm)) {
          //o search term faz parte de um cliente ou nome de projeto?
          gsap.set(item, { display: "block" });

          matchedTimeline.to(item, {
            autoAlpha: 1,
            duration: 0.2,
          });

          item.setAttribute("data-visibility", "visible");
        } else {
          if (item.getAttribute("data-visibility") == "visible") {
            //se o item jÃ¡ tiver visibilidade e nÃ£o corresponder, oculta
            gsap.set(item, { display: "none" });
            gsap.to(item, { autoAlpha: 0, duration: 0.3 });
            item.setAttribute("data-visibility", "hide");
          }
        }
      }
    });

    // check if there are results
    let searched = document
        .querySelector(".search")
        .classList.contains("searched"),
      projectsCount = projectResults.querySelectorAll(
        '.search-result-col[data-visibility="visible"]'
      ).length, //quantos projetos fizeram match?
      objectsCount = objectsResults.querySelectorAll(
        '.search-result-col[data-visibility="visible"]'
      ).length, //quantos objects fizeram match?
      artworksCount = artworksResults.querySelectorAll(
        '.search-result-col[data-visibility="visible"]'
      ).length, //quantos artworks fizeram match?
      projectsText = projectResults.querySelector(".search-results__count"),
      objectsText = objectsResults.querySelector(".search-results__count"),
      artworksText = artworksResults.querySelector(".search-results__count");

    if (searched && projectsCount > 0) {
      //se tiver searched e existirem projetos com match
      gsap.set(projectResults, { display: "block" });
      gsap.to(projectResults, { autoAlpha: 1, duration: 0.3 }); //isto Ã© a seÃ§Ã£o wrapper de todos os projectos
      projectResults.setAttribute("data-visibility", "visible");

      matchedTimeline.play();

      if (projectsCount == 1) {
        projectsText.innerHTML = "1 result";
      } else {
        projectsText.innerHTML = projectsCount + " results";
      }
    }

    if (searched && objectsCount > 0) {
      //se tiver searched e existirem objects com match
      gsap.set(objectsResults, { display: "block" });
      gsap.to(objectsResults, { autoAlpha: 1, duration: 0.3 }); //isto Ã© a seÃ§Ã£o wrapper de todos os objects
      objectsResults.setAttribute("data-visibility", "visible");

      matchedTimeline.play();

      if (objectsCount == 1) {
        objectsText.innerHTML = "1 result";
      } else {
        objectsText.innerHTML = objectsCount + " results";
      }
    }

    if (searched && artworksCount > 0) {
      //se tiver searched e existirem artworks com match
      gsap.set(artworksResults, { display: "block" });
      gsap.to(artworksResults, { autoAlpha: 1, duration: 0.3 }); //isto Ã© a seÃ§Ã£o wrapper de todos os artworks
      artworksResults.setAttribute("data-visibility", "visible");

      matchedTimeline.play();

      if (artworksCount == 1) {
        artworksText.innerHTML = "1 result";
      } else {
        artworksText.innerHTML = artworksCount + " results";
      }
    }

    // Hide sections with no results
    if (searched && projectsCount == 0) {
      gsap.set(projectResults, { display: "none" });
      gsap.to(projectResults, { autoAlpha: 0, duration: 0.3 });
      projectResults.setAttribute("data-visibility", "hide");
    }

    if (searched && objectsCount == 0) {
      gsap.set(objectsResults, { display: "none" });
      gsap.to(objectsResults, { autoAlpha: 0, duration: 0.3 });
      objectsResults.setAttribute("data-visibility", "hide");
    }

    if (searched && artworksCount == 0) {
      gsap.set(artworksResults, { display: "none" });
      gsap.to(artworksResults, { autoAlpha: 0, duration: 0.3 });
      artworksResults.setAttribute("data-visibility", "hide");
    }

    // Show empty state if no results in any category
    if (
      searched &&
      projectsCount == 0 &&
      objectsCount == 0 &&
      artworksCount == 0
    ) {
      animateEmpty();
    }
  }

  // reset button
  document
    .querySelector(".search-reset")
    .addEventListener("click", function () {
      resetSearch();
      window.history.back();
    });

  // empty animation
  function animateEmpty() {
    gsap.to(".search-empty", { autoAlpha: 1 });

    let emptyTl = gsap.timeline(),
      emptyResults = new SplitText(".search-empty__results", {
        type: "words,chars",
      }),
      emptyText = new SplitText(".search-empty__span", { type: "words" }),
      chars = emptyResults.chars,
      words = emptyText.words;

    emptyTl
      .from(chars, {
        duration: 0.2,
        opacity: 0,
        ease: "none",
        stagger: 0.1,
      })
      .from(words, {
        duration: 0.8,
        x: 40,
        opacity: 0,
        ease: Power2.easeOut,
        stagger: 0.1,
      });
  }

  // reset search
  function resetSearch() {
    document.querySelector(".search-input").value = ""; //clear input
    document.querySelector(".search").classList.remove("searched");
    gsap.to(".search-empty", { autoAlpha: 0, duration: 0.2 });

    let activeElements = document.querySelectorAll(
      '.search-result-col[data-visibility="visible"]'
    );

    activeElements.forEach((el) => {
      gsap.to(el, {
        autoAlpha: 0,
        duration: 0.3,
        onComplete: function () {
          gsap.set(el, { display: "none" });
          el.setAttribute("data-visibility", "hide");
        },
      });
    });

    gsap.to(projectResults, {
      autoAlpha: 0,
      duration: 0.3,
      onComplete: function () {
        gsap.set(projectResults, { display: "none" });
        projectResults.setAttribute("data-visibility", "hide");
      },
    });

    gsap.to(objectsResults, {
      autoAlpha: 0,
      duration: 0.3,
      onComplete: function () {
        gsap.set(objectsResults, { display: "none" });
        objectsResults.setAttribute("data-visibility", "hide");
      },
    });

    gsap.to(artworksResults, {
      autoAlpha: 0,
      duration: 0.3,
      onComplete: function () {
        gsap.set(artworksResults, { display: "none" });
        artworksResults.setAttribute("data-visibility", "hide");
      },
    });
  }
}

/* ERROR */
function errorPage() {
  let currentYear = new Date().getFullYear();

  let errorDate = document.querySelector(".error-date"),
    errorYear = document.querySelector(".error-year"),
    errorSlug = document.querySelector(".error-slug");

  let todaysDate = new Date();
  errorDate.textContent = todaysDate.toISOString().split("T")[0];

  errorYear.textContent = currentYear;
  errorSlug.textContent = window.location.href;

  let errorTl = gsap.timeline(),
    errorLines = document.querySelectorAll(
      ".error-info [data-animation=stagger]"
    );

  gsap.set(".error-info", { opacity: 1 });

  errorTl.from(errorLines, {
    duration: 0.4,
    display: "none",
    ease: "none",
    stagger: 0.1,
    onComplete: function () {
      if (window.matchMedia("(min-width: 992px)").matches) {
        document.querySelector(".error-form_input input").focus();
      }
    },
  });
}

/** ARTWORKS */
function artworksSetInitialState() {
  const elements = document.querySelectorAll("[data-fade-in]");
  gsap.set(elements, { clearProps: "all" });
  gsap.set(elements, { autoAlpha: 0, y: 40 });
}

function artworksFitText() {
  // Add a delay to ensure DOM is ready after Barba transition and cleanup
  setTimeout(() => {
    const h1 = document.querySelector("h1");
    const container = document.querySelector("#container");

    if (h1 && container) {
      // Force text into one line
      h1.style.whiteSpace = "nowrap";

      // Hide text during fitting
      gsap.set(h1, { autoAlpha: 0 });

      let fontSize = 0;
      h1.style.fontSize = fontSize + "px";

      const containerWidth = container.offsetWidth;
      let textWidth = h1.offsetWidth;

      // Grow until it overflows
      while (textWidth < containerWidth && fontSize < 1000) {
        fontSize += 4;
        h1.style.fontSize = fontSize + "px";
        textWidth = h1.offsetWidth;
      }

      // Step back one increment so it fits
      fontSize -= 4;
      h1.style.fontSize = fontSize + "px";

      // Show text after fitting
      gsap.to(h1, {
        autoAlpha: 1,
        duration: 0.6,
        ease: "blinking-line",
      });
    }
  }, 500); // Delay to ensure DOM is ready after transition and cleanup
}

function artworksContentFadeIn() {
  gsap.to('.artworks-content', {
    autoAlpha: 1,
    duration: 1,
    ease: "power4",
  });
}

function firstArtworkFadeIn() {
  const elements = document.querySelectorAll("[data-fade-in]");

  // Load the first element immediately
  if (elements.length > 0) {
    gsap.to(elements[0], {
      autoAlpha: 1,
      y: 0,
      duration: 1,
      ease: "power4",
      delay: 0.5,
      before: function () {
        let artworksContent = document.querySelector(".artworks-content");
        if (artworksContent) {
          artworksContent.style.opacity = "1";
        }
      },
    });
  }
}

function artworksFadeIn() {
  setTimeout(() => {
    //wait for the barbajs finish the transition
    const elements = document.querySelectorAll("[data-fade-in]");

    elements.forEach((el, index) => {
      // Skip first element
      if (index === 0) return;
  
      gsap.to(el, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power4",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
        },
      });
    });
  
    ScrollTrigger.refresh();
  }, 1000);
}

function artworksMarquee() {
  const wrap = gsap.utils.wrap(0, 1);
  
  // Reset and clean existing marquees for Barba transitions
  document.querySelectorAll(".marquee-wrapper").forEach((wrapper) => {
    // Kill existing animation if it exists
    if (wrapper.animation) {
      wrapper.animation.kill();
      wrapper.animation = null;
    }

    // Kill existing draggable if it exists
    if (wrapper.draggable) {
      wrapper.draggable.kill();
      wrapper.draggable = null;
    }

    // Remove cloned marquees (keep only the first one)
    const marquees = wrapper.querySelectorAll(".marquee");
    for (let i = 1; i < marquees.length; i++) {
      marquees[i].remove();
    }

    // Reset transforms
    gsap.set(wrapper.querySelector(".marquee"), { clearProps: "all" });
  });

  // Clone marquees dynamically based on viewport width
  const wrappers = gsap.utils.toArray(".marquee-wrapper");

  wrappers.forEach((wrapper) => {
    const marquee = wrapper.querySelector(".marquee");
    const style = window.getComputedStyle(marquee);
    const marginRight = parseFloat(style.marginRight) || 0;
    const marginLeft = parseFloat(style.marginLeft) || 0;
    const wrapperStyle = window.getComputedStyle(wrapper);
    const gap = parseFloat(wrapperStyle.gap) || 0;
    const box = marquee.getBoundingClientRect();
    const marqueeWidth = box.width;
    
    // Calculate full width of one item including spacing
    let totalDistance = marqueeWidth + marginRight + marginLeft + gap;
    
    // Safety check
    if (!totalDistance) return;

    wrapper.isInView = false;

    // Calculate how many clones we need to fill the screen + buffer
    // Increased buffer to ensure fast swipes never run out of content
    const clonesNeeded = Math.ceil(window.innerWidth / totalDistance) + 4;
    
    // Create clones
    for (let i = 0; i < clonesNeeded; i++) {
      wrapper.appendChild(marquee.cloneNode(true));
    }

    // Get all elements (original + clones)
    const allMarquees = wrapper.querySelectorAll(".marquee");

    // Create the animation - animate ALL marquee elements
    // We still move by totalDistance (one item width) because that's when the pattern repeats
    const anim = gsap.to(allMarquees, {
      x: -totalDistance,
      duration: 70,
      ease: "none",
      repeat: -1,
      paused: true,
      overwrite: "auto"
    });

    // Store the animation on the element
    wrapper.animation = anim;

    // Create a container div to make draggable (proxy element)
    let proxy = document.createElement("div");
    // Append to wrapper and style it to cover the area
    wrapper.appendChild(proxy);
    gsap.set(proxy, { 
      position: "absolute", 
      top: 0, 
      left: 0, 
      width: "100%", 
      height: "100%", 
      zIndex: 10,
      opacity: 0 // Invisible but clickable
    });
    
    wrapper.draggable = Draggable.create(proxy, {
      type: "x",
      trigger: wrapper,
      inertia: true,
      throwResistance: 2000,
      maxDuration: 0.5,
      dragResistance: 0.4,
      onPressInit: function() {
        anim.pause();
        gsap.killTweensOf(anim);
        anim.timeScale(1); // Reset timescale to normal in case it was tweening

        // Sync proxy position with current animation progress
        let currentProgress = anim.progress();
        let newX = -currentProgress * totalDistance;
        
        gsap.set(proxy, { x: newX });
        this.update();
      },
      onDrag: function() {
        let prog = wrap(-this.x / totalDistance);
        anim.progress(prog);
      },
      onThrowUpdate: function() {
        let prog = wrap(-this.x / totalDistance);
        anim.progress(prog);
      },
      onThrowComplete: function() {
        if (wrapper.isInView) {
          anim.play();
          // Smoother resume
          gsap.fromTo(anim, { timeScale: 0 }, { duration: 1, timeScale: 1, ease: "power2.out" });
        }
      }
    })[0];
    
    // Force overflow hidden to prevent native scroll limits
    wrapper.style.overflow = "hidden";
    
    // Add wheel listener for trackpad/mousewheel support
    wrapper.addEventListener("wheel", (e) => {
      // Check if scroll is primarily horizontal
      // distinct from vertical page scroll
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);

      if (isHorizontal) {
        e.preventDefault();
        
        // Calculate progress change based on scroll delta
        const delta = e.deltaX;
        const progressChange = delta / totalDistance;
        
        // Update animation progress
        const currentProg = anim.progress();
        const newProg = wrap(currentProg + progressChange);
        
        // Pause animation while scrolling manually
        anim.pause();
        anim.progress(newProg);
        gsap.killTweensOf(anim);
        
        // Debounce resume
        clearTimeout(wrapper.wheelTimeout);
        wrapper.wheelTimeout = setTimeout(() => {
          if (wrapper.isInView) {
             anim.play();
             gsap.fromTo(anim, { timeScale: 0 }, { duration: 1, timeScale: 1, ease: "power2.out" });
          }
        }, 100);
        
        // Update proxy to match new visual state
        const newX = -newProg * totalDistance;
        gsap.set(proxy, { x: newX });
        wrapper.draggable.update();
      }
      // If vertical, do nothing and let event bubble for native page scroll
      
    }, { passive: false });
  });

  // Use batch to create ScrollTriggers for each wrapper
  ScrollTrigger.batch(wrappers, {
    start: "top bottom",
    end: "bottom top",
    onEnter: (batch) => {
      batch.forEach((wrapper) => {
        wrapper.isInView = true;
        if (wrapper.animation) {
          wrapper.animation.play();
        }
      });
    },
    onLeave: (batch) => {
      batch.forEach((wrapper) => {
        wrapper.isInView = false;
        if (wrapper.animation) {
          wrapper.animation.pause();
        }
      });
    },
    onEnterBack: (batch) => {
      batch.forEach((wrapper) => {
        wrapper.isInView = true;
        if (wrapper.animation) {
          wrapper.animation.play();
        }
      });
    },
    onLeaveBack: (batch) => {
      batch.forEach((wrapper) => {
        wrapper.isInView = false;
        if (wrapper.animation) {
          wrapper.animation.pause();
        }
      });
    },
  });
}
