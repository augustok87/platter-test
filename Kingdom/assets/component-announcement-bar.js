if ( typeof AnnouncementBar !== 'function' ) {

	class AnnouncementBar extends HTMLElement {
		constructor(){
			super();
			if ( document.querySelector('.announcement__exit') ) {
				document.querySelector('.announcement__exit').addEventListener('click', ()=>{
					document.body.classList.add('no-transition');
					setTimeout(()=>{
						document.body.classList.remove('show-announcement-bar');
						localStorage.setItem('announcement-dismissed', 'true');
						setTimeout(()=>{
							document.body.classList.remove('no-transitions');
						}, 100);
					}, 10)
				})
			}

		}
	}

	if ( typeof customElements.get('announcement-bar') == 'undefined' ) {
		customElements.define('announcement-bar', AnnouncementBar);
	}

}