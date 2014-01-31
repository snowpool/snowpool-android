$(document).bind("mobileinit", function(){
  $.mobile.defaultPageTransition = 'none';
  $.mobile.defaultDialogTransition = 'none';
  $(document).on("click", ".refresh_button", function(){
    empty_and_refresh_carpools();
    return false;
  });
  $(document).on("click", ".change_country_button", function(){
    clear_data();
  });


  /* start of filter code */


  $(document).on("click", "#offeredFilter", function(){
    offeredFilter();
    window.localStorage.setItem("currentFilter" ,"offeredFilter");
    setFilterTheme("offeredFilter");
  });

  $(document).on("click", "#allFilter", function(){
    allFilter();
    window.localStorage.setItem("currentFilter" ,"allFilter");
    setFilterTheme("allFilter");
  });

  $(document).on("click", "#wantedFilter", function(){
    wantedFilter();
    window.localStorage.setItem("currentFilter" ,"wantedFilter");
    setFilterTheme("wantedFilter");
  });

  /* end of filter code */

  $(document).on("click", "#delete_carpool_button", function(){
    if (confirm('Really Delete Your Carpool?')){
      $.ajax({
        type: "POST",
        url: 'http://api.snowpool.org/pools/'+$("#pool_id").val() + '.js',
        data: {
         "_method" : 'delete',
         "token" : users_token()
        },
        success: function(data) {
          alert("Carpool has been deleted");
          $.mobile.changePage("#country_pool_list");
        }
      });
    }
  });

  $(document).on("click", "#send_message_button", function(){
    $.ajax({
      type: "POST",
      url: 'http://api.snowpool.org/pools/'+$("#pool_id").val()+'/sendmessage.js',
      data: {
       "token" : users_token(),
       "message" : $("#pool_message").val()
      }, 
      success: function(data) {
        alert("Email has been sent");
        $.mobile.changePage("#country_pool_list");
      },
      error: function(data){
        if ($.parseJSON(data.responseText).message == 'Invalid token.'){
          window.localStorage.setItem("valid_login" ,"false");
          alert("Your login has expired, please login again.");
          $(".login_button").show();
          $(".add_carpool_button").hide();
          $.mobile.changePage("#sign_in");
        }else if ($.parseJSON(data.responseText).message == 'Cannot send email to yourself!'){
          alert("Cannot send an email to yourself!");
        }
        else{
          alert("Cannot send an empty email!");
        }
      },
      dataType: "json"
    });
  });
  $(document).on("click", "#submit_carpool_button", function(){
    window.localStorage.setItem("city" ,$("#carpool_leaving_from").val());
    window.localStorage.setItem("telephone" ,$("#carpool_telephone").val());
    $.ajax({
      type: "POST",
      url: 'http://api.snowpool.org/pools.js',
      data: {
       "token" : users_token(),
       "pool[leaving_from]" : $("#carpool_leaving_from").val(),
       "pool[field_id]" : $("#carpool_field").val(),
       "pool[leaving_date]" : $("#carpool_date_leaving").val(),
       "pool[returning_date]" : $("#carpool_date_returning").val(),
       "pool[spaces_free]" : $("#carpool_spaces").val(),
       "pool[telephone]" : $("#carpool_telephone").val(),
       "pool[seeking]" : $("#carpool_wanted").prop("checked"),
       "pool[message]" : $("#carpool_message").val(),
       "pool[driven_here_before]" : $("#carpool_driven_before").prop("checked")
      }, 
      success: function(data) {
        alert("Carpool has been created");
        $.mobile.changePage("#country_pool_list");
      },
      error: function(data){
        var pool_errors = $.parseJSON(data.responseText);
        var error_string = ""; 
        $.each(pool_errors.errors, function(i,item){
          error_string += humanize(i) + ": " + item + "\n";
        });
        alert(error_string);
      },
      dataType: "json"
    });
  });
  $(document).on("click", "#sign_in_button", function(){
    $.ajax({
      type: "POST",
      url: 'http://api.snowpool.org/tokens.js',
      data: {
       "email" : $("#sign_in_email").val(),
       "password" : $("#sign_in_password").val()
      }, 
      success: function(data) {
        $(".login_button").hide();
        $(".add_carpool_button").show();
        alert("You are logged in");
        window.localStorage.setItem("token" ,data.token);
        window.localStorage.setItem("telephone" ,data.telephone);
        window.localStorage.setItem("city" ,data.city);
        window.localStorage.setItem("user_id" ,data.user_id);
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
  $(document).on("click", "a.pool_link", function(e){
    $("#pool_details").empty();
    $.getJSON("http://api.snowpool.org/pools/"+$(this).data('identity')+".js?callback=?", function(data) {
      if (data.seeking === true){
        $("#pool_details").append("<h2>Carpool wanted to "+data.field+"</h2>");
      }else{
        $("#pool_details").append("<h2>Carpool to "+data.field+"</h2>");
      }
      $("#pool_details").append("<strong>Date Leaving</strong><br/>"+data.start+"<br/>");
      $("#pool_details").append("<strong>Date Returning</strong><br/>"+data.endDisp+"<br/>");
      $("#pool_details").append("<strong>Name</strong><br/>"+data.name+"<br/>");
      if (data.seeking === true){
        $("#pool_details").append("<strong>Spaces needed</strong><br/>"+data.spaces_free+"<br/>");
      }else{
        $("#pool_details").append("<strong>Spaces</strong><br/>"+data.spaces_free+"<br/>");
      }
      if (data.telephone !== ""){
        $("#pool_details").append("<strong>Telephone</strong><br/>"+data.telephone+"<br/>");
      }
      if (data.drivenBefore !== ""){
        $("#pool_details").append("<strong>Driven here before</strong><br/>"+data.drivenBefore+"<br/>");
      }
      if (data.returning !== ""){
        $("#pool_details").append("<strong>Leaving from</strong><br/>"+data.returning+"<br/>");
      }
      if (data.message !== ""){
        $("#pool_details").append("<strong>Message</strong><br/>"+data.message+"<br/>");
      }
      if (user_is_valid()){
        $("#pool_details").append("<input type=\"hidden\" id=\"pool_id\" value=\""+data.id+"\"></textarea>");
        if (is_own_carpool(data.user_id)){
          $("#pool_details").append('<button type="submit" data-theme="a" id="delete_carpool_button">Delete Your Carpool</button>');
        }else{
          $("#pool_details").append("<br/><br/><strong>Send "+data.name+" a message</strong><br/>");
          $("#pool_details").append("<textarea name=\"messageText\" id=\"pool_message\"></textarea>");
          $("#pool_details").append('<button type="submit" data-theme="a" id="send_message_button">Send Message</button>');
        }
      }else{
        $("#pool_details").append("<h4>If you <a href=\"#sign_in\">sign in</a>, then you can send the user a message.</h4>");
      }
      $("#pool_details").trigger('create');
    });
  });

  $(document).on("click", "a.country_click", function(e){
    window.localStorage.setItem("chosenCountry" ,$(this).attr('id'));
    //get the fields for this country
    $.getJSON("http://api.snowpool.org/countries/"+window.localStorage.getItem("chosenCountry")+"/fields.js", function(data) {
      window.localStorage.setItem("country_fields" ,JSON.stringify(data));
      window.localStorage.setItem("has_country_fields" ,"true");
    });
  });
});

function setFilterTheme(idToSet){
  $(".filterbutton").buttonMarkup({ theme: "c" });
  $('#'+idToSet).buttonMarkup({ theme: "e" });
}
function offeredFilter(){
  $(".ui-input-search > input").val("offered").keyup();
}

function allFilter(){
  $(".ui-input-search > input").val("").keyup();
}

function wantedFilter(){
  $(".ui-input-search > input").val("wanted").keyup();
}

function setFilterToShow(){
  var currentFilter = window.localStorage.getItem("currentFilter");
  if (currentFilter === null){
    //then it has never been set, set to all
    window.localStorage.setItem("currentFilter" ,"allFilter");
    currentFilter = "allFilter";
    setFilterTheme("allFilter");
  }else{
    setFilterTheme(currentFilter);
  }
  //hack - clear the input first
  $(".ui-input-search > input").val("clear").keyup();
  window[currentFilter]();
}

function empty_and_refresh_carpools(){
  $("#append-pools").empty();
  $.getJSON("http://api.snowpool.org/countries/"+window.localStorage.getItem("chosenCountry")+".js?callback=?", function(data) {
    if(data.length === 0){
      $('<li data-role="list-divider">No current carpools</li>').appendTo("#append-pools");
      $("#append-pools").listview('refresh');
      return;
    }
    var initDate = data[0].start;
    $('<li data-role="list-divider">'+initDate+'</li>').appendTo("#append-pools");
    $.each(data, function(i,item){
      if (initDate != item.start){
        initDate = item.start;
        $('<li data-role="list-divider">'+initDate+'</li>').appendTo("#append-pools");
      }
      var theme = "c";
      var filter_text = "offered";
      if (item.seeking === true){
        theme = "e";
        filter_text = "wanted";
      }
      $('<li data-filtertext="'+ filter_text +'" data-theme="'+theme+'"><a class="pool_link" data-identity="'+item.id+'" href="#pool_view">'+item.title+'</li>').appendTo("#append-pools");
    });
    $("#append-pools").listview('refresh');
    setFilterToShow();
    return false;
  });
 }

 //setup all the local variables etc
 function setup(){
  if (user_is_valid()){
    if (user_id_unset()){
      window.localStorage.setItem("valid_login" ,"false");
      $(".add_carpool_button").hide();
    }else{
      $(".login_button").hide();
    }
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
  function user_id_unset(){
    return window.localStorage.getItem("user_id") === null;
  }
  function users_token(){
    return window.localStorage.getItem("token");
  }
  function users_telephone(){
    return window.localStorage.getItem("telephone");
  }
  function users_city(){
    return window.localStorage.getItem("city");
  }
  function is_own_carpool(user_id){
    return parseInt(window.localStorage.getItem("user_id"), 10) === user_id;
  }
  function users_fields(){
    if ( window.localStorage.getItem("has_country_fields") == "true" ){
      return JSON.parse(window.localStorage.getItem("country_fields"));
    }else{
      return false;
    }
  }
  function users_country(){
    return humanize(window.localStorage.getItem("chosenCountry"));
  }
  function clear_data(){
    window.localStorage.removeItem("has_country_fields");
    window.localStorage.removeItem("chosenCountry");
    window.localStorage.removeItem("country_fields");
  }
  var m_names = new Array("January", "February", "March",
  "April", "May", "June", "July", "August", "September",
  "October", "November", "December");

  function print_date(d){
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();
    var to_return = curr_date + "-" + m_names[curr_month] + "-" + curr_year;
    return to_return;
  }

function humanize(property){
  return property.replace(/_/g, ' ')
    .replace(/(\w+)/g, function(match) {
    return match.charAt(0).toUpperCase() + match.slice(1);
  });
}
