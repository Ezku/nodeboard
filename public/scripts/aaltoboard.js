$(document).ready(function(){
  
  // New thread -form toggle
  
  $("#newThread").hide();
  
  function updateBoardThreadsHeight(){
    $("#threads").css("top",$("#boardHeader").outerHeight());
  }
  updateBoardThreadsHeight();
  
  $("#newThreadButton").click(function(){
    $("#newThread").slideToggle(updateBoardThreadsHeight);
    return false;
  });
  
  // Reply to thread -form toggle
  
  function hideReplyForm(){
    $("#reply form").hide();
    updateThreadHeight();
  }
  hideReplyForm();
  
  function updateThreadHeight(){
    $("#detail-level .thread").css("bottom",$("#reply").outerHeight());
  }
  
  $("#reply h4").live("click",function(){
    $("#reply form").slideToggle(updateThreadHeight);
    return false;
  });
  
  // Board Load more threads
  
  $("#loadMore").click(function(){
    //$.ajax()
  });
  
  // Thread selector
  $("a.threadLink").click(function(e){
    e.preventDefault();
    loadThread($(this).attr("href"));
  });
  
  function loadThread(path){
    console.log("loadThread",path);
    $.getJSON('/api'+path, function(data) {
          
      if(!data.thread || !data.thread.posts){
        console.log("No posts found!");
        return;
      }
      
      $('#detail-level').html($('#threadTemplate').tmpl(data.thread));
      $('#detail-level .thread').append($('#postTemplate').tmpl(data.thread.posts));
      
      // Update timeago plugin
      $("#detail-level time").timeago();
      
      // Update url with HTML5 History API 
      // http://www.whatwg.org/specs/web-apps/current-work/multipage/history.html
      if(window.location.pathname !== path){
        history.pushState(null, null, path);
      }
      
      hideReplyForm();
    });
  }
  
  // Load previous thread on back button click
  $(window).bind("popstate", function(e) {
    var path = window.location.pathname;
    console.log("popstate",path);
    
    if (path.split("/").length > 3){
      loadThread(path);
    }
  });
  
  // TODO: Submit thread reply with Ajax
  /*
  $("#replyForm").live("submit",function(event) {
    event.preventDefault(); 
    var url = "/api"+$(this).attr('action');
    var data = { 
        content: "Hello World" //$(this).find("textarea").text()
      }
    console.log("Submit reply form",url,data);

    $.post(url,data)
      .success(function(res) {
        console.log("Post success",res);
      })
      .error(function(res) {
        console.log("Post error",res);
      });
  });
  */
 
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
            window.location.reload();
            return false;
          });
      }
    });
    
    channel.on('reply', function(obj){      
      var threadId = obj.thread;
      console.log("New reply to thread "+threadId);
      var $thread = $("#thread-preview-"+threadId);
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
  
  // Timeago plugin
  $("time").timeago();  
});