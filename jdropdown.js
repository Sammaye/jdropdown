/**
 * Jdropdown
 *
 * @author Sam Millman
 * @licence GNU or whatever
 *
 * This plugin basically allows you to connect a menu to an anchor.
 * This anchor can be literally anything, from a <div/> to an <a/> and even a <li/>.
 */
(function($){
	var options = {
		type: '',
		items: {},
		source: {},
		orientation: 'over',
		menu_div: '',
		item: ''
	},
	methods = {
		init: function(options){
			return this.each(function(){
				var $this = $(this),
				items = $this.data('items');

				if(!$this.data('jdropdown')){

					$(options.menu_div).addClass("jdropdown-menu");

					switch(true){
						case !$.isEmptyObject(options.items): // Load URL
							$(this).addClass('jdropdown-anchor').data('jdropdown', {
								'type': 'itemised',
								'items': typeof items === 'object' ? items : options.items,
								'anchor': $(this),
								'menu': $(options.menu_div),
								'options': options
							}).on({ 'click': open });
							break;
						case !$.isEmptyObject(options.source): // Then we want an AJAX powered Menu.
							$(this).addClass('jdropdown-anchor').data('jdropdown', {
								'type': 'ajax',
								'source': options.source,
								'anchor': $(this),
								'menu': $(options.menu_div),
								'options': options
							}).on({ 'click': open });
							break;
						default: // Just show the damn menu
							$(this).addClass('jdropdown-anchor').data('jdropdown', {
								'type': 'norm',
								'anchor': $(this),
								'menu': $(options.menu_div),
								'options': options
							}).on({ 'click': open });

							$(document).on('click', options.item, selectItem);
							break;
					}
				}
				return this;
			});
		},
		destroy: function(){}
	},
	open = function(event){
		event.preventDefault();
		if($(this).hasClass('jdropdown-active')){
			close();
			return;
		}else{
			close();
		}

		var data  = $(this).data('jdropdown'),
		offset = $(this).offset(),
		container = data.menu;

		switch(true){
			case data.type == 'ajax':
				data.menu.load(data.source.url, data.source.params);
				break;
			case data.type == 'norm':
				break;
			case data.type == 'itemised':
				container.data('jdropdown', data);
				container.empty();

				if($.isFunction(data.renderMenu)){
					if($.isFunction(data.renderItem)){
						var ul = data.renderItem(data.renderMenu(), data.items);
					}else{
						var ul = renderItem(data.renderMenu(), data.items);
					}
				}else{
					if($.isFunction(data.renderItem)){
						var ul = data.renderItem($( '<ul></ul>' ), data.items);
					}else{
						var ul = renderItem($( '<ul></ul>' ), data.items);
					}
				}
				ul.appendTo( container );
				break;
		}

		if(data.options.orientation == 'left'){
			data.menu.css({
				'position': 'absolute',
				'left': offset.left,
				'top': (offset.top + $(this).outerHeight()),
				'display': 'block'
			});
		}else if(data.options.orientation == 'over'){
			data.menu.css({
				'position': 'absolute',
				'left': offset.left,
				'top': (offset.top),
				'display': 'block'
			});
		}else{
			data.menu.css({
				'position': 'absolute',
				'left': (offset.left - container.outerWidth()) + $(this).outerWidth(),
				'top': (offset.top + $(this).outerHeight()),
				'display': 'block'
			});
		}
		$(this).addClass('jdropdown-active').trigger('jdropdown.open');
	},
	renderItem = function($menu, $items){
		$.each($items, function(i, item){
			$('<li></li>').data('jdropdown.item', item).append(
				$( "<a></a>" ).attr({
					'href': '#', 'class': item['class']
				}).text( item.label ).on({ 'click': selectItem })
			).appendTo( $menu );
		});
		return $menu;
	},
	selectItem = function(){
		close();
		$(this).trigger('jdropdown.selectItem');
	},
	close = function(){
    	$('.jdropdown-menu').css({ 'display': 'none' }); //hide all drop downs
    	$('.jdropdown-anchor').removeClass("jdropdown-active");
		$(this).trigger('jdropdown.close');
	};

	$(document).on('click', function(e) {
	    // Lets hide the menu when the page is clicked anywhere but the menu.
	    var $clicked = $(e.target);
	    if (!$clicked.closest("jdropdown-menu").length && !$clicked.closest("jdropdown-anchor").length){
	    	//alert("closing");
	    	close();
		}
	});

	$(window).resize(function(){
		if($('.jdropdown-active').length > 0){
			var offset = $('.jdropdown-active').offset(),
				data  = $('.jdropdown-active').data('jdropdown'),
				container = data.menu;

			if(data.options.orientation == 'left'){
				data.menu.css({
					'position': 'absolute',
					'left': offset.left,
					'top': (offset.top + $('.jdropdown-active').outerHeight()),
					'display': 'block'
				});
			}else{
				data.menu.css({
					'position': 'absolute',
					'left': (offset.left - container.outerWidth()) + $('.jdropdown-active').outerWidth(),
					'top': (offset.top + $('.jdropdown-active').outerHeight()),
					'display': 'block'
				});
			}
		}
	});

	$.fn.jdropdown = function(method){
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.j_slider' );
		}
	};
})(jQuery);
