

if ( typeof ProductReviews !== 'function' ) {

	class ProductReviews {

		constructor(_this){

			const observer = new MutationObserver((mutations, observer)=>{
				for ( const mutation of mutations ) {
					if ( mutation.addedNodes.length > 0 ) {
						mutation.addedNodes.forEach(elm=>{
							if ( elm.tagName == 'DIV' && elm.classList.contains('spr-container') ) {
								this.init(elm);
								observer.disconnect();
							} 
						});
					}
				}
			})
			if ( _this.querySelector('.spr-review') ) {
				this.init(_this.querySelector('.spr-container'))
			} else {
				observer.observe(_this, {childList: true})
			}
		}

		init(elm){

			// create css slider for reviews

			if ( elm.querySelector('.spr-review') ) {

				const reviews = elm.querySelector('.spr-reviews');
				const reviewsSliderHolder = document.createElement('div');
				reviewsSliderHolder.innerHTML = `<css-slider
					class="spr-reviews css-slider--simple-dots" 
					data-options='{
						"selector": ".spr-review",
						"navigation": false,
						"groupCells": true,
						"autoHeight": ${window.innerWidth<520?true:false}
					}'>${reviews.innerHTML}</div>`

				reviews.remove();
				elm.querySelector('.spr-content').append(reviewsSliderHolder);

				const reviewsSlider = reviewsSliderHolder.querySelector('css-slider');
				setTimeout(()=>{
					reviewsSlider.resetSlider(true);
				}, 100);

				// use jsonp to load more reviews

				const paginationObserver = new IntersectionObserver((entries, observer)=>{
					entries.forEach(entry=>{
						if ( entry.isIntersecting ) {
							if ( entry.target.querySelector('.spr-pagination-next a') ) {
								const nextPage = entry.target.querySelector('.spr-pagination-next a');
								getJSONP(`${SPR.api_url}/reviews?page=${nextPage.dataset.page}&product_id=${nextPage.dataset.productId}&shop=${window.location.hostname}`, (data)=>
									{
										nextPage.closest('.spr-pagination').remove();
										const innerHTML = new DOMParser().parseFromString(data.reviews, 'text/html');
										if ( innerHTML.querySelectorAll('.spr-review, .spr-pagination') ) {
											innerHTML.querySelectorAll('.spr-review, .spr-pagination').forEach(elm=>{
												reviewsSlider.querySelector('.css-slider-container').append(elm);
												if ( elm.classList.contains('spr-pagination') ) {
													paginationObserver.disconnect();
													paginationObserver.observe(elm);
												}
											});
										}
										reviewsSlider.afterAppend();
										reviewsSlider.resetSlider(true, false);
									}
								);
							}
						}
					})
				}, {threshold: 1});
				if ( reviewsSliderHolder.querySelector('.spr-pagination') ) {
					paginationObserver.observe(reviewsSliderHolder.querySelector('.spr-pagination'));
				}

			} else {

			}

			// turn form into popup

			const reviewForm = document.createElement('div');
			reviewForm.id = 'spr-form-modal';
			reviewForm.innerHTML = `<div id="spr-form" class="spr-form-holder page-popup">
				<div class="basicLightboxClose" tabindex="0">×</div>
			</div>`;
			
			document.querySelector('.spr-summary-actions-newreview').setAttribute('onclick', '');
			const reviewModalForm = window.basicLightbox.create(reviewForm, {
				trigger: document.querySelector('.spr-summary-actions-newreview'),
				focus: 'input[type="text"]'
			});

			reviewModalForm.element().querySelector('.spr-form-holder').prepend(elm.querySelector('.spr-form'));
			reviewModalForm.element().querySelector('.spr-form').style.display = 'block';

		}

	}

	if ( document.getElementById('shopify-product-reviews') ) {
		new ProductReviews(document.getElementById('shopify-product-reviews'));
	}

}

const getJSONP = (url, callback) => {
	let callbackName = `jsonp_callback_${Math.round(100000 * Math.random())}`;
	window[callbackName] = data => {
			delete window[callbackName];
			document.body.removeChild(script);
			callback(data);
	};
	const script = document.createElement('script');
	script.src = `${url}${url.indexOf('?') >= 0 ? '&' : '?'}callback=${callbackName}`;
	document.body.appendChild(script);
}