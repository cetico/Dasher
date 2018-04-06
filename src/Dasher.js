import _ from "lodash";

class Dasher {

  constructor(opts = {}) {
    this.DASHER_NAME      = opts.dasher || "dasher";
    this.DASHES_NAME      = opts.dash || "dash";
    this.DASHER           = document.getElementById( this.DASHER_NAME );
    this.DASHES           = document.getElementsByClassName( this.DASHES_NAME );
    this.DASH_SPEED       = opts.DashSpeed || 700;
    this.DASH_TRANSITION  = opts.DashTransition || 'ease';
    this.onWheel          = this.onWheel.bind(this);
    this.LOOP_DASHING     = opts.loopDashing || false;
    this.MAX_SCROLLSPEED  = opts.maxScrollSpeed || 15;
    this.STD_MENU         = opts.stdMenu || true;
    // this.PHANTOM          = opts.phantomDash || true; 
    // this.PHANTOM_HANDLER  = opts.phantomHandler || false;
    this.TIMER            = Date.now();
    this.ACTIVE_DASH      = _.first(this.DASHES);
    this.SCROLL_HISTORY   = [];
    this.PHANTOM_HISTORY  = 0;
    this.TEST             = 0;

    this.PHANTOM_ENABLED  = true;
    this.PHANTOM_PROP     = 'opacity';
    this.PHANTOM_START    = true;
    this.switch           = false;
    this.done             = false;

    this.PHANTOM_HANDLER = function(dash = null, value = null) {
      if(dash && value && opts.phantomHandler) {
        return opts.phantomHandler(dash, value);
      } 
      else if (opts.phantomAnimation) {
        return this.phantomAnimation(dash, value, opts.phantomAnimation) 
      } else {
        // _default_
        return this.phantomDefaultAnimation(dash, value);
      }
    }

  }

  phantomDefaultAnimation(dash, value) {

    console.log(dash, value)
    const property = 'opacity';
    this.PHANTOM_PROP = property;
    if (this.PHANTOM_START) {
      this.PHANTOM_PRE   = dash.style[ property ];
      this.PHANTOM_START = false;
    }
    dash.style[ property ] = value;
  }

  phantomAnimation(dash, value, animation) {
    console.log('phantom Animation')
  }

  restorePhantomDash(dash) {
    setTimeout(() => {
      this.PHANTOM_START = true;
      console.log('restting dash: ', dash);
      console.log('PRE PHANTOM: ', this.PHANTOM_PRE);
      dash.style[ this.PHANTOM_PROP ] = this.PHANTOM_PRE;
      console.log('resetting...');
    }, this.DASH_SPEED);
  }

  onWheel(e) {
    this.updateScrollHistory(e.deltaY);


    
    if(this.isOverflowHandler(this.ACTIVE_DASH, e) && !this.switch) {
      return this.handleOverflowScroll(e);
      
    } else {

      if(!this.switch) {

        if(this.isAtEdges(this.ACTIVE_DASH, e)) {
          this.switch = true;
        } 
      } else if(this.switch && !this.done) {
          this.isAtBottom(this.ACTIVE_DASH, e);
          
          const x = e.deltaY > 0 ? 1 : -1;
          console.log(x);
          this.PHANTOM_HISTORY += x;
          this.handlePhantomScroll(this.ACTIVE_DASH, e);
          
          if(this.PHANTOM_HISTORY >= 100) {
            this.restorePhantomDash(this.ACTIVE_DASH);
            this.done = true;
            this.switch = false;
          }
          if(this.PHANTOM_HISTORY < 0) {
            this.switch = false;
          }
      }

       else {
         this.PHANTOM_HISTORY = 0;
         this.done = false;
         this.switch = false;
        return this.handleDash(e);
      }
      
    } 
  }
 
  
  handlePhantomScroll(dash, e) {
    const value = 1 - (this.PHANTOM_HISTORY / 100);
    this.PHANTOM_HANDLER(dash, value);
  }

  isAtTop(dash, e) {

  }

  

