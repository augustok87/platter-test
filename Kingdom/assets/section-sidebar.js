class MainSidebar extends HTMLElement {

	constructor(){

		super();

		// scroll & resize for sticky sidebar assistance

		this.SCROLL_EVENT = (e=>{
			if ( this.offsetHeight > window.innerHeight ) {
				this.style.transform = 'translate3d(0,' + ( window.scrollY * -1 ) + 'px, 0)';
			} else {
				this.style.transform = 'translate3d(0,' + ( ( this.offsetHeight - window.innerHeight ) * -1 ) + 'px, 0)';
			}
		})
		this.addEventListener('scroll', this.SCROLL_EVENT, {passive:true});

		this.RESIZE_EVENT = debounce(()=>{
			if ( this.offsetHeight > window.innerHeight ) {
				this.SCROLL_EVENT();
			} else {
				this.style.transform = 'translate3d(0, 0, 0)';
			}
			this.setSidebarHeight();
		}, 300);
		this.addEventListener('resize', this.RESIZE_EVENT, {passive:true});
		setTimeout(()=>{
			this.RESIZE_EVENT();
		}, 310);

		// cart setup

	 	if ( ! document.body.classList.contains('template-cart') && KROWN.settings.cart_action == 'overlay' ) {

	 		const sidebarCart = document.querySelector('.sidebar__cart');
	 		if ( document.querySelector('.sidebar__cart-handle') ) {
		 		document.querySelector('.sidebar__cart-handle').addEventListener('click', e=>{
		 			e.preventDefault();
					sidebarCart.show();
		 		});
		 	}

		 	if ( document.querySelector('.sidebar__cart-handle') ) {
			 	document.querySelector('.sidebar__cart-handle').addEventListener('keyup', e=>{
					if ( e.keyCode == window.KEYCODES.RETURN ) {
						setTimeout(()=>{
							document.querySelector('.sidebar__cart .sidebar__cart-close').focus();
						}, 100);
					}
			 	});
			 }

		}

		// search setup 

		const sidebarSearch = document.querySelector('.sidebar__search');
		
		if ( JSON.parse(document.getElementById('shopify-features').text).predictiveSearch ) {

			this.closePredictiveSearch = (()=>{
				document.querySelector('.sidebar').classList.remove('no-transforms');
				sidebarSearch.classList.remove('open-search');
				sidebarSearch.classList.remove('opened');
				this.querySelector('[data-js-search-results]').classList.remove('show');
				//this.querySelector('[data-js-search-link]').classList.remove('show');
 				document.body.classList.remove('overflow-hidden');
				document.querySelector('.cart-overlay-background').classList.remove('show');
				document.querySelector('.cart-overlay-background').removeEventListener('click', this.closePredictiveSearch);
			}).bind(this);

			if ( document.querySelector('.sidebar__search-handle') ) {
				document.querySelector('.sidebar__search-handle').addEventListener('click', e=>{
	        const afterContent = window.getComputedStyle(sidebarSearch,':after').content;
					if ( afterContent.includes('predictive-mobile') ) {
						e.preventDefault();
				 		if ( ! sidebarSearch.classList.contains('opened') ) {
				 			sidebarSearch.show();
							setTimeout(()=>{
								document.querySelector('[data-js-search-input]').focus();
							}, 50);
				 		} else {
				 			sidebarSearch.hide();
				 		}
				 	}
				});
			}

			if ( this.querySelector('input[type="search"]') ) {
			 	this.querySelector('input[type="search"]').addEventListener('click', e=>{
			 		if ( ! sidebarSearch.classList.contains('open-search') ) {
						this.setSidebarHeight()
						document.querySelector('.sidebar').classList.add('no-transforms');
						sidebarSearch.classList.add('open-search');
						sidebarSearch.classList.add('opened');
						this.querySelector('[data-js-search-results]').classList.add('show');
						//this.querySelector('[data-js-search-link]').classList.add('show');
		 				document.body.classList.add('overflow-hidden');
						document.querySelector('.cart-overlay-background').classList.add('show');
						document.querySelector('.cart-overlay-background').addEventListener('click', this.closePredictiveSearch);
			 		}
			 	});
			}

			if ( this.querySelector('.sidebar__search-close') ) {
			 	this.querySelector('.sidebar__search-close').addEventListener('click', e=>{
	        const afterContent = window.getComputedStyle(sidebarSearch,':after').content;
			 		if ( ! afterContent.includes('predictive-mobile') ) {
			 			this.closePredictiveSearch();
			 		}
			 	});
			}

			document.addEventListener('keydown', e=>{
				if ( e.keyCode == window.KEYCODES.ESC ) {  
					const afterContent = window.getComputedStyle(sidebarSearch,':after').content;
			 		if ( sidebarSearch.classList.contains('open-search') && ! afterContent.includes('predictive-mobile') ) {
			 			this.closePredictiveSearch();
			 		}
				}
			});

		} else {

			if ( document.querySelector('.sidebar__search-handle') ) {
				document.querySelector('.sidebar__search-handle').addEventListener('click', e=>{

					e.preventDefault();

			 		if ( ! sidebarSearch.classList.contains('opened') ) {
			 			sidebarSearch.classList.add('opened');
			 			document.querySelector('.sidebar__search input[type="search"]').setAttribute('placeholder', document.querySelector('.sidebar__search input[type="search"]').dataset.responsivePlaceholder);
			 			setTimeout(()=>{
			 				document.querySelector('.sidebar__search input[type="search"]').focus();
			 			}, 100);
			 		} else {
			 			sidebarSearch.classList.remove('opened');
			 		}

				});
			}

			if ( document.querySelector('.sidebar__search') ) {
				document.querySelector('.sidebar__search').classList.remove('predictive-search');
			}

		}

		// mobile menu setup

		const sidebarMenus = document.querySelector('.sidebar__menus');
		if ( document.querySelector('.sidebar__menu-handle') ) {
			document.querySelector('.sidebar__menu-handle').addEventListener('click', e=>{
				e.preventDefault();
				sidebarMenus.classList.remove('kill-overflow');
				if ( ! sidebarMenus.classList.contains('opened') ) {
					sidebarMenus.show();
				} else {
					sidebarMenus.hide();
				}
			});
		}

		let submenuLevel = 0;

		document.querySelectorAll('.sidebar__menus .sidebar__menu .has-submenu > a').forEach(elm=>{
			elm.addEventListener('click', e=>{
				if ( window.innerWidth <= 948 ) {
					e.preventDefault();
					e.stopPropagation();
					sidebarMenus.classList.add('kill-overflow');
			 		sidebarMenus.scrollTop = 0;
			 		if ( elm.parentNode.classList.contains('has-second-submenu') ) {
			 			submenuLevel = 2;
			 		} else {
			 			submenuLevel = 1;
			 		}
			 		elm.parentNode.classList.add('open-submenu');
			 		elm.parentNode.parentNode.classList.add('opened-submenu');
			 		elm.closest('.sidebar__menus').classList.add('opened-submenus');
			 		if ( elm.parentNode.parentNode.parentNode.classList.contains('primary-menu') ) {
			 			elm.parentNode.parentNode.parentNode.nextElementSibling.classList.add('opened-other-submenu');
			 		} else {
			 			elm.parentNode.parentNode.parentNode.previousElementSibling.classList.add('opened-other-submenu');
			 		}
				}
			});
		})

		document.querySelector('.sidebar__menus-back').addEventListener('click', e=>{
			if ( submenuLevel == 1 ) {
				submenuLevel = 0;
	 			sidebarMenus.classList.remove('opened-submenus');
	 			sidebarMenus.querySelector('nav.opened-other-submenu').classList.remove('opened-other-submenu');
	 			sidebarMenus.querySelector('.opened-submenu').classList.remove('opened-submenu');
	 			sidebarMenus.querySelector('.open-submenu').classList.remove('open-submenu');
				sidebarMenus.classList.remove('kill-overflow');
			} else if ( submenuLevel == 2 ) {
				submenuLevel = 1;
	 			document.querySelector('.has-second-submenu.open-submenu').parentNode.classList.remove('opened-submenu');
	 			document.querySelector('.has-second-submenu.open-submenu').classList.remove('open-submenu');
			}
		})

		// desktop menu initialization - pretty complex stuff

	 	this.sidebarParentFLAG = false,
		this.sidebarSeconds = document.querySelector('.sidebar__seconds'),
		this.sidebarSecondsDOM = document.querySelector('.sidebar__seconds .sidebar__menu'),
		this.sidebarSecondsFLAG = false,
		this.sidebarThirds = document.querySelector('.sidebar__thirds'),
		this.sidebarThirdsDOM = document.querySelector('.sidebar__thirds .sidebar__menu'),
		this.sidebarThirdsFLAG = false;

	 	document.querySelectorAll('.has-first-submenu > a').forEach(elm=>{
	 		elm.addEventListener('touchstart', e=>{
	 			if ( window.innerWidth > 948 ) {
	 				e.preventDefault();	 				
	 				elm.parentNode.querySelectorAll('a')[0].style.pointerEvents = 'none'; 
	 				this.onMouseEnterHandlerFirst({currentTarget:elm.parentNode,preventDefault:()=>{}});
	 			}
	 		}, {passive: true});
	 	});

	 	document.querySelectorAll('.has-first-submenu').forEach(elm=>{
	 		elm.addEventListener('mouseenter', this.onMouseEnterHandlerFirst.bind(this));
	 		elm.addEventListener('mouseleave', this.onMouseLeaveHandlerFirst.bind(this));
	 	});

	 	this.sidebarSeconds.addEventListener('mouseenter', ()=>{
	 		document.body.classList.add('show-overlay');
	 		this.sidebarSeconds.classList.add('opened');
	 		if ( this.sidebarSeconds.querySelector('.sidebar__submenu--first') ) {
	 			this.sidebarSeconds.querySelector('.sidebar__submenu--first').classList.add('submenu-opened');
	 		}
	 	})
	 	this.sidebarSeconds.addEventListener('mouseleave', this.onMouseLeaveHandlerFirst.bind(this));

	 	this.sidebarThirds.addEventListener('mouseenter', ()=>{
	 		document.body.classList.add('show-overlay');
	 		this.sidebarThirds.classList.add('opened');
	 		this.sidebarSeconds.classList.add('opened');
	 		this.sidebarSeconds.querySelector('.sidebar__submenu--first').classList.add('submenu-opened');
	 		this.sidebarThirds.querySelector('.sidebar__submenu--second').classList.add('submenu-opened');
	 	});
	 	this.sidebarThirds.addEventListener('mouseleave', ()=>{
	 		this.onMouseLeaveHandlerFirst();
	 		this.onMouseLeaveHandlerSecond();
	 	});

	 	// a11y setup

		let activeElement = document.activeElement;
		let activeMenu_l1 = null;
		let activeMenu_l2 = null;
		let activeMenu_lFlag = false;
	  document.addEventListener('keyup', e=>{

	    if ( e.keyCode == window.KEYCODES.TAB ) {

	    	if ( document.activeElement.classList.contains('parent-has-submenu') ) {

	    		if ( document.activeElement.parentNode.classList.contains('has-first-submenu') ) {
		    		// first level of submenus - open secondary sidebar
		 				this.onMouseEnterHandlerFirst({currentTarget:document.activeElement.parentNode,preventDefault:()=>{}});
	    		} else if ( document.activeElement.parentNode.classList.contains('has-second-submenu') ) {
	    			// second level of submenus
		 				this.onMouseEnterHandlerSecond({currentTarget:document.activeElement.parentNode,preventDefault:()=>{}});
	    		}

	    		// second level of submenus - open third sidebar
	    		if ( document.activeElement.classList.contains('sub-menu__link-second') ) {
	    			if ( ! document.activeElement.classList.contains('sub-menu__last-second') ) {
	    				activeMenu_l2 = document.activeElement.parentNode.nextElementSibling.querySelector(':scope > a');
	    			} else {
	    				activeMenu_l2 = activeMenu_l1;
	    				activeMenu_lFlag = true;
	    			}
	    		} else {
	    			if ( document.activeElement.parentNode.nextElementSibling ) {
	    				activeMenu_l1 = document.activeElement.parentNode.nextElementSibling.querySelector(':scope > a');
	    			} else {
	    				if ( document.activeElement.dataset.type == 'primary' ) {
	    					activeMenu_l1 = document.querySelector('.secondary-menu').querySelectorAll('a')[0];
	    				} else if ( document.activeElement.dataset.type == 'secondary' ) {
	    					if ( document.querySelector('.accounts-menu')) {
	    						activeMenu_l1 = document.querySelector('.accounts-menu').querySelectorAll('a')[0];
	    					} else if ( document.querySelector('.sidebar .localization-form__item') ) {
	    						activeMenu_l1 = document.querySelectorAll('.sidebar .localization-form__item')[0].querySelectorAll('button')[0];
	    					} else {
	    						activeMenu_l1 = document.querySelector('.sidebar .sidebar__search form');
	    					}
	    				}
	    			}
	    		}

	    	} else if ( activeElement.classList.contains('sub-menu__last-second') ) {

	    		// second submenu items
    			if ( ! activeElement.classList.contains('parent-has-submenu') || activeElement.classList.contains('ran-over') ) {
    				if ( activeMenu_l1 ) {
	    				activeMenu_l1.focus();
    				}
				 		this.onMouseLeaveHandlerFirst();
    			} else {
    				activeElement.classList.add('ran-over');
    			}

	    	} else if ( activeElement.classList.contains('sub-menu__last-third') ) {

    				if ( activeMenu_l2 ) {
		    			activeMenu_l2.focus();
		    		}

	 					this.onMouseLeaveHandlerSecond();

	 					if ( document.activeElement.classList.contains('sub-menu__last-second') && document.activeElement.classList.contains('ran-over') ) {
			 				this.onMouseLeaveHandlerFirst();
			 				this.onMouseLeaveHandlerSecond();
	    				if ( activeMenu_l1 ) {
			    			activeMenu_l1.focus();
			    		}
			    	} else if ( document.activeElement.parentNode.classList.contains('has-second-submenu') ) {
		 					this.onMouseEnterHandlerSecond({currentTarget:document.activeElement.parentNode,preventDefault:()=>{}});
		 					if ( ! document.activeElement.classList.contains('sub-menu__last-second') ) {
		    				activeMenu_l2 = document.activeElement.parentNode.nextElementSibling.querySelector(':scope > a');
		    			} 
			    	} 

				 		if ( activeMenu_lFlag ) {
				 			activeMenu_lFlag = false;
					 		this.onMouseLeaveHandlerFirst();
				 		}

	    	}

	      activeElement = document.activeElement;

	    }
	  });

	  document.addEventListener('keydown', e=>{
	    if ( e.keyCode == window.KEYCODES.TAB ) {
	    	if ( activeElement.classList.contains('parent-has-submenu') ) {
	    		e.preventDefault();
	    		// focus on second level
	    		this.sidebarSeconds.querySelectorAll('a')[0].focus();
	    		// focus on third level
	    		if ( activeElement.classList.contains('sub-menu__link-second') ) {
	    			this.sidebarThirds.querySelectorAll('a')[0].focus();
	    		}
	  		} 
	  	} else if ( e.keyCode == window.KEYCODES.ESC ) {
	  		if ( this.sidebarSecondsFLAG ) {
			 		this.onMouseLeaveHandlerFirst();
	  		}
	  		if ( this.sidebarThirdsFLAG ) {
 					this.onMouseLeaveHandlerSecond();
	  		}
	  	}
	  });

	}

	onMouseEnterHandlerFirst(e){

		if ( window.innerWidth > 948 ) {

	 		e.preventDefault();

	 		document.body.classList.add('show-overlay');
	 		this.sidebarSeconds.classList.add('opened');
		 	this.sidebarSecondsFLAG = true;

	 		let openedSubmenu = document.createElement('div');
	 		openedSubmenu.classList.add('clone');
	 		openedSubmenu.innerHTML = e.currentTarget.querySelector(':scope > .sidebar__submenu').outerHTML;
	 		openedSubmenu = openedSubmenu.querySelector(':scope > div');

		 	if ( ! this.sidebarSecondsDOM.querySelector('.sidebar__submenu') || ( this.sidebarSecondsDOM.querySelector('.sidebar__submenu').dataset.handle != openedSubmenu.dataset.handle ) ) {
 				this.sidebarSecondsDOM.innerHTML = openedSubmenu.outerHTML;
		 	}

	 		this.sidebarSecondsDOM.querySelector(':scope > .sidebar__submenu .sub-menu').style.paddingTop = e.currentTarget.getBoundingClientRect().top + 'px';
	 		setTimeout(()=>{
	 			this.sidebarSecondsDOM.querySelector(':scope > .sidebar__submenu').classList.add('submenu-opened');
	 		}, 10);	

		 	this.sidebarSecondsDOM.querySelectorAll('.has-second-submenu').forEach(elm=>{

		 		elm.addEventListener('touchstart', e=>{
		 			e.preventDefault();
	 				elm.parentNode.querySelectorAll('a')[0].style.pointerEvents = 'none'; 
		 			this.onMouseEnterHandlerSecond({currentTarget:elm,preventDefault:()=>{}});
	 				if ( this.sidebarThirdsFLAG ) {
	 					this.onMouseLeaveHandlerSecond();
	 				}
	 			}, {passive: true});

		 		elm.addEventListener('mouseenter', this.onMouseEnterHandlerSecond.bind(this));
		 		elm.addEventListener('mouseleave', ()=>{
	 				if ( this.sidebarThirdsFLAG ) {
	 					this.onMouseLeaveHandlerSecond();
					}
		 		})

		 	});

	 		e.currentTarget.addEventListener('mouseleave', this.onMouseLeaveHandlerSecond.bind(this));

	 	}

	}

	onMouseEnterHandlerSecond(e){

		e.preventDefault();

 		this.sidebarThirds.classList.add('opened');
 		this.sidebarThirdsFLAG = true;

 		let openedSubmenu = document.createElement('div');
 		openedSubmenu.classList.add('clone');
 		openedSubmenu.innerHTML = e.currentTarget.querySelector(':scope > .sidebar__submenu').outerHTML;
 		openedSubmenu = openedSubmenu.querySelector(':scope > div');

 		if ( !this.sidebarThirdsDOM.querySelector('.sidebar__submenu') || ( this.sidebarThirdsDOM.querySelector('.sidebar__submenu') && this.sidebarThirdsDOM.querySelector('.sidebar__submenu').dataset.handle != openedSubmenu.dataset.handle ) ) {
 			this.sidebarThirdsDOM.innerHTML = openedSubmenu.outerHTML;
 		}

		this.sidebarThirdsDOM.querySelector(':scope > .sidebar__submenu .sub-menu').style.paddingTop = e.currentTarget.getBoundingClientRect().top + 'px';
 		setTimeout(()=>{
 			this.sidebarThirdsDOM.querySelector(':scope > .sidebar__submenu').classList.add('submenu-opened');
 		}, 10);	

	}

	onMouseLeaveHandlerFirst(){
 		this.sidebarSeconds.classList.remove('opened');
 		if ( this.sidebarSeconds.querySelector('.submenu-opened') ) {
	 		this.sidebarSeconds.querySelector('.submenu-opened').classList.remove('submenu-opened');
	 	}
 		document.body.classList.remove('show-overlay');
 		this.sidebarSecondsFLAG = false;
	}

	onMouseLeaveHandlerSecond(){
 		this.sidebarThirds.classList.remove('opened');
 		if ( this.sidebarThirds.querySelector('.submenu-opened') ) {
	 		this.sidebarThirds.querySelector('.submenu-opened').classList.remove('submenu-opened');
	 	}
 		this.sidebarThirdsFLAG = false;
	}

	setSidebarHeight(){
		document.querySelectorAll('.sidebar__cart, .sidebar__cart .cart, .sidebar__search, .collection__filters, .collection__filters .filters').forEach(elm=>{elm.style.height=window.innerHeight+'px'});
		document.querySelector('.sidebar__menus').style.height = window.innerHeight+'px';
		if ( document.querySelector('.sidebar__search.predictive-search .sidebar__search-results') ) {
			document.querySelector('.sidebar__search.predictive-search .sidebar__search-results').style.maxHeight =`${window.innerHeight - (document.body.classList.contains('show-announcement-bar') ? 200 : 160)}px`;
		}
	}

}

