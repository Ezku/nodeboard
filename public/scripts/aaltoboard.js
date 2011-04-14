$(document).ready(function(){
  
  // New thread -button logic
  $("#newThread").hide();
  $("#newThreadButton").click(function(){
    $("#newThread").show("slow");
    return false;
  })
  
  // Thread selector
  $("#high-level section.thread").click(function(){
    var link = $(this).children("a.threadLink").attr("href");
    window.location.href = link;
  })
  
  // Timeago plugin
  $("time").timeago();
  
});