  isAtBottom(dash, e) {
    const inner = dash.querySelector('.inner');
    const matrix = window.getComputedStyle(inner).transform;
    const matrixHeight = this.getMatrixHeight(matrix);
    const newOffset = matrixHeight - e.deltaY;
    const innerHeight = inner.offsetHeight - window.innerHeight;
    
    // also transform inner for seamlessly connecting.
    if(innerHeight + newOffset <= 0) { //bottom
      console.log('bottom')
      // inner.style.transform = `matrix(1,0,0,1,0,${innerHeight * -1})`;
      return true;
    }
    else if ( newOffset >= 0) { //top
      // inner.style.transform = `matrix(1,0,0,1,0,1)`;
      console.log('top')
      return true;
    } else {
      return false; //overflow
    }
  }

  isPhantomHandler(dash, e) {
    
  }


  // phantomHandler(dash, e) {
  //   const inner = dash.querySelector('.inner');
  //   const matrix = window.getComputedStyle(inner).transform;
  //   const matrixHeight = this.getMatrixHeight(matrix);
  //   const newOffset = matrixHeight - e.deltaY;
  //   const innerHeight = inner.offsetHeight - window.innerHeight;

  //   const event = this.getDirection(e.deltaY);
  //   const abs = Math.abs(e.deltaY);
  //   const moveY = Math.min(Math.max(parseInt(abs), 0.5), 10) * event.modifier;
    
  //   if(innerHeight + newOffset <= 0) {

  //     this.PHANTOM_HISTORY += +moveY;
  //     console.log(this.PHANTOM_HISTORY);
  //     if(this.PHANTOM_HISTORY <= -1000) {
  //       console.log('trigger');
  //       this.PHANTOM_HISTORY = 0;
  //       this.handleDash(e);
  //     }
  //   }
  // }



  isOverflowHandler(dash, e) {
    const overflow = dash.scrollHeight > window.innerHeight;
    
    
    return overflow && !this.isAtEdges(dash, e);
  }

  isAtEdges(dash, e) {
    const inner = dash.querySelector('.inner');
    const matrix = window.getComputedStyle(inner).transform;
    const matrixHeight = this.getMatrixHeight(matrix);
    const newOffset = matrixHeight - e.deltaY;
    const innerHeight = inner.offsetHeight - window.innerHeight;
    
    // also transform inner for seamlessly connecting.
    if(innerHeight + newOffset <= 0) { //bottom
      inner.style.transform = `matrix(1,0,0,1,0,${innerHeight * -1})`;
      return true;
    }
    else if ( newOffset >= 0) { //top
      inner.style.transform = `matrix(1,0,0,1,0,1)`;
      return true;
    } else {
      return false; //overflow
    }
  }

  updateScrollHistory(deltaY) {
    if(this.SCROLL_HISTORY.length > 150) this.SCROLL_HISTORY.shift();
    this.SCROLL_HISTORY.push(Math.abs(deltaY));
  }

  getNextOffset(inner, e) {
    const event = this.getDirection(e.deltaY);
    const matrix = window.getComputedStyle(inner).transform;
    const currentOffset = this.getMatrixHeight(matrix);
    const abs = Math.abs(e.deltaY);
    const moveY = Math.min(Math.max(parseInt(abs), 0.5), this.MAX_SCROLLSPEED) * event.modifier;
    return currentOffset + moveY;
  }


  handleOverflowScroll(e) {
    const isAccelerating = this.isAccelerating(this.SCROLL_HISTORY);
    if(!this.DASHING && isAccelerating) {
      this.scrollHistory = [];
      const inner = this.ACTIVE_DASH.querySelector('.inner');    
      const newOffset = this.getNextOffset(inner, e);
      return inner.style.transform = `matrix(1,0,0,1,0,${newOffset})`;
    }
  }

  getMatrixHeight(matrix) {
    return Number(_.last(matrix.split(',')).replace(')', ''));
  }

  isAccelerating(scrollHistory) {
    const end = this.getAverage(scrollHistory, 10);
    const average = this.getAverage(scrollHistory, 30);
    return end >= average;
  }

  getAverage(elements, number) {
    let sum = 0;
    let lastElements = elements.slice(Math.max(elements.length - number, 1));
    for(let i = 0; i < lastElements.length; i++){
        sum = sum + lastElements[i];
    }
    return Math.ceil(sum/number);
  }



