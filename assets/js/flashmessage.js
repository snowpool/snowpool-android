/*
* jQuery Mobile Framework : "flashMessage" plugin
* flashes a brief message displaying whatever is in a
* container with data-role=flash, useful for short notices
* like "Your settings has been saved"
*/

(function($, undefined ) {

$.widget( "mobile.flashMessage", $.mobile.widget, {
        options: {
            fadeOutTime: 2000
        },
        _create: function(o){
            $elem = this.element;
            $elem.addClass('ui-flash');
            $elem.fadeOut( this.options.fadeOutTime, function(){
                    $elem.remove();
            });
        }
});

$('.ui-page').live('pageshow', function(){
        $("[data-role='flash']").flashMessage();
});

})( jQuery );
