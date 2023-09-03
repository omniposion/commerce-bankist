'use strict';
// SELECTION
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');
////////////////////////////////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
console.log(btnsOpenModal);

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// same as this ↑↑↑
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

// btnCloseModal.addEventListener('click', closeModal);
// overlay.addEventListener('click', closeModal);

btnCloseModal.addEventListener('click', closeModal); // close modal when x is clicked
overlay.addEventListener('click', closeModal); // close modal when overlay is clicked

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
}); // close modal when Escape is clicked

// Button scrolling
btnScroll.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect(); // get coordinates of the element
  console.log(s1coords);
  //console.log('Current scroll X/Y', window.pageXOffset, pageYOffset);
  // console.log(
  //   'width/height viewport',
  //   document.documentElement.clientWidth,
  //   document.documentElement.clientHeight
  // );

  // Scrolling to coordinates
  // coordinates are relative to the viewport not to the entire page, to fix it + window.pageXOffset to left, to top + window.pageYOffset
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // New and best way to scroll - only works in modern browsers
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page navigation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href'); // href = #section--1
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });
// Best way is to use bubbling phase, and select the parent element (.nav__links)instead of all the elements with forEach, USING event delegation
// 1. Add event listener to acommon parent element of all the elements we're interested in, (.nav__links) in this case
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // 2. Determine from what element the event originated from
  //console.log(e.target);
  // Matching strategy(hardest part of event delegation)
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href'); //
    //console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
// With event delegation you can handle events on elements that don't currently exists by selecting the right parent scope

// Tabbed  component

tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');
  // Guard clause null is falsy, so clicked is false when clikd outside the buttons

  if (!clicked) return;
  //  Remove active classes(tabs) and show active
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');
  // Activate content area & hide previous classes(tabs)
  tabsContent.forEach(cont =>
    cont.classList.remove('operations__content--active')
  );
  console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation, pass argu

const handleFade = function (e) {
  //console.log(this);
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');

    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// Passing additional 'argument' into a handler function using bind + this, workaround into the fact that the event handler can only take one argument
// Use bind, sets 'this' keyword to the manually provided value(0.5)
nav.addEventListener('mouseover', handleFade.bind(0.5));
// Use bind, sets 'this' keyword to the manually provided value(1), instead of regular this
nav.addEventListener('mouseout', handleFade.bind(1));

// Sticky Navigation (Intersection Observer API)

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
//console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, //height of navigaton
}); // when 0 percentof header is visible, then we want an event to happenj
headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObeserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObeserver.observe(section);
  //section.classList.add('section--hidden');
});

// Lazy Loading Images
// Great for performance, because images are the heaviest to load
const imgTargets = document.querySelectorAll('img[data-src]');
console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '30px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider

