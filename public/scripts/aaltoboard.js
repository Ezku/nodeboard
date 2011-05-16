$(document).ready(function(){
  
  // New thread -form toggle
  
  $("#newThread").hide();
  
  function updateBoardContentHeight(){
    $(".boardContent").css("top",$(".boardHeader").outerHeight());
  }
  updateBoardContentHeight();
  
  $("#newThreadButton").click(function(){
    $("#newThread").slideToggle(updateBoardContentHeight);
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
  $("#loadMore").click(function(e){
    e.preventDefault();
    loadBoardThreads($(this).attr("href"));
  });
  
  function loadBoardThreads(path){
    console.log("loadBoardThreads",path);
    $.getJSON('/api'+path, function(data) {
      
      console.log("loadBoardThreads data:",data)
      if(!data.threads){
        console.log("No threads found!");
        return;
      }
      
      // Add board name to threads objects
      $(data.threads).each(function(){
        this.board = data.board;
        this.firstPost.board = data.board;
        if (this.lastPost) {
          this.lastPost.board = data.board;
        }
      });
      
      $('.threads').html($('#boardThreadTemplate').tmpl(data.threads));
      
      // Hide thread links
      $("a.threadLink").hide();
      
      // Update timeago plugin and lightbox
      $(".threads time").timeago();
      setFancybox();
      
      // Update selected thread
      if($("#detail-level .thread")){
        var id=$("#detail-level .thread").attr("id").split("-")[1];
        $("#thread-preview-"+id).addClass("selected");
      }
      
      // Update Load more -button
      if(data.total > data.threads.length){
        var pos = path.search("pages=")+6;
        var pages = parseInt(path.substr(pos));
        var newPath = path.substr(0,pos) + (pages+1);
        $("#loadMore").attr("href",newPath)
      } else {
        $("#loadMore").hide();
      }
    });
  }
  
  // Thread selector
  $("section.thread-preview").live("click",function(){
    var link = $(this).children("a.threadLink").attr("href");
    loadThread(link);
  });
  $("a.threadLink").hide();
  
  function loadThread(path){
    console.log("loadThread",path);
    $.getJSON('/api'+path, function(data) {
          
      if(!data.thread || !data.thread.posts){
        console.log("No posts found!");
        return;
      }
      
      // Update selected thread overview
      $(".thread-preview").removeClass("selected");
      $("#thread-preview-"+data.id).addClass("selected");
      
      // Add board name to posts
      $(data.thread.posts).each(function(){
        this.board = data.board;
      });
      
      $('#detail-level').html($('#threadTemplate').tmpl(data.thread));
      $('#detail-level .thread').append($('#postTemplate').tmpl(data.thread.posts));
      
      // Update url with HTML5 History API 
      // http://www.whatwg.org/specs/web-apps/current-work/multipage/history.html
      if(window.location.pathname !== path){
        history.pushState(null, null, path);
      }
      
      // Update UI stuff
      $("#detail-level time").timeago();
      hideReplyForm();
      setFancybox();
      
      // Show controls
      $("section.thread article.post").hover(function() {
          $(this).find(".controls").toggle();
      });
    });
  }
  
  $(".controls .reply").live("click",function() {
    alert("Reply not implemented yet");
  });
  $(".controls .delete").live("click",function() {
    var pw = prompt("Enter password to delete","");
    if(pw){
      alert("Sorry, delete is not implemented yet");
    }
  });
  
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
  
  // Fancybox
  function setFancybox(){
    $(".post-image a").fancybox({
      'overlayColor'		: '#000',
      'overlayOpacity'	: 0.8
    });
  }
  setFancybox();
  
});