  handleDash(e) {
    console.log(e);
    const event    = this.getDirection(e.deltaY);
    const nextDash = this.getNextDash(this.ACTIVE_DASH, this.LOOP_DASH, event);
    
    const enoughTimePassed = this.isEnoughTimePassed(Date.now());
    
    const isAccelerating = this.isAccelerating(this.SCROLL_HISTORY);

    if( nextDash && enoughTimePassed ) {

        if( isAccelerating || this.PHANTOM_ENABLED ) {

          this.SCROLL_HISTORY = [];
          this.TIMER = Date.now();             
          
          this.setActiveDash(nextDash);
          if( this.STD_MENU ) {
            this.setActiveMenu(nextDash);
          }
          this.moveNextDash(nextDash);
        }
      }
  }

  setActiveMenu(nextDash) {
    const menu = document.querySelector(".dasher-menu")
    Array.from(this.DASHES).map((dash, index) => {
      if (dash.classList.contains('active')) {
        menu.childNodes[ index ].classList.add('active');
      } else {
        menu.childNodes[ index ].classList.remove('active');
      }
    })
    console.log(menu.childNodes);
  }

  isEnoughTimePassed(now) {
    const passed = (now - this.TIMER);
    return passed >= this.DASH_SPEED;
  }

  moveNextDash(nextDash) {
    const offsetTop = nextDash.offsetTop * -1;
    this.DASHER.style.transform = `matrix(1,0,0,1,0,${offsetTop})`;
  }

  getNextDash(dash, loopDashing, event) {
    let next; 
    const selection = event.direction === 'down'?
    {
      sibling: 'nextElementSibling',
      loopDash: _.first(this.DASHES)
    } 
    : 
    {
      sibling: 'previousElementSibling',
      loopDash: _.last(this.DASHES)
    };

    if(dash[ selection.sibling ]) {
      return dash[ selection.sibling ];
    } else {
      if (this.LOOP_DASHING) 
        return selection.loopDash;
    }
  }

  getDirection(deltaY) {
    return deltaY >= 0 ? 
    { direction: "down", modifier: -1, deltaY} 
    : 
    { direction: "up", modifier: 1, deltaY};
  }

  setDashingState() {
    this.DASHING = true;
    this.DASHER.classList.add("dashing");
    setTimeout(() => {
      this.DASHING = false;
      this.DASHER.classList.remove("dashing");
    }, this.DASH_SPEED);
  }

  setActiveDash(dash) {
    Array.from(this.DASHES)
      .forEach(el => el.classList.remove("active"));

    this.ACTIVE_DASH = dash;
    this.ACTIVE_DASH.classList.add("active");
    this.setDashingState();          
  }

  setDasherAnimation(duration, style) {
    this.DASHER.style.transition = `all ${duration / 1000}s ${style}`;
  }

  _initDashStyles() {
    Array.from(this.DASHES).forEach((dash) => {
      
      dash.style.overflow = "hidden";
      dash.style.height = "100vh";
      dash.style.width = "100%";

      const inner = dash.getElementsByClassName('inner')[0];
            inner.style.minHeight = "100vh";
            inner.style.width = "100%";
            inner.style.transform = `matrix(1,0,0,1,0,0)`;
            
    })
  }

  _initInnerDash() {
    Array.from(this.DASHES).forEach((dash) => {
      let org_html = dash.innerHTML;
      let new_html = "<div class='inner'>" + org_html + "</div>";
      dash.innerHTML = new_html;
    })
  }

  handleMenuClick(e) {

    const dash = this.DASHES[ e.target.dataset.index ];
    this.setActiveDash(dash);
    this.moveNextDash(dash);
    this.setActiveMenu(dash);
  }
  
  _initStdMenu() {
    const ul = document.createElement("ul");
    ul.classList.add("dasher-menu");
    
    const length = this.DASHES.length;
    for(let i = 0; i<length;i++) {

      const li = document.createElement("li");
      if(i === 0) {
        li.classList.add('active');
      }
      li.onclick = (e) => this.handleMenuClick(e);
      li.dataset.index = i;
      li.style.transition = `all ${this.DASH_SPEED / 1000}s ease`;
      ul.appendChild(li);
    }
    document.body.appendChild(ul);
  }

  _initDOM() {
    this._initInnerDash();
    if(this.STD_MENU) this._initStdMenu();
    this._initDashStyles();
    this.setDasherAnimation(this.DASH_SPEED, this.DASH_TRANSITION);
    this.setActiveDash(this.ACTIVE_DASH);
  }

  start() {
    this._initDOM();
    window.addEventListener('wheel', this.onWheel);
  }
}

export default Dasher;
