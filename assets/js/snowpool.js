$(document).ready(function(){
  if (window.localStorage.getItem("chosenCountry")){
    //then move straight to that country's show
    $.mobile.changePage("#country_pool_list","slide");
    empty_and_refresh_carpools();
  }
  $.getJSON("http://api.snowpool.org/countries.js?callback=?", function(data) {
    if(data.length == 0){
      return;
    }
    $.each(data, function(i,item){
      $('<li><a class="country_click" id="'+item.country.cached_slug+'" href="#country_pool_list">'+item.country.name+'</li>').appendTo("#country_list");
    });
    $("#country_list").listview('refresh');
  });
  $('#country_pool_list').live("pageshow", function(){ // or pageshow
    //refresh the list of pools
    empty_and_refresh_carpools();
  });
  function empty_and_refresh_carpools(){
    $("#append-pools").empty();
    $.getJSON("http://api.snowpool.org/countries/"+window.localStorage.getItem("chosenCountry")+".js?callback=?", function(data) {
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
  }
  $("a.country_click").live('click',function(){
    window.localStorage.setItem("chosenCountry" ,$(this).attr('id'));
    return false;
  });
  $("a.pool_link").live('click',function(e){
    $("#pool_details").empty();
      $.getJSON("http://api.snowpool.org/pools/"+$(this).data('identity')+".js?callback=?", function(data) {
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

