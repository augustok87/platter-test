if ( typeof ProductDescription !== 'function' ) {
		
	class ProductDescription extends HTMLElement {

		constructor(){
			super();
			this.init();
		}

		init(){

			this.description = this.querySelector('.product__description');

			if ( this.description.classList.contains('truncated') ) {

				this.descriptionInner = this.description.querySelector('.product__description-inner');

				if ( this.descriptionInner.offsetHeight - 10 > this.description.offsetHeight ) {

					this.descriptionTrigger = document.createElement('a');
					this.descriptionTrigger.classList.add('truncated__trigger');
					this.descriptionTrigger.setAttribute('tabindex', '0');
					this.descriptionTrigger.setAttribute('aria-controls', this.descriptionInner.id);
					this.descriptionTrigger.setAttribute('aria-expanded', false);
					this.descriptionTrigger.textContent = KROWN.settings.locales.product_more_description_label;
					this.description.after(this.descriptionTrigger);

					this.descriptionTrigger.addEventListener('click', this.onClickHandler.bind(this));
					this.descriptionTrigger.addEventListener('keydown', (e) => {
						if ( e.keyCode == window.KEYCODES.RETURN ) {
							this.onClickHandler(e);
						}
					})

				}
				
			}

		}

		onClickHandler(e) {
			e.preventDefault();
			if ( ! this.description.classList.contains('truncated--show') ) {
				this.description.classList.add('truncated--show');
				this.description.style.maxHeight = this.descriptionInner.offsetHeight + 'px';
				this.descriptionTrigger.textContent = KROWN.settings.locales.product_less_description_label;
				this.descriptionTrigger.setAttribute('aria-expanded', true);
				this.descriptionInner.setAttribute('tabIndex', '0');
			} else {
				this.description.classList.remove('truncated--show');
				this.description.setAttribute('style', '');
				this.descriptionTrigger.textContent = KROWN.settings.locales.product_more_description_label;
				this.descriptionTrigger.setAttribute('aria-expanded', false);
			}
		}

	}

	if ( typeof customElements.get('product-description') == 'undefined' ) {
		customElements.define('product-description', ProductDescription);
	}

}

