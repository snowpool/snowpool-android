$(document).ready(function(){
  $.getJSON("http://api.lvh.me:3000/countries.js?callback=?", function(data) {
    if(data.length == 0){
      return;
    }
    $.each(data, function(i,item){
      $('<li><a class="country_click" href="'+item.country.cached_slug+'">'+item.country.name+'</li>').appendTo("#country_list");
    });
    $("#country_list").listview('refresh');
  });
  $("a.country_click").live('click',function(){
    $.mobile.changePage( $("#country_pool_list"), { transition: "slideup"},false );
    $("#append-pools").empty();
    $.getJSON("http://api.lvh.me:3000/countries/"+$(this).attr('href')+".js?callback=?", function(data) {
      if(data.length == 0){
        $('<li data-role="list-divider">No current carpools</li>').appendTo("#append-pools");
        $("#append-pools").listview('refresh');
        return;
      }
      var initDate = data[0].start;
      $('<li data-role="list-divider">Leaving: '+initDate+'</li>').appendTo("#append-pools");
      $.each(data, function(i,item){
        if (initDate != item.start){
          initDate = item.start;
          $('<li data-role="list-divider">Leaving: '+initDate+'</li>').appendTo("#append-pools");
        } 
        $('<li><a href="'+item.url+'">'+item.title+'</li>').appendTo("#append-pools");
      });
      $("#append-pools").listview('refresh');
      return false;
    });
  });
});

