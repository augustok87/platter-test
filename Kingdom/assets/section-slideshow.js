if ( typeof ImageSlideshow !== 'function' ) {

	class ImageSlideshow extends HTMLElement {

		constructor(){

			super();

			this.slides = this.querySelectorAll('.slide');
			this.images = this.querySelectorAll('.slide__image');
			this.overlays = this.querySelectorAll('.slide__overlay');
			this.texts = this.querySelectorAll('.slide__text');
			
			if ( this.classList.contains('slider--scroll') ) {

				let previous = -1,
						currentOld = -1;

				// add navigation

				const sliderDots = document.createElement('div');
				sliderDots.classList.add('slider__dots');
				sliderDots.classList.add('css-slider-dot-navigation');
				this.append(sliderDots);

				this.images.forEach((elm, i)=>{
					
					const sliderDot = document.createElement('div');
					sliderDot.classList.add('dot');
					sliderDot.classList.add('css-slider-dot');
					sliderDots.append(sliderDot);

					sliderDot.addEventListener('click', ()=>{
						window.scrollTo({
							top: this.slides[i].offsetTop,
							behavior: 'smooth'
						})
					})

					if ( i == 0 ) {
						sliderDot.classList.add('active');
					}

				});

				this.sliderDot = this.querySelectorAll('.slider__dots .dot');
				this.sliderDots = this.querySelector('.slider__dots');

				// mount scroll event helper

				this.onScrollHandler = (()=>{

					var sliderOffset = this.offsetTop,
							scrollTop = window.scrollY,
							screenHeight = window.innerHeight;

					if ( scrollTop >= sliderOffset && scrollTop + screenHeight <= sliderOffset + this.offsetHeight ) {
						
						this.images.forEach((elm,i)=>{
							// animate each slide based on scrolling and it's offset
							const transformValue = ( scrollTop - sliderOffset - ( screenHeight * i ) ) / 2;
							if ( Math.abs(transformValue) <= screenHeight / 2 ) {
								this.scrollTransform(transformValue, this.images[i], this.overlays[i], this.texts[i]);
							} 

							if ( scrollTop >= ( screenHeight * i ) + sliderOffset - ( screenHeight / 2 ) && ! this.sliderDot[i].classList.contains('active') ) {
								this.sliderDots.querySelector('.active').classList.remove('active');
								this.sliderDot[i].classList.add('active');
							} 
						});

					} else if ( scrollTop < sliderOffset ) {
						// fix first slide
						this.scrollTransform(0, this.images[0], this.overlays[0], this.texts[0]);
					} else if ( scrollTop + screenHeight > sliderOffset + this.offsetHeight ) {
						// fix last slide
						this.scrollTransform(0, this.images[this.images.length-1], this.overlays[this.overlays.length-1], this.texts[this.texts.length-1]);
					}

					// Toggle slider navigation

					if ( this.sliderDots.classList.contains('in-view') && ( scrollTop + screenHeight > sliderOffset + this.offsetHeight || scrollTop < sliderOffset ) ) {
						this.sliderDots.classList.remove('in-view');
						if ( scrollTop < sliderOffset ) {
							this.sliderDots.classList.remove('in-bottom');
						} else if ( scrollTop + screenHeight > sliderOffset ) {
							this.sliderDots.classList.add('in-bottom');
						}
					} else if ( ! this.sliderDots.classList.contains('in-view') && ( scrollTop >= sliderOffset && scrollTop + screenHeight <= sliderOffset + this.offsetHeight ) ) {
						this.sliderDots.classList.add('in-view');
					}

				}).bind(this);
				window.addEventListener('scroll', this.onScrollHandler, {passive:true});
				this.onScrollHandler();

				this.addEventListener('ready', ()=>{
					this.images.forEach((elm,i)=>{
						this.scrollTransform(0, this.images[i], this.overlays[i], this.texts[i], true);
					});
				})

			}

			// mount resize event helper

			this.onResizeHandler = (()=>{
				if ( this.classList.contains('slider--scroll') ) {
					this.onScrollHandler();
				}
				if ( window.innerWidth < 948 && this.classList.contains('slider--mobile-js-height') && ( this.classList.contains('slider--horizontal') || this.classList.contains('slider--horizontal-mobile-true' ) ) ) {
					this.style.height = `${document.documentElement.clientHeight-this.dataset.navigationPadding}px`;
				}	
			}).bind(this);
			this.onResizeHandler();

			// add parallax effect to horizontal slider
			if ( ( this.classList.contains('slider--horizontal') || this.classList.contains('slider--horizontal-mobile-true') )
				&& ( "scrollBehavior" in document.documentElement.style || document.body.classList.contains('touch') )
			) {
				const cssSlider = this.querySelector('css-slider');
				cssSlider.addEventListener('ready', ()=>{
					this.slides = this.querySelectorAll('.slide');
					this.images = this.querySelectorAll('.slide__image');
					this.overlays = this.querySelectorAll('.slide__overlay');
					this.texts = this.querySelectorAll('.slide__text');
				});
				cssSlider.addEventListener('scroll', ()=>{
					const scrollX = -cssSlider.element.scrollLeft;
					this.slides.forEach((slide,i)=>{
						const img = this.images[i];
						if ( img ) {
							const slideX = slide.offsetLeft;
							img.style.transform = `translateX(${( slideX + scrollX ) * -1/3}px)`;
							this.texts[i].style.transform = `translateX${( slideX + scrollX ) / 8}px)`;
							this.overlays[i].style.opacity = `${( ( slideX + scrollX ) * -1/10 ) / 100}`;
						}
					});
				});
			}

		}

		scrollTransform(transformValue, image, overlay, text, force=false){
			if ( image && ( force || ( document.body.classList.contains('no-touchevents') && window.innerWidth > 948 ) ) ) {
				image.style.transform = `translate3d(0, ${transformValue}px, 0)`;
				if ( transformValue >= 0 ) {
					overlay.style.opacity = `${transformValue/(window.innerHeight/2)}`;
				}
				text.style.transform = `translate3d(0, ${transformValue/10}px, 0)`;
			}
		}

	}
	
  if ( typeof customElements.get('image-slideshow') == 'undefined' ) {
		customElements.define('image-slideshow', ImageSlideshow);
	}

}