$(document).ready(function(){
  $.getJSON("http://api.lvh.me:3000/countries.js?callback=?", function(data) {
    if(data.length == 0){
      return;
    }
    $.each(data, function(i,item){
      $('<li><a class="country_click" id="'+item.country.cached_slug+'" href="#country_pool_list">'+item.country.name+'</li>').appendTo("#country_list");
    });
    $("#country_list").listview('refresh');
  });
  $("a.country_click").live('click',function(){
    $("#append-pools").empty();
    $.getJSON("http://api.lvh.me:3000/countries/"+$(this).attr('id')+".js?callback=?", function(data) {
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
        $('<li><a class="pool_link" data-identity="'+item.id+'" href="#pool_view">'+item.title+'</li>').appendTo("#append-pools");
      });
      $("#append-pools").listview('refresh');
      return false;
    });
  });
  $("a.pool_link").live('click',function(e){
    $("#pool_details").empty();
      $.getJSON("http://api.lvh.me:3000/pools/"+$(this).data('identity')+".js?callback=?", function(data) {
        $("#pool_details").append("<h2>Carpool to "+data.field+"</h2>");
        $("#pool_details").append("<strong>Date Leaving</strong><br/>"+data.start+"<br/>");
        $("#pool_details").append("<strong>Date Returning</strong><br/>"+data.endDisp+"<br/>");
        $("#pool_details").append("<strong>Name</strong><br/>"+data.name+"<br/>");
        if (data.telephone != ""){
          $("#pool_details").append("<strong>Telephone</strong><br/>"+data.telephone+"<br/>");
        }
        if (data.message != ""){
          $("#pool_details").append("<strong>Message</strong><br/>"+data.message+"<br/>");
        }


    });
  });
});

