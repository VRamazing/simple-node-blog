$(document).ready(function(){
    var path = window.location.pathname;
    var target = $("a.nav-item[href='" + path + "']")
    console.log(target)
    target.addClass('active')
})