customElements.define('main-sidebar', MainSidebar);

// static events for modal overlays

let overlay = document.createElement('span');
overlay.className = 'cart-overlay-background';
overlay.addEventListener('click', ()=>{
	document.querySelector('sidebar-drawer.opened').hide();
});
document.body.append(overlay);

overlay = document.createElement('span');
overlay.className = 'sidebar-overlay-background';
overlay.addEventListener('click', ()=>{
	document.querySelector('sidebar-drawer.opened').hide();
});
document.body.append(overlay);

class SidebarDrawer extends HTMLElement {

	constructor(){
		super();
		this.querySelector('[data-js-close]').addEventListener('click', ()=>{
			this.hide();
		});
		document.addEventListener('keydown', e=>{
			if ( e.keyCode == window.KEYCODES.ESC ) {
				const openedSidebar = document.querySelector('sidebar-drawer.opened');
				if ( openedSidebar ){
					openedSidebar.hide();
				}
			}
		});
		this.setAttribute('style', '');
	}

	show(){

		this.opened = true;
		this.classList.add('opened');
		document.body.classList.add('overflow-hidden');

		if ( this.dataset.overlay == 'sidebar' ) {
			document.querySelector('.sidebar-overlay-background').classList.add('show');
		} else if ( this.dataset.overlay == 'cart' ) {
			document.querySelector('.cart-overlay-background').classList.add('show');
		}

		document.querySelectorAll('.sidebar__cart, .sidebar__cart .cart, .sidebar__search, .collection__filters, .collection__filters .filters').forEach(elm=>{elm.style.height=window.innerHeight+'px'});
		document.querySelector('.sidebar__menus').style.height = window.innerHeight+'px';
		if ( document.querySelector('.sidebar__search.predictive-search .sidebar__search-results') ) {
			document.querySelector('.sidebar__search.predictive-search .sidebar__search-results').style.maxHeight = (window.innerHeight-170)+'px';
		}

		this._mountA11YHelper();

	}

