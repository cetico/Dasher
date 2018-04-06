import first from 'lodash/first';
import last from 'lodash/last';
import throttle from 'lodash/throttle';


/**
 * @constructor
 * @param {Object} opts options. 
 * @param {String} opts.root REQUIRED. The wrapper DOM element.
 * @param {String} opts.menu OPTIONAL. the ID of custom menu DOM element. Defaults to 'menu'.
 * @param {String} opts.menuItems OPTIONAL. The className of elements of custom menu DOM element. Defaults to 'menu-item'.
 * @param {Boolean} opts.disableMenu Disables the default menu. Pass true to disable.
 * @param {String} opts.section Name of custom section className.
 * @param {Number} opts.waitTime The amount of ms to wait between section scrolls. Defaults to 1000.
 * @param {Number} opts.maxScrollSpeed The maximum scrollspeed which is set for browser consistency. Defaults to 10.
 * @param {Boolean} opts.loopScroll Enables continuous scrolling. Jumps to first section if scrolling down at last section.
 */
const Dasher = function(opts = {}) {
  
  if(!opts) {
    throw new Error('Please pass options object to Dasher.')
  }
  if(typeof opts !== 'object') {
    throw new Error(`Invalid argument type: ${typeof opts}. Expected: Object. Make sure you pass options as Object.`)
  }
  if(!opts.root) {
    throw new Error('Options.root is not defined. Please pass required ID of root element to options.root.');
  }
  if(typeof opts.root !== 'string') {
    throw new Error(`Invalid root type: ${typeof opts.root}. Expected: String. Make sure you pass the ID of root element to options.root.`)
  } 

  const state = new function() {
    this.PAGE_ID         = opts.root || 'page';
    this.PAGE            = document.getElementById( this.PAGE_ID );
    this.MENU_ID         = opts.menu || 'menu';
    this.MENU            = document.getElementById( this.MENU_ID );
    this.MENU_ITEMS_CLASS= opts.menuItems || 'menu-item';
    this.MENU_ITEMS      = document.getElementsByClassName( this.MENU_ITEMS_CLASS );
    this.ACTIVE_ITEM     = first(this.MENU_ITEMS);
    this.MENU_DISABLED   = opts.disableMenu || false;
    this.SECS_CLASS      = opts.section || 'section';
    this.SECS            = document.getElementsByClassName( this.SECS_CLASS );
    this.ACTIVE_SEC      = first(this.SECS);
    this.WAIT_TIME       = opts.waitTime || 1000;
    this.PREV_TIME       = Date.now();
    this.MAX_SCROLLSPEED = opts.maxScrollSpeed || 10;
    this.LOOP_SCROLL     = opts.loopScroll || false;
    this.SCROLL_HISTORY  = [];
    this.listeners       = {};
  };
  
  
  (function init() {
    console.log(state.ACTIVE_ITEM)
    
    state.ACTIVE_SEC.classList.add('active');
    state.ACTIVE_ITEM.classList.add('active');
    state.PAGE.style.transition = `all ${state.WAIT_TIME / 1000}s ease`;
    


    state.listeners.wheel = window.addEventListener('wheel', throttle(handleWheel, 10));
  })();

  function handleWheel(e) {
      if(isOverflowSection(state.ACTIVE_SEC, e)) {
       return handleScroll(state.ACTIVE_SEC, e)
     } else {
       updateScrollHistory(e.deltaY);
       if(!isAccelerating(state.SCROLL_HISTORY) && isEnoughTimePassed(Date.now())) {
         state.SCROLL_HISTORY = [];
         return e.deltaY < 0 ? handleSectionChange(1) : handleSectionChange(-1);
       }
     }
  }
  
  function isAccelerating(scrollHistory) {
    const end = getAverage(scrollHistory, 10);
    const average = getAverage(scrollHistory, 70);
    return end <= average;
  }
  
  
  function updateScrollHistory(deltaY) {
    if(state.SCROLL_HISTORY.length > 150) state.SCROLL_HISTORY.shift();
    state.SCROLL_HISTORY.push(Math.abs(deltaY));
  }

  function getAverage(elements, number){
    let sum = 0;
    let lastElements = elements.slice(Math.max(elements.length - number, 1));
    for(let i = 0; i < lastElements.length; i++){
        sum = sum + lastElements[i];
    }
    return Math.ceil(sum/number);
}

  function isEnoughTimePassed(time) {
    const passed = time - state.PREV_TIME;
    if(passed > state.WAIT_TIME) {
      state.PREV_TIME = Date.now();
      return true;
    }
    else return false;
  }
  
  function isOverflowSection(activeSection, e) {
    const height = Math.floor(activeSection.offsetHeight - 1);
    if(height > window.innerHeight && !isAtEdges(activeSection, height, e)) {
      return true;
    } else {
      return false;
    }
  }
  
  function getMatrixHeight(matrix) {
    return Number(last(matrix.split(',')).replace(')', ''));
  }
  
  
  function isAtEdges(activeSection, height, e) {
    const inner = activeSection.getElementsByClassName('inner')[0];
    const matrix = window.getComputedStyle(inner).transform;
    const matrixHeight = getMatrixHeight(matrix)  - Number(e.deltaY);
    
    // Matrix style property starts as 'none' untill first transform applied.
    if(matrix === 'none') {
      inner.style.transform = `matrix(1, 0, 0, 1, 0, 0)`;
      return false;
    }
    
    const scrolling = (height + matrixHeight) - window.innerHeight;
    
    //at top.
    if(scrolling < 0) {
      return true;
    }
    // at bottom.
    else if(matrixHeight > 0) { 
      inner.style.transform = `matrix(1, 0, 0, 1, 0, 0)`;
      return true;
    }
    // not at edges.
    else {
      return false;
    }
  }
  
  
  function handleScroll(activeSection, e) {
    
    const inner = activeSection.getElementsByClassName('inner')[0];
    const matrix = window.getComputedStyle(inner).transform;
    const direction = e.deltaY < 0 ? -1 : 1;
    
    // Matrix style property starts as 'none' untill first transform applied.  
    if(matrix === 'none') {
      return inner.style.transform = `matrix(1, 0, 0, 1, 0, ${e.deltaY})`;
    } else {
      
      //absolute value. So -2 and 2 both become 2. We need it 
      //because else it will affect scrollspeed based on moving up or down.
      const abs = Math.abs(e.deltaY);
      
      //To normalize max-scrollspeed across browsers. Especially Chrome vs Firefox.
      // Direction converts it to pre Math.abs() state so we can still scroll up/down based on negative or positive deltaY. 
      const moveY = Math.min(Math.max(parseInt(abs), 1), state.MAX_SCROLLSPEED) * direction;
      
      
      const matrixHeight = getMatrixHeight(matrix)  - Number(moveY);
      inner.style.transform = `matrix(1, 0, 0, 1, 0, ${matrixHeight})`;
    }
  } 
  
  
  function handleSectionChange(int) {
    
    const selector = int === 1 ? 'previousElementSibling' : 'nextElementSibling';
    let nextSection = state.ACTIVE_SEC[ selector ]; 
    let nextItem = state.ACTIVE_ITEM[ selector ];
    
    if(!nextSection && !state.LOOP_SCROLL) {
      return;
    }
    else {
      
      if(!nextSection) {
        const firstOrLast = int === 1 ? last : first;
        nextSection = firstOrLast(state.SECS);
        nextItem = firstOrLast(state.MENU_ITEMS);
      }

      const inner = state.ACTIVE_SEC.getElementsByClassName('inner')[0];
      inner.style.transform = `matrix(1,0,0,1,0,1)`;    
      setMenuActive(nextItem);
      setActive(nextSection);
      moveToActive(state.ACTIVE_SEC);
    }
  }
  
  function setMenuActive(nextItem) {
    state.ACTIVE_ITEM.classList.remove('active');
    state.ACTIVE_ITEM = nextItem;
    state.ACTIVE_ITEM.classList.add('active');
    
    // LATER
    return state.ACTIVE_ITEM;
  }
  
  function setActive(nextSection) {
    state.ACTIVE_SEC.classList.remove('active');
    state.ACTIVE_SEC = nextSection;
    state.ACTIVE_SEC.classList.add('active');
    
    // LATER
    return state.ACTIVE_SEC;
  }
  
  function moveToActive(activeSection) {
    state.PAGE.style.transform = `translate3d(0, -${activeSection.offsetTop}px, 0)`;
  }
  
}
  
export default Dasher