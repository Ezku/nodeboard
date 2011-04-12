$(document).ready(function(){
  $("#newThread").hide();
  $("#newThreadButton").click(function(){
    $("#newThread").show("slow");
    return false;
  })
  
  $("#high-level section.thread").click(function(){
    console.log("click");
    var link = $(this).children("a.threadLink").attr("href");
    window.location.href = link;
  })
});