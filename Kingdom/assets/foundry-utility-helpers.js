/**
 * "initializeModal" initializes and manages modal functionality for a given button and modal content.
 * This function sets up event listeners for opening and closing the modal,
 * handles accessibility attributes, and registers handlers for keyboard and click events
 * to close the modal. It requires the ID of the modal button and the modal content container.
 *
 * @param {string} buttonSelector - The selector of the button that triggers the modal.
 * @param {string} modalContentSelector - The selector of the container holding the modal's HTML content.
 */
const initializeModal = (buttonSelector, modalContentSelector) => {
  const lightBox = window.basicLightbox; // From Kingdom's assets/component-lightbox.js
  const modalButton = document.querySelector(buttonSelector);
  const modalContent = document.querySelector(modalContentSelector).innerHTML;

  const instance = lightBox.create(modalContent, {
    onShow: (instance) => {
      const modal = instance.element().querySelector('.modal');
      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('is-open');
    },
    onClose: (instance) => {
      const modal = instance.element().querySelector('.modal');
      modal.setAttribute('aria-hidden', 'true');
    }
  });

  modalButton.addEventListener('click', () => {
    instance.show();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && instance.visible()) {
      instance.close();
    }
  });

  document.body.addEventListener('click', event => {
    if (event.target.matches('[data-micromodal-close]')) {
      instance.close();
    }
  });
};


/*
Take in a number and return a String
@param money {Num|String}
@return {String} a value with at most 2 significant digits. Returns no cents if
  cents are 0.
*/
const monetize = (money) => {
  const floatMoney = parseFloat(money)
  const intNum = parseInt(floatMoney)
  return intNum === floatMoney ? String(intNum) : floatMoney.toFixed(2)
}

/*
 Extract escaped HTML and get its textcontent.
*/
const htmlDecode = (input) => {
  const doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

const openMiniCart = () => {
  document.querySelector('.sidebar__cart').show();
}



export {
  htmlDecode,
  initializeModal,
  monetize,
  openMiniCart
}
