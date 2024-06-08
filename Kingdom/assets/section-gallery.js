if ( typeof GalleryZoom !== 'function' ) {

	class GalleryZoom extends HTMLElement {
		constructor(){
			super();
			const modal = window.basicLightbox.create(`<img data-src="${this.dataset.src}" alt="" />`);
			this.addEventListener('click',e=>{
				e.preventDefault();
				const imgEl = modal.element().querySelector('img');
				imgEl.setAttribute('src', imgEl.dataset.src);
				modal.show();
			})
		}
	}

	if ( typeof customElements.get('gallery-zoom') == 'undefined' ) {
		customElements.define('gallery-zoom', GalleryZoom);
	}

}