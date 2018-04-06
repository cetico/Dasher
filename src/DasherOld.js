

class Dasher {
  
  constructor(opts) {

    this.root_sel = opts.root || 'dasher';
    this.dashes_sel = opts.dashes || 'section';
    this.dashDuration = opts.dashDuration || 700;
    this.maxScrollSpeed = opts.maxScrollSpeed || 10;
    this.loopDashing = opts.loopDashing || false;
    this.backgroundColor = opts.backgroundColor || '';
    this.listeners = {};
    
    this.root = document.getElementById( this.root_sel );
    this.dashes = document.getElementsByClassName( this.dashes_sel );
    this.active_dash = _.first(this.dashes);
    this.prevTime = Date.now();
    this.scroll_history = [];
    this.isDashing = false;
  }



  handleWheel(e) {


    const {active_dash} = this;
    const overflow = this.isOverflow(active_dash);
    const atEdges = this.isAtEdges(active_dash, e.deltaY, overflow);


    if(overflow && !atEdges) {
      return this.scrollOverflowDash(active_dash, e.deltaY);
    } 
    else {
      return this.handleDashEvent(this.loopDashing, e.deltaY);
    }
  }



  isOverflow(dash) {
    const dashHeight = Math.floor(dash.offsetHeight - 1);

    if(dashHeight >= window.innerHeight) {
      return true;
    } 
    else { 
      return false; 
    }
  }


  
  
  // PURE DASH VERSION
  isAtEdges(outerElement, deltaY = 0, overflow = true) {

    if(!overflow) { return true; }

    const outerHeight = Math.floor(outerElement.offsetHeight - 1);
   
    const offset = this.getMatrixHeight(outerElement) - Number(deltaY);
    const value = offset - window.innerHeight;

    console.log(outerHeight + value);
    if(outerHeight + value <= 0) {
      console.log('one')
      return true;
    } else if (offset >= 0) {
      console.log('two')
      outerElement.style.transform = `matrix(1,0,0,1,0,0)`; //prevent jitter.
      return true;
    } else {
      return false;
    }
  }
  

  getMatrixHeight(inner) {
    const matrix = window.getComputedStyle(inner).transform;
    if (matrix === 'none') {
      throw new Error(`Matrix of element is none.`);
    }
    return Number(_.last(matrix.split(',')).replace(')', ''));
  }

  // DASH VERSION
  scrollOverflowDash(dash, deltaY) {

      const direction = deltaY > 0 ? 1 : -1;
      const absY = Math.abs(deltaY);
      const moveY = Math.min(Math.max(parseInt(absY), 1), this.maxScrollSpeed) * direction; 
      const height = this.getMatrixHeight(dash) - Number(moveY);
      dash.style.transform = `matrix(1, 0, 0, 1, 0, ${height})`;
  }

  _getAverage(elements, number) {
    let sum = 0;
    let lastElements = elements.slice(Math.max(elements.length - number, 1));
    for(let i = 0; i < lastElements.length; i++){
        sum = sum + lastElements[i];
    }
    return Math.ceil(sum/number);
  }

  _updateScrollHistory(deltaY) {
    let { scroll_history} = this;
    if(scroll_history.length > 150) scroll_history.shift();
    scroll_history.push(Math.abs(deltaY));
  }



  _isEnoughTimePassed(time) {
    const passed = time - this.prevTime;
    if(passed > this.dashDuration) {
      return true;
    }
    else return false;
  }



  isAccelerating(scrollHistory) {
    const end = this._getAverage(scrollHistory, 10);
    const average = this._getAverage(scrollHistory, 30);
    return end <= average;
  }



  handleDashEvent(loop, deltaY) {

    this._updateScrollHistory(deltaY);

    const now = Date.now();
    const enoughTimePassed = this._isEnoughTimePassed(now);
    const accelerating = this.isAccelerating(this.scroll_history);

    if(enoughTimePassed && !accelerating) {

      this.scroll_history = [];
      this.prevTime = Date.now();
      
      const sibling = deltaY > 0 ? 'nextElementSibling' : 'previousElementSibling';
      const dash = this.active_dash[ sibling ];
      
      if(dash === null && loop) {
        const { dashes } = this; 
        if(deltaY > 0) {
          this.setActiveDash(_.first(dashes));
          this.dashToActive(); 
        } else {
          this.setActiveDash(_.last(dashes));
          this.dashToActive();
        }
      } 
      else if (dash) {


        this.setActiveDash(dash);
        this.dashToActive();
      } 
      else return;
    }
  }

  setRootDashing() {
    this.isDashing = true;
    this.root.classList.add('dashing');
    setTimeout(() => {
      this.isDashing = false;
      this.root.classList.remove('dashing');
    }, this.dashDuration);
  }


  setActiveDash(dash) {
    
    if (dash) {
      // reset matrix of active dash so dashes seamlessly connect.
      // Also remove transition to reset matrix instantly. Add again afterwards.
      const transition = window.getComputedStyle(this.root).transition;
      this.root.style.transition = '';
      this.active_dash.style.transform = 'matrix(1,0,0,1,0,0)';
      this.root.style.transition = transition;
      
      this.setRootDashing();

      this.active_dash.classList.remove('active');
      this.active_dash = dash;
      this.active_dash.classList.add('active');

      // this.root

    } else {
      throw new Error(`wrong type provided: ${typeof dash}. Expected Element.`)
    }
  }


  
  dashToActive() {
    const { active_dash, root } = this;
    root.style.transform = `translate3d(0, -${active_dash.offsetTop}px, 0)`;
  }


  // DASH VERSION
  _styleDashes(dashes) {
    Array.from(dashes).forEach((dash) => {
      dash.style.minHeight = "100vh";
      dash.style.width = "100%";
      dash.style.overflow = "hidden";
      dash.style.backgroundColor = this.backgroundColor;

      dash.style.transform = `matrix(1,0,0,1,0,0)`;
    })
  }

// DASH VERSION
  _wrapDashes(dashes) {
	// not needed for now.
  }




  _prepareDashes(dashes) {
    this._wrapDashes(dashes);
    this._styleDashes(dashes);
  }



  init() {
    this.listeners.wheel = window.addEventListener('wheel', this.handleWheel.bind(this));
    this._prepareDashes(this.dashes);
    this.active_dash.classList.add('active');
  }



  start() {
    this.init();
  }
} 

 
const dasher = new Dasher({
  root: 'dasher',
  dashes: 'dash',
  // backgroundColor: 'orange'
});
dasher.start();
 

