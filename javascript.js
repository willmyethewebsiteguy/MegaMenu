/*===================
  Version 1.8.91
  Mega Menu for Squarespace 7.1 Websites
  This Code is licensed by Will-Myers.com 
  
  Updates:
  Added up to close mega menu when clicked on again, when set on clickThrough
===================*/
function MegaMenu(link, menu, menuClone, headerLinkTrigger, clickthrough, animation, action, showClose, mobileMenuType){
  let thisObj = this,
      $header = $('#header'),
      $siteWrapper = $('#siteWrapper'),
      $thingsToTurnOffMenu,
      moveTimer;
  thisObj.linkUrl = link;
  thisObj.menuClone = menuClone;
  thisObj.menu = menu;
  thisObj.trigger = headerLinkTrigger;
  thisObj.clickThrough = clickthrough;
  thisObj.animation = animation;
  thisObj.action = action;
  thisObj.showClose = showClose;
  thisObj.mobileType = mobileMenuType;
  /*Append Cloned Section to Header*/
  $(thisObj.menuClone).addClass('wm-mega-menu-item');
  $siteWrapper.append($(thisObj.menuClone));
  
  if (thisObj.action == 'hover') {
    thisObj.action = 'mouseover'
  } else if (thisObj.action == 'click') {
    thisObj.action = 'click';
  }
  if(thisObj.showClose){
    $(thisObj.menuClone).addClass('show-close-button')
  }

  $(thisObj.menuClone).append('<button aria-label="Close" class="mega-close-btn"></button>');
  $(thisObj.menuClone).find('.mega-close-btn').on('click', function(){
    hideAllMenus();
  });
  /*Add Class to Trigger*/
  $(thisObj.trigger).addClass('wm-mega-menu-trigger');
  $('[data-folder="root"].header-menu-nav-folder').find('a[href="' + thisObj.linkUrl + '"]').closest('.header-menu-nav-item').addClass('mobile-mega-trigger');
  
  //Add Menu to Mobile Folder
  if (thisObj.mobileType == 'section') {
    let mobileClone = thisObj.menu.clone(),
        folder = $('[data-folder="' + thisObj.linkUrl + '"] .header-menu-nav-folder-content');
    folder.append(mobileClone);
    folder.addClass('has-mega-section')
  }

  /*If ClickThrough is True*/
  if (thisObj.clickThrough) {
    $(thisObj.trigger).on('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      window.location.href = thisObj.clickThrough;
    });;
  } else {
    $(thisObj.trigger).find('a').on('click', function(e){
      e.preventDefault();
    });;
  }
  let $deactivateTriggers
  function getDeactivateTriggers(){
    $deactivateTriggers = $('.header-display-desktop .header-nav-wrapper .header-nav-item').add('#wm-subnav .header-nav-item').add('.header-actions-action--cta').add('.sqs-announcement-bar-dropzone').add('#site-title').add('.header-display-desktop .header-title-logo').add('.header-actions .header-actions-action').add('.header-actions .user-accounts-link').not('.wm-mega-menu-trigger');
  }
  getDeactivateTriggers()
  /*Set Animation*/
  thisObj.menuClone.addClass('mega-animation-' + thisObj.animation)

  $(thisObj.menuClone).on('mouseleave', function(e){
    e.preventDefault();
    e.stopPropagation();
    hideAllMenus();
  });

  /*Function to hide All Menus*/
  function hideAllMenus(){
    $('.show-mega-menu').removeClass('show-mega-menu');
    $deactivateTriggers.off('mouseenter mouseleave');
    $('#header .header-announcement-bar-wrapper').removeClass('mega-menu-on'); 
    $('.active-mega').removeClass('active-mega');
    $('body').removeClass('wm-active-mega-menu');
  }
  let openTimer;
  /*Show on Hover*/

  $(thisObj.trigger).on('click', function(e){
    if ($('body').hasClass('wm-active-mega-menu')) {
      $(thisObj.menuClone).removeClass('show-mega-menu');
      $('#header .header-announcement-bar-wrapper').removeClass('mega-menu-on');
      $(thisObj.trigger).removeClass('active-mega');
      $('body').removeClass('wm-active-mega-menu');
    }
  })

  $(thisObj.trigger).on(thisObj.action, function(e){
    e.preventDefault();
    e.stopPropagation();
    setHeight();
    getDeactivateTriggers()
    openTimer = setTimeout(function(){
      hideAllMenus();
      $(thisObj.menuClone).addClass('show-mega-menu');
      $('#header .header-announcement-bar-wrapper').addClass('mega-menu-on');
      $(thisObj.trigger).addClass('active-mega');
      $('body').addClass('wm-active-mega-menu');
      $deactivateTriggers.on('mouseenter', function() {
        e.preventDefault();
        e.stopPropagation();
        moveTimer = setTimeout(function(){
          $(thisObj.menuClone).removeClass('show-mega-menu');
          $('#header .header-announcement-bar-wrapper').removeClass('mega-menu-on');
          $(thisObj.trigger).removeClass('active-mega');
          $('body').removeClass('wm-active-mega-menu');
        }, 100);})
        .on('mouseleave', function() {
        clearTimeout(moveTimer);
      });
    }, 100);
  })
    .on('mouseleave', function(){
    clearTimeout(openTimer);
  });


  $('#page').on('scroll resize', function(){
    hideAllMenus();
  });
  
  function setHeight() {
    let headerJS = document.querySelector('#header');
    let $headerBottom = headerJS.getBoundingClientRect().bottom;
    $headerBottom =  $headerBottom < 0 ? 0 : $headerBottom;
    let $headerHeight = headerJS.getBoundingClientRect().height;
    thisObj.menuClone.css('--wM-headerBottom', $headerBottom + 'px');
    thisObj.menuClone.css('--wM-headerHeight', $headerHeight + 'px');
  }
}

