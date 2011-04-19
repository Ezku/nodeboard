$(document).ready(function(){
  
  // New thread -button logic
  $("#newThread").hide();
  $("#newThreadButton").click(function(){
    $("#newThread").slideDown("slow");
    return false;
  });
  
  // Thread selector
  $("section.thread").click(function(){
    console.log("click")
    var link = $(this).children("a.threadLink").attr("href");
    window.location.href = link;
  })
  
  // Timeago plugin
  $("time").timeago();
  
  // Socket io
  var socket = new io.Socket(document.domain); 
  socket.connect();
  socket.on('connect', function(){
    console.log('connect');
  });
  socket.on('message', function(message){
    console.log('message:', message);
      
    // Replying to a thread
    if (message.reply){
      var threadId = message.reply.thread;
      console.log("New reply to thread "+threadId);
      var $thread = $("#thread-"+threadId);
      if ($thread.length > 0){
        // Show notification button
        var $notification = $thread.children(".newReplyNotification");
        if ($notification.length > 0){
          console.log("Updating notification element");
          var amount = parseInt($notification.html());
          $notification.html(amount+1);
        } else {
          console.log("Creating notification element");
          $('<span class="newReplyNotification">1</span>')
            .hide()
            .prependTo($thread)
            .fadeIn();
        }
        // Blink the thread element
        $thread.toggleClass('hilight');
        setTimeout(function(){
          $thread.toggleClass('hilight');
        },1000);
      } else {
        console.log("Thread element not found: " + threadId);
      }
    }
    // Creating new thread
    else if (message.thread){
      console.log("New thread: "+message.thread.id);
      var $notification = $("#newThreadsNumber");
      if ($notification.length > 0){
        console.log("Updating notification element");
        var amount = parseInt($notification.html());
        $notification.html(amount+1);
      } else {
        console.log("Creating notification element");
        $('<a id="newThreadsNotification" href="#"><span id="newThreadsNumber">1</span> new threads. Click to refresh.</a>')
          .hide()
          .insertAfter("#newThread")
          .slideDown('slow')
          .click(function(){
            window.location.href=window.location.href
            return false;
          });
      }
    }
  });
  socket.on('disconnect', function(){
    console.log('disconnect');
  });
});