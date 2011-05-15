
div id: 'boardHeader', ->
  h1 @title
  a id: "newThreadButton", href: "#newThread", -> "New Thread"

  text @partial "partials/post-form", as: 'form', object:
    action: "/#{@board}/"
    submit: 'Create thread'
    id: 'newThread'
  
div id: 'threads', ->
  if @threads.length
    for thread in @threads
      text @partial "partials/thread", object: thread
  else
    h2 "Wow! There's absolutely nothing to see here!"

div id: 'footer', ->
  if @total > @threads.length
    a id:"loadMore", href:"/#{@board}/?pages="+(@pages+1)+"#thread-preview-"+thread?.id, -> "Load more"