/*Constructor*/
$('[data-mega-menu]').each(function(){
  let link = $(this).attr('data-mega-menu'),
      menu = $(this).closest('#footer-sections .page-section'),
      menuClone = $(menu).clone().css('display', 'none'),
      headerLinkTrigger = $('#header a[href="' + link + '"]').closest('.header-nav-item').first(),
      mobileMenuType = $(this).attr('data-mobile-type') == 'section' ? 'section' : 'folder',
      action = typeof $(this).attr('data-action') == 'undefined' ? 'hover' : $(this).attr('data-action'),
      clickthrough = typeof $(this).attr('data-clickthrough') == "undefined" ? false : $(this).attr('data-clickthrough'),
      animation = typeof $(this).attr('data-animation') == "undefined" ? 'fade' : $(this).attr('data-animation'),
      showClose = $(this).attr('data-show-close') == "true" ? true : false;
  $(menuClone).find('[data-mega-menu]').closest('.sqs-block').addClass('remove-height');
  $(menu).addClass('footer-mega-menu')
  new MegaMenu(link, menu, menuClone, headerLinkTrigger, clickthrough, animation, action, showClose, mobileMenuType);
  $('body').addClass('tweak-wm-mega-menu');
});

/*First Present At All*/
if($('[data-mega-menu]').length) {
  $('head').prepend('<link href="cdn.jsdelivr.net/gh/willmyethewebsiteguy/MegaMenu@1.9.001/styles.css" rel="stylesheet">');

  /*Add active Menu link Class on ClickThrough Items*/
  $(function(){
    $('[data-clickthrough]').each(function(){
      let currentUrl = window.location.pathname;
      let menuLink = $(this).attr('data-mega-menu');
      let clickThrough = $(this).attr('data-clickthrough');
      if (currentUrl == clickThrough) {
        $('#header .header-display-desktop .header-nav-wrapper [href="' + menuLink + '"]').closest('.wm-mega-menu-trigger').addClass('header-nav-item--active');
      }
    });
  }) 

  $(function(){
    function loadPluginImages() {
      var images = document.querySelectorAll('.wm-mega-menu-item img[data-src]' );
      for (var i = 0; i < images.length; i++) {
        ImageLoader.load(images[i], {load: true});
      }
    }
    loadPluginImages();

  /*If in the Backend Editor*/
    if(window.self !== window.top){
      $('[data-test="frameToolbarEdit"]', parent.document).on('click', function(){
        $('.wm-mega-menu-item').remove();
      })
    }
  })
}
