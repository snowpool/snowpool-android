$(document).bind("mobileinit", function(){
  $.mobile.defaultPageTransition = 'none';
  $.mobile.defaultDialogTransition = 'none';
  $(".refresh_button").live('click',function(){
    empty_and_refresh_carpools();
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

  $("a.country_click").live('click',function(){
    window.localStorage.setItem("chosenCountry" ,$(this).attr('id'));
  });
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
