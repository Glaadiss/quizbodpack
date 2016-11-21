
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

$(document).ready(function(){
    var i = 0;
    var gender='';
    var name ='';
    var age=[];
    var answers = {}
    var link;
    function getLink(data){
      let link;
       data.forEach(function(item){
        if( item.gender == answers[3] && item.age == answers[4] && item.goal == answers[5] && item.money == answers[6]){
          link =  item;
        }
      });
      return link;
    }
    $('#page_'+i+'').fadeIn();

    window.fbAsyncInit = function() {
      FB.init({
        appId      : '1410048089009339',
        xfbml      : true,
        version    : 'v2.7'

      });
      FB.Canvas.setAutoGrow();

      function onLogin(response) {
        if (response.status == 'connected') {
          FB.api('/me?fields=id,name,first_name,birthday,gender,age_range', function(data) {
            console.log(data);
            gender = data.gender;
            age= data.age_range;
            name= data.first_name;
            $('#fb_name').html(''+name+'');
            $('#name_form').attr('value', name);
            $('#gender_form').attr('value', gender);
          });
        }
      }

      FB.getLoginStatus(function(response) {
        // Check login status on load, and if the user is
        // already logged in, go directly to the welcome message.
        if (response.status == 'connected') {
          onLogin(response);
        } else {
          // Otherwise, show Login dialog first.
          FB.login(function(response) {
            onLogin(response);
          }, {scope: 'user_friends, email'});
        }
      });
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));

    function loadNext(){
       $('#page_'+i+'').fadeOut('slow').after(function(){
          i++;
          if(i == 3 && gender.length>0){
            answers[3] = gender;
            i++;
          }
          if(i==7){
            // const links = pack.desc.map( function(g) { return ( g.map(function(o) {  return '<li>' + k + '</li>'  }).split('') ) });
            const href = 'http://www.bodypak.pl/pl/zestawy/';
            const params = '?utm_campaign=fbkreator&utm_source=facebook&utm_medium=SzybkiKreatorSuplementacji';
            const pack = getLink(data);
            link = href + pack.link + params;
            const name = pack.link.split('-').slice(1,-2).map(function(a){ return a.capitalize() }).join(' ');
            $('#zestaw').attr('href', link);
            pack.pictures.split(' ').forEach(function(e, index){
              let links = pack.products.split('&').map(function(e){ return '<li>'  + e + '</li>' }).join(' ');
              let name = '';
              if ( index > 0 )
                if (pack.desc[index -1 ]) { links = pack.desc[index - 1].map(function(k) { return '<li> ' + k + '</li>'  } ).join(' '); name = pack.name[index - 1] };
              $('<div class="item"> <div class="row"> <div class="col-xs-4"> <img class="products" src="' + e + '" alt="bodypak-photo"> <div class="product_name">' + name + '</div></div> <div class="col-xs-8"> <ul class="desc-list">' + links+ '</ul> </div> </div<  </div>').appendTo('.carousel-inner');
              $('<li data-target="#carousel-example-generic" data-slide-to="'+index+'"></li>').appendTo('.carousel-indicators');
            });
            $('.item').first().addClass('active');
            $('.carousel-indicators > li').first().addClass('active');
            setTimeout(function(){
              $('#carousel-example-generic').attr('class', 'carousel');
              $('#carousel-example-generic').attr('data-ride', 'carousel');
              $('#carousel-example-generic').carousel();
            }, 100);
          }
            $('#page_'+i+'').slideDown('slow');
       })
    }
    setInterval(function(){
       if(i == 7 || i == 0){
         i++;
         setTimeout(function(){
           i--;
           loadNext();
         }, 2000)
       }
    }, 100)

    $('.btn').on('click', function(){
      if(i < 8)
        loadNext();
    });

    $('.show-params').hover( function(){
      console.log('something')
      $('.information').fadeIn(500);
    }, function(){
      $('.information').fadeOut(500);
    });

    $('input[type="radio"]').on('click', function(){
      var answ = $(this).val();
      answers[i] = answ
      loadNext();
    })

 })
