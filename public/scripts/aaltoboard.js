$(document).ready(function(){
  
  // Timeago plugin
  $("time").timeago();
  
  // New thread -button logic
  $("#newThread").hide();
  $("#newThreadButton").click(function(){
    $("#newThread").slideDown("slow");
    return false;
  });
  
  // Thread selector
  $("#high-level section.thread").click(function(){
    var link = $(this).children("a.threadLink").attr("href");
    //window.location.href = link;
    loadThread(link);
  })
  
  function loadThread(path){
    $.getJSON('/api'+path, function(data) {
      
      console.log('jsonData',data);
      
      if(!data.thread || !data.thread.posts){
        console.log("No posts found!");
        return;
      }
      
      var posts = data.thread.posts;
      console.log('posts',posts)
      /*
      $.each(data.thread.posts, function(i, post) {
        console.log('post',post);
        renderPost(post);
      });
      */
      for(var i=0;i<posts.length;i++){
        console.log('post',posts[i]);
        renderPost(posts[i]);
      }
    });
    
  }
  
  var coffeekup = require('coffeekup');
  var postTemplate = require('./post');
  
  console.log('coffeekup',coffeekup);
  
  function renderPost(post){
    console.log('renderPost',post);
    html = coffeekup.render(postTemplate, {context: {post: post}});
    console.log('renderedPost',html)
    $('#detail-level').append(html);
  }
 
  /*
   * Socket.io channels
   */
  
  // Check if we are on board page
  var path = window.location.pathname;
  if (path.length > 1){
    var board = path.split("/")[1];

    console.log("Connecting to board: " + board);

    var channel = new SocketIOChannel({
      host: document.domain,
      channelId: board
      //reconnectOnDisconnect: true,
      //reconnectRetryInterval: 1000 * 10 // try to reconnect every 30 seconds
    });
    
    channel.on('newthread', function(obj){  
      console.log("New thread: "+obj.thread);
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
    });
    
    channel.on('reply', function(obj){      
      var threadId = obj.thread;
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
    });

    channel.on('connect', function(obj){
      console.log('Connected socket');
    });

    channel.on('disconnect', function(obj){
      console.log('Disconnect socket');
    })

    channel.on('connectionRetry', function(obj){
      console.log('Socket connectionRetry');
    })
  }     
});