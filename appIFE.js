/* globals window, document, $, App */

(function IIFE() {
  'use strict';

  var Application = {
    version: 1.0,
    name: 'CV app',
    templates: {},

    initialize: function initialize() {
      _menuClicked('personal_data');

      $('#menu_bars').on('click', showMenu);
      $('#app_menu_options li').on('click', openLoadMenu);

      $('#icon_print').on('click', print_cv);
      $('#a_print').on('click', print_cv);

      $('#icon_download').on('click', download_pdf);
      $('#a_download').on('click', download_pdf);

      $('#a_linkedin').on('click', function() {
        openUrl('https://www.linkedin.com/in/lidia-pinazo-4b258883?trk=nav_responsive_tab_profile') ;
      });
      $('#a_facebook').on('click', function() {
        openUrl('https://www.facebook.com/lidiaps');
      });
      $('#a_email').on('click', function() {
        openUrl('mailto:xxxx@hotmail.com');
      });

      $('#sendForm').on('click', onSendClicked);
    },

    //con callback
    load: function load(tmpl, callback) {
      callback = typeof callback === 'function' ? callback : function() {};

      $.ajax({
        url: tmpl + '.html',
        cache: false,
        success: callback.bind(this),
        error: function (error) {
          console.log(error);
        }
      });
    },

    //con promesas
    loadP: function loadP(template) {
      if (template in this.templates) {
        return this.templates[template];
      }

      this.templates[template] = new window.Promise(function executor(resolve, reject) {
        $.ajax({
          url: template + '.html',
          cache: false,
          success: resolve,
          error: reject
        });
      });
      return this.templates[template];
    },

    render: function render(html) {
      $('#content').html(html);
    }
  };

  function _menuClicked(template) {
    Application.loadP(template)
      .then(Application.render)
      .then(setSendButtonClick)
      .then(window.setTimeout(setListeners, 0))
      .catch(console.error.bind(console));
  }

  function setSendButtonClick() {
    window.setTimeout($('#sendForm').on('click', onSendClicked), 0);
  }

  function setListeners() {
    $('#icon_mobile').on('click', function() { openUrl('tel:666666666'); });
    $('#a_mobile').on('click', function() { openUrl('tel:666666666'); });
    $('#icon_mailto').on('click', function() {  openUrl('mailto:xxxx@hotmail.com');});
    $('#a_mailto').on('click', function() { openUrl('mailto:xxxx@hotmail.com');});
  }

  function showMenu() {
    $('#app_menu_options').toggleClass('menu_opened');
    if ($('#app_menu_options').hasClass('menu_opened')) {
      $('#app_menu_options').show();
    } else {
      $('#app_menu_options').hide();
    }
  }

  function openLoadMenu() {
    var template = $(this).data('template');

    _menuClicked(template);
    showMenu();
  }

  function print_cv() {
    window.print();
  }

  function download_pdf() {
    //TO DO
    alert('download');
  }

  function openUrl(url) {
    window.open(url, '_blank');
  }

  function onSendClicked() {
    var name, email, comment, contact;

    name    = $('#contact_name').val();
    email   = $('#email').val();
    comment = $('#comment').val();

    contact = new Contact(name, email, comment);

    if (contact.isValid()) {
      contact.send();
      //TO DO: De alguna forma habria que verificar también que el envío ha sido correcto o no e informar al usuario
    } else {
      $('#div_msg').html(contact.errors);
      $('#div_msg').show();
    }
  }

  function Contact(contact_name, email, comment) {
    this.contact_name = contact_name;
    this.email = email;
    this.comment = comment;
    this.errors = '';
  }

  Contact.prototype.isValid = function isValid() {
    var result;
    result = true;

    if (isEmpty(this.contact_name)) {
      result = false;
      this.errors = 'Indica un nombre<br />';
    }
    if (isEmpty(this.email)) {
      result = false;
      this.errors += 'Indica un email de contacto<br />';
    } else {
      if (!isEmail(this.email)) {
        result = false;
        this.errors += 'El formato del email no es correcto<br />';
      }
    }
    if (isEmpty(this.comment)) {
      result = false;
      this.errors += 'Indica un comentario<br />';
    }

    return result;
  };

  Contact.prototype.send = function send() {
    $('#form_contact').submit();
    return;
  };

  function isEmail(email) {
    //TO DO
    return true;
  }

  function isEmpty(str) {
    str = str.trim();
    return (str === null) || (str === '');
  }

  //para tener acceso a App desde fuera del IIFE
  window.App = Application;

})();

$(document).ready(App.initialize);
