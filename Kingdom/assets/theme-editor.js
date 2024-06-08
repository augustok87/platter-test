const toggleAnnouncement = e=>{
	const section = e.target;
	if ( section.classList.contains('mount-announcement') ) {
		if ( document.querySelector('.announcement') ) {
			document.body.classList.add('show-announcement-bar');
		} else {
			document.body.classList.remove('show-announcement-bar');
		}
	} 
}
document.addEventListener('shopify:section:load', toggleAnnouncement);
document.addEventListener('shopify:section:select', toggleAnnouncement); 


document.addEventListener('shopify:section:load', e=>{

	if ( e.target.classList.contains('main-product') ) {
		if ( e.target.querySelector('product-description') ) {
			e.target.querySelector('product-description').init();
		}
	}

  if ( e.target.classList.contains('mount-css-slider') && e.target.querySelector('css-slider') ) {
		setTimeout(()=>{
      if ( e.target.querySelector('css-slider').classList.contains('enabled') ) {
        e.target.querySelector('css-slider').resetSlider();
        e.target.querySelector('css-slider').checkSlide();
      }
		}, 500);
  }

  if ( e.target.classList.contains('mount-product-gallery') ) {
    ProductGalleryResizeHelper(e.target.querySelector('.product-gallery'));
  }

});

document.addEventListener('shopify:section:load', e=>{
  if ( e.target.querySelector('.gutter-script') ) {
    eval(e.target.querySelector('.gutter-script').textContent);
  }
});
document.addEventListener('shopify:section:reoder', e=>{
  if ( e.target.querySelector('.gutter-script') ) {
    eval(e.target.querySelector('.gutter-script').textContent);
  }
});

document.addEventListener('shopify:block:select', e=>{
  const block = e.target;
  if ( block.classList.contains('toggle') ) {
    if ( !block.querySelector('[data-js-title]').classList.contains('opened') ) {
      block.onClickHandler();
    }
  }
})
document.addEventListener('shopify:block:deselect', e=>{
  const block = e.target;
  if ( block.classList.contains('toggle') ) {
    if ( block.querySelector('[data-js-title]').classList.contains('opened') ) {
      block.onClickHandler();
    }
  }
})