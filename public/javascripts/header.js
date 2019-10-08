$(document).ready(function(){
    $("a.nav-link").click(function(){
        $(this).addClass('active')
        })
    var path = window.location.pathname;
    var target = $("a.nav-link[href$='" + path + "']")
    target.parent().addClass('active')
});
   