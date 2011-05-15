div id: 'boardHeader', ->
  h1 @title
  a id: "newThreadButton", href: "#newThread", -> "New Thread"

  text @partial "partials/post-form", as: 'form', object:
    action: "/#{@board}/"
    submit: 'Create thread'
    id: 'newThread'
  
div id: 'threads', ->
  for thread in @threads
    text @partial "partials/thread", object: thread
  
div id: 'footer', ->
  a id: "show-more", -> "Show more"