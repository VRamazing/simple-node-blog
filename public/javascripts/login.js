$(".passwd-eye" ).click(function() {
    $(".passwd-eye").css("display", "block");
    $(this).css("display", "none");
    
    var selector = $($(this).attr("toggle"))
    var currentType = selector.attr('type');
    if(currentType==="password"){
       $(selector).attr("type", "text");
    } else {
       $(selector).attr("type", "password");
    }
  });
  