if ( typeof ProductPage !== 'function' ) {

	class ProductPage extends HTMLElement {

		constructor(){

			super();

			this.productGallery = this.querySelector('.product-gallery');
			this.productSlider = this.querySelector('css-slider');

			// Gallery thumbnails

			if ( this.querySelector('.product-gallery__thumbnails .thumbnail') ) {

				this.querySelectorAll('.product-gallery__thumbnails .thumbnail').forEach((elm, i)=>{
					if ( i == 0 )
						elm.classList.add('active');
					elm.addEventListener('click',e=>{
						if ( this.productSlider.sliderEnabled ) {
							this.productSlider.changeSlide(e.currentTarget.dataset.index);
						} else {
							window.scrollTo({
								top: this.productGallery.querySelector(`.product-gallery__item[data-index="${e.currentTarget.dataset.index}"]`).offsetTop + this.offsetTop,
								behavior: 'smooth'
							});
							this.thumbnailNavigationHelper(e.currentTarget.dataset.index);
						}
						this._pauseAllMedia();
						this._playMedia(this.productGallery.querySelector(`.product-gallery__item[data-index="${e.currentTarget.dataset.index}"]`));
					});
				})

				this.productSlider.addEventListener('change', e=>{
					this.thumbnailNavigationHelper(e.target.index);
				});

			}

			this.productSlider.addEventListener('navigation', e=>{
				this._playMedia(this.productGallery.querySelector(`.product-gallery__item[data-index="${e.target.index}"]`));
			})
			this.productSlider.addEventListener('change', e=>{
				if ( this.productGallery.querySelector(`.product-gallery__item[data-index="${e.target.index}"]`).dataset.productMediaType == 'model' && this.xrButton ) {
					this.xrButton.setAttribute('data-shopify-model3d-id', this.productGallery.querySelector(`.product-gallery__item[data-index="${e.target.index}"]`).dataset.mediaId);
				}
				this._pauseAllMedia();
				this.thumbnailNavigationHelper(e.target.index);
			});

			// Product variant event listener for theme specific logic

			const productVariants = this.querySelector('product-variants');
			if ( productVariants ) {
				productVariants.addEventListener('VARIANT_CHANGE', this.onVariantChangeHandler.bind(this));
				this.onVariantChangeHandler({target:productVariants});
			}

			// show cart drawer when element is added to cart

			if ( ! document.body.classList.contains('template-cart') && KROWN.settings.cart_action == 'overlay' ) {

				let addToCartEnter = false;
				if ( this.querySelector('.product__add-to-cart') ) {
					this.querySelector('.product__add-to-cart').addEventListener('keyup', e=>{
						if ( e.keyCode == window.KEYCODES.RETURN ) {
							addToCartEnter = true;
						}
					})
				}

				if ( this.querySelector('.product__form') ) {
					this.querySelector('.product__form').addEventListener('add-to-cart', ()=>{
						document.querySelector('.sidebar__cart').show();
						if ( addToCartEnter ) {
							setTimeout(()=>{
								document.querySelector('.sidebar__cart .sidebar__cart-close').focus();
							}, 200);
						}
					});
				}

			}

			// Gallery resize helper

			this.GALLERY_RESIZE_EVENT = debounce(()=>{
				ProductGalleryResizeHelper(this.productGallery);
			}, 100);
			window.addEventListener('resize', this.GALLERY_RESIZE_EVENT, {passive:true});

			// Scroll navigation helper 

			if ( this.productGallery.classList.contains('product-gallery--scroll') ) {

				this.productGalleryNavigation = this.querySelector('.product-gallery__thumbnails');
				this.productGalleryNavigationItem = this.querySelectorAll('.product-gallery__thumbnails .thumbnail');

				const productGallerySlides = this.productGallery.querySelectorAll('.product-gallery__item');
				const reversedGallerySlides = [...productGallerySlides].reverse();

				this.GALLERY_NAVIGATION_SCROLL = ()=>{

					if ( ! this.productGallery.querySelector('css-slider').sliderEnabled && window.innerWidth > 1023 ) {

						for ( const slide of reversedGallerySlides ) {
							const slideTop = slide.getBoundingClientRect().top;
							if ( slideTop < window.innerHeight / 2 && slideTop > -window.innerHeight / 2  ) {
								this.productGalleryNavigationItem.forEach(elm=>elm.classList.remove('active'));
								this.productGalleryNavigationItem[slide.dataset.index].classList.add('active');
								break;
							} 
						}

						const productGalleryTop = this.productGallery.getBoundingClientRect().top

						if ( (productGalleryTop - window.innerHeight) * -1 > this.productGallery.offsetHeight ) {
							this.productGalleryNavigation.classList.add('scroll');
						} else if ( productGalleryTop > 0 ) {
								this.productGalleryNavigation.classList.add('scroll-up');
							this.productGalleryNavigation.classList.add('scroll');
						} else if ( (productGalleryTop - window.innerHeight) * -1 < this.productGallery.offsetHeight ) {
							this.productGalleryNavigation.classList.remove('scroll');
							this.productGalleryNavigation.classList.remove('scroll-up');
						}

					}

				}

				window.addEventListener('scroll', this.GALLERY_NAVIGATION_SCROLL, {passive:true});
				this.GALLERY_NAVIGATION_SCROLL();

			}

			// Check for models

			const models = this.querySelectorAll('product-model');
			if ( models > 0 ) {
				window.ProductModel.loadShopifyXR();
				this.xrButton = this.querySelector('.product-gallery__view-in-space');
			}

			// hide buy now button if stock disabled

			const addToCartButton = this.querySelector('.product__add-to-cart');
			if ( addToCartButton ) {
				if ( addToCartButton.classList.contains('disabled') ) {
					this.querySelector('product-form').classList.add('disable-buy-button');
				} else {
					this.querySelector('product-form').classList.remove('disable-buy-button');
				}
				const buyObserver = new MutationObserver(mutations=>{
					for ( const mutation of mutations ) {
						if ( addToCartButton.classList.contains('disabled') ) {
							this.querySelector('product-form').classList.add('disable-buy-button');
						} else {
							this.querySelector('product-form').classList.remove('disable-buy-button');
						}
					}
				});
				buyObserver.observe(addToCartButton,{ attributes: true, childList: false, subtree: false });
			}

			// complementary products
			if ( this.querySelector('product-recommendations') ) {
				this.querySelector('product-recommendations').addEventListener('product-recommendations-loaded',e=>{
				})
			}

		}

		thumbnailNavigationHelper(index=0){ 
			this.querySelectorAll('.product-gallery__thumbnails .thumbnail').forEach((elm, i)=>{
				if ( i == index )
					elm.classList.add('active');
				else 
					elm.classList.remove('active');
			});
		}

		onVariantChangeHandler(e){
			let variant = e.target.currentVariant;
			if ( variant && variant.featured_media != null ) {
				let variantImg = this.productGallery.querySelector('.product-gallery__item[data-media-id="' + variant.featured_media.id + '"]');
				if ( variantImg ) {
					if ( this.productGallery.classList.contains('product-gallery--slider') || ( this.productGallery.classList.contains('product-gallery--scroll') && window.innerWidth < 1024 ) ) {
						if ( this.productGallery.querySelector('css-slider').sliderEnabled ) {
							this.productGallery.querySelector('css-slider').changeSlide(variantImg.dataset.index);
						}
					} else {
						window.scrollTo({
							top: variantImg.offsetTop,
							behavior: 'smooth'
						});
					}
				}
			}
		}

		_pauseAllMedia(){

			document.querySelectorAll('.product-gallery .js-youtube').forEach(video => {
				video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
			});
			document.querySelectorAll('.product-gallery .js-vimeo').forEach(video => {
				video.contentWindow.postMessage('{"method":"pause"}', '*');
			});
			document.querySelectorAll('.product-gallery video').forEach(video => video.pause());
			document.querySelectorAll('.product-gallery product-model').forEach(model => {
				if ( model.modelViewerUI ) 
					model.modelViewerUI.pause()
			});
		}
		
		_playMedia(media){
			switch ( media.dataset.productMediaType ) {
				case 'video':
					if ( media.querySelector('video') ) {
						media.querySelector('video').play();
					}
					break;
				case 'external_video-youtube':
					if ( media.querySelector('.js-youtube') ) {
						media.querySelector('.js-youtube').contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
					}
					break;
				case 'external_video-vimeo':
					if ( media.querySelector('.js-vimeo') ) {
						media.querySelector('.js-vimeo').contentWindow.postMessage('{"method":"play"}', '*');
					}
					break;
			}
		}

	}

	if ( typeof customElements.get('product-page') == 'undefined' ) {
		customElements.define('product-page', ProductPage);
	}

}