	hide(){

		this.opened = false;
		this.classList.remove('opened');
		document.body.classList.remove('overflow-hidden');

		if ( this.dataset.overlay == 'sidebar' ) {
			document.querySelector('.sidebar-overlay-background').classList.remove('show');
		} else if ( this.dataset.overlay == 'cart' ) {
			document.querySelector('.cart-overlay-background').classList.remove('show');
		}

		this._unmountA11YHelper();

	}


	/*
		* a11y helpers / tab catcher 
	*/

	_mountA11YHelper(forcedFocus){

		let focusable = forcedFocus ? forcedFocus : this.querySelectorAll('[tabindex="0"], button, [href], input:not([type="hidden"]), select, textarea, .regular-select-cover');

		let firstFocusable = focusable[0];
		let lastFocusable = focusable[focusable.length - 1];

		if ( this.classList.contains('sidebar__cart') && ! this.querySelector('.cart__form').classList.contains('cart--empty') ) {
			lastFocusable = focusable[focusable.length - 2];
		}

		this.A11Y_TAB_EVENT = ((firstFocusable, lastFocusable, e)=>{
		  let isTabPressed = (e.key === 'Tab' || e.keyCode === window.KEYCODES.TAB);
		  if (!isTabPressed) { 
		    return; 
		  }
		  if ( e.shiftKey ) /* shift + tab */ {
		    if (document.activeElement === firstFocusable) {
	     		lastFocusable.focus();
	        e.preventDefault();
	      }
	    } else /* tab */ {
		    if (document.activeElement === lastFocusable) {
	      	firstFocusable.focus();
	        e.preventDefault();
	      }
	    }
		}).bind(this, firstFocusable, lastFocusable)

 		this.addEventListener('keydown', this.A11Y_TAB_EVENT);

	}

	_unmountA11YHelper(sidebar){
		this.removeEventListener('keydown', this.A11Y_TAB_EVENT);
	}

}

customElements.define('sidebar-drawer', SidebarDrawer);
