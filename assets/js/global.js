$(document).bind("mobileinit", function(){
  $.mobile.defaultPageTransition = 'none';
  $.mobile.defaultDialogTransition = 'none';
  
  $(".refresh_button").live('click',function(){
    empty_and_refresh_carpools();
    return false;
  });
  $("#send_message_button").live('click',function(){
    $.ajax({
      type: "POST",
      url: 'http://api.lvh.me:3000/pools/'+$("#pool_id").val()+'/sendmessage.js',
      data: {
       "token" : users_token(),
       "message" : $("#pool_message").val()
      }, 
      success: function(data) {
        $("#country_pool_list").append('<div class="notice" data-role="flash">message has been sent</div>');
        $.mobile.changePage("#country_pool_list");
      },
      error: function(data){
        if ($.parseJSON(data.responseText).message == 'Invalid token.'){
          window.localStorage.setItem("valid_login" ,"false");
          $("#sign_in").append('<div class="notice" data-role="flash">Your login has expired, please login again.</div>');
          $(".login_button").show();
          $(".add_carpool_button").hide();
          $.mobile.changePage("#sign_in");
        }else if ($.parseJSON(data.responseText).message == 'Cannot send email to yourself!'){
          $(".pool_flash").empty().append('<font color="red">Cannot send email to yourself</font>');
        }
        else{
          $(".pool_flash").empty().append('<font color="red">Cannot send an empty message</font>');
        }
      },
      dataType: "json"
    });
  });
  $("#sign_in_button").live('click',function(){
    $.ajax({
      type: "POST",
      url: 'http://api.lvh.me:3000/tokens.js',
      data: {
       "email" : $("#sign_in_email").val(),
       "password" : $("#sign_in_password").val()
      }, 
      success: function(data) {
        $(".login_button").hide();
        $(".add_carpool_button").show();
        alert("You are logged in");
        window.localStorage.setItem("token" ,data.token);
        window.localStorage.setItem("valid_login" ,"true");
        $.mobile.changePage("#country_pool_list");
      },
      error: function(data){
        window.localStorage.setItem("valid_login" ,"false");
        alert($.parseJSON(data.responseText).message);
      },
      dataType: "json"
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
      if (user_is_valid()){
        $("#pool_details").append("<br/><br/><strong>Send "+data.name+" a message</strong><br/>");
        $("#pool_details").append("<textarea name=\"messageText\" id=\"pool_message\"></textarea>");
        $("#pool_details").append("<input type=\"hidden\" id=\"pool_id\" value=\""+data.id+"\"></textarea>");
        $("#pool_details").append('<button type="submit" data-theme="a" id="send_message_button">Send Message</button>');
      }else{
        $("#pool_details").append("<h4>If you sign in, then you can send the user a message.</h4>");
      }
      $("#pool_details").trigger('create');
    });
  });

  $("a.country_click").live('click',function(){
    window.localStorage.setItem("chosenCountry" ,$(this).attr('id'));
    //get the fields for this country
    $.getJSON("http://api.lvh.me:3000/countries/"+window.localStorage.getItem("chosenCountry")+"/fields.js", function(data) {
      window.localStorage.setItem("country_fields" ,data);
      window.localStorage.setItem("has_country_fields" ,"true");
    });
  });
});

function empty_and_refresh_carpools(){
  $("#append-pools").empty();
  $.getJSON("http://api.lvh.me:3000/countries/"+window.localStorage.getItem("chosenCountry")+".js?callback=?", function(data) {
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

 //setup all the local variables etc
 function setup(){
  if (user_is_valid()){
    $(".login_button").hide();
  }else{
    $(".add_carpool_button").hide();
  }
 }

 /* trigger the setup once the page has been loaded for the first time - only gets triggered once */
 $(document).ready(function(){
  setup();
 });

  function user_is_valid(){
    return window.localStorage.getItem("valid_login") == "true";
  }
  function users_token(){
    return window.localStorage.getItem("token");
  }