//Slider components
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let currentSlide = 0;
  const maxSlides = slides.length - 1;

  // Slider Functions

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const highlightDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (currentSlide === maxSlides) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }

    goToSlide(currentSlide);
    highlightDot(currentSlide);
  };

  // Previous slide
  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlides;
    } else {
      currentSlide--;
    }

    goToSlide(currentSlide);
    highlightDot(currentSlide);
  };

  const init = function () {
    createDots();
    goToSlide(0);
    highlightDot(0);
  };

  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    console.log(e);
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      highlightDot(slide);
    }
  });
};
slider();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// REFERENCE LECTURES
// Selecting, Creating, Deleting Elements
/*
// Selecting elements
// Select the entire document, entire page ↓↓↓
console.log(document.documentElement);
// Select the entire document head ↓↓↓
console.log(document.head);
// Select the entire document body ↓↓↓
console.log(document.body);
// For these elements we don't need a selector ↑↑↑

const header = document.querySelector('.header'); // selects the first element that matches the class of 'header'
const allSections = document.querySelectorAll('.section'); // selects all the elements that match the class of 'section'
console.log(allSections); // logs a nodelist of all elements

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button'); // selects all elements with the name: 'button', returns an HTML Collection instead of a NodeList
console.log(allButtons);
// HTML collection is updated automatically in realtime, if you delete a button it will be deleted from the collection as well
// NodeList is not updated automatically, once you delete an element it stays in the NodeList
console.log(document.getElementsByClassName('btn')); // selects all the classes with 'btn', also returns a HTML collectio

// Creating and inserting elements
// .insertAdjecentHTML()
const message = document.createElement('div'); // creates a dom element 'div', its not yet on the page, to add it we have to insert it manually
message.classList.add('cookie-message'); // adds the class of 'cookie-message' to the element
//message.textContent = 'Use cookies for improved functionality and analytics'; // inserts text
message.innerHTML =
  'Use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

//header.prepend(message); // add the element as the first child of header element
header.append(message); // add the element as the last child of header element, it's only inserted the element once, as prepend to insert it and append to move it to the last child
//header.append(message.cloneNode(true)); // add another clone of the element
//header.before(message); // adds the message before the header element, so as a sibling not as a child
//header.after(message); // adds the message after the header element, as a sibling

// Delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove(); // deletes the message element, once it's clicked anywhere
    // old way of removing elements↓↓↓
    // message.parentElement.removeChild(message);
  });

// Styles, Attributes, Classes

// Styles
// Set the styles inline
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

// Read the styles
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height = getComputedStyle(message).height + 40 + 'px';

// root is equivalent to documentElement

// change custom properties like --color-primary variable in css
document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.src); // select the src attribute from .nav__logo class element
console.log(logo.alt); // select the alt attribute
console.log(logo.className); // prints the class name of the element: 'nav__logo'

// Change attributes
logo.alt = 'Beatiful minimalist logo';

// Non-standard attributes
console.log(logo.designer); // undefined since designer is not a standard attribute
console.log(logo.getAttribute('designer')); // shows the value of designer attribute
console.log(logo.setAttribute('company', 'bankist')); // adds the attribute company with value bankist

console.log(logo.src); // absolute path
console.log(logo.getAttribute('src')); // relative path

const link = document.querySelector('.btn--show-modal');
console.log(link.href);
console.log(link.getAttribute('href'));

// Data attributes
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add('c', 'j'); // add
logo.classList.remove('c');
logo.classList.toggle('classname', 'classname2');
logo.classList.contains('c');

// Don't use
// logo.className = 'jonas' overries any classes


// Smooth scroll to a section

const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScroll.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect(); // get coordinates of the element
  console.log(s1coords);
  //console.log('Current scroll X/Y', window.pageXOffset, pageYOffset);
  // console.log(
  //   'width/height viewport',
  //   document.documentElement.clientWidth,
  //   document.documentElement.clientHeight
  // );

  // Scrolling to coordinates
  // coordinates are relative to the viewport not to the entire page, to fix it + window.pageXOffset to left, to top + window.pageYOffset
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // New and best way to scroll - only works in modern browsers
  section1.scrollIntoView({ behavior: 'smooth' });
});

const alertH1 = function (e) {
  alert('addEventListener: You are reading the heading');
};

const h1 = document.querySelector('h1');
h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// h1.onmouseenter = function (e) {
//   alert('onmouseenter: You are reading the heading');
// };
// .addEventListener() is better because we can add multiple event listeners to the same event
// .addEventListener() is better becuase we can actually remove an event handler if don't need it anymore

// Event Propagation
// rgb(255,255,255)
// .addEventListener is only listening to events in the bubbling phase, not the capturing phase(capturing is not that relevant)
// However, we can define a third parameter in the .addEventListener(1st,2nd(), 3rd), set the 3rd paramater to true to listen in capturing phase
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  // this points to the element on which event handler is attached
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  console.log(this === e.currentTarget); // true

  // Stop propagtion - the event never arrives to its parents elemets, usually not a good idea
  //e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});
// Clicking on the nav__link triggers all three eventListeners, because they are its parents, so the event originates from the link, then it bubbles up to its parent element nav__links, then it bubbles up to .nav, then all the way up to the root document of the DOM tree

// DOT IS FOR CLASS .class .class .class

// DOM Traversing(moving through)
// querySelector works on elements and classes and ids

const h1 = document.querySelector('h1');

// Going downwards: child
console.log(h1.querySelectorAll('.highlight'));
// Selects all the children elemtents of h1 with the classname of 'highlight', no matter how deep
console.log(h1.childNodes);
console.log(h1.children); // works for direct children
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'darkblue';

// Going upwards: parents
console.log(h1.parentNode); // direct parent only
console.log(h1.parentElement);

//h1.closest('.header').style.background = 'var(--gradient-secondary)'; // selects the closest parent elemnt with  .header

// Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);
// all siblings including self
console.log(h1.parentElement.children);

[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(1.0)';
});

// Sticky navigation (Navigation is attached to the top of the page after scrolling to a certain point)
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);
// // scroll event, not really efficient because it calls for too many events, which makes for a bad performance and loads the cpu, very bad for mobiles
// window.addEventListener('scroll', function () {
//   console.log(window.scrollY); // shows the height as we scroll, relative to viewport
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.clasList.remove('sticky');
//   }
// });
// Sticky navigation (Intersaction API)
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null, // viewport
//   threshold: [0, 0.2], // out of viewporrt[0], 20% in viewport[0.2]
// };

// // function gets called once the observed element(section1), intersects the root element(viewport) at 10%(threshold: 0.1), no matter if scrolling up or down
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

*/

// DOMContentLoaded is an event that fires when HTML(without pics) + JS is completely loaded
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built', e);
});
// document.ready Jquery - is equivalent to the DOMContent loaded in vanilla JS

// Load event is fired when all HTML + imgages and external resources + CSS files
window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// beforeunload event is fired immediately before a user leaves the page
// exampled: after clicking the close(x) button in the browser tab

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault(); // is necessary for most browser, but not chrome
//   console.log(e);
//   e.returnValue = '';
// });
// use 'beforeunload" only when the user is the risk of losing data, writing blog, etc...

// DEFER & ASYNCH SCRIPT LOADING
// Instead of addding regular: <script src="script.js"> at the end of the file for the best performance, use async <script async src="script.js"> in the head at the top of the HTML document, so the parsing of HTML and fetching of the script.JS happens asynchronously at the same time, then script execution stops the HTML parsing while it waits to end, afterwards the HTML continues the parsing and finally ends.
// It's similar with defer <script async src="script.js">, the main difference is that defer delays the script execution until the end of HTML parsing, and therefore avoids the breaking of HTML parsing.
// Seems like defer is the most optimal solution

// 3 SCRIPT LOADING SOLUTIONS
//1. END OF BODY <script src="script.js"> - REGULAR SCRIPT <script  src="script.js"> - Scripts are fetched and exectued after the HTML parsing compeltes. For old browsers regular END OF BODY is the best.
//2. ASYNC IN HEAD <script async src="script.js"> - Scripts are fetched and exectued simultaneously and execution is immediate, breaking the HTML parsing process. DOMContentLoaded event waits for all scripts to execute, except for async script.js.  Async scripts are not guranteed to be executed in the correct order they we're written
// 3. DEFER IN HEAD <script defer src="script.js">, scripts are fetched asynchronously with HTML parsing and script execution happens after the HTML is completely parsed. Defer scripts are guranteed to be executed in the correct order. DEFER IS THE BEST SOLUTION FOR MY OWN SCRIPTS & WHEN ORDER MATTERS, LIKE FOR A LIBRARY
