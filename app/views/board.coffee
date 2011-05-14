h1 @title
a id: "newThreadButton", href: "#newThread", -> "New Thread"

text @partial "partials/post-form", as: 'form', object:
  action: "/#{@board}/"
  submit: 'Create thread'
  id: 'newThread'

for thread in @threads
  section class: 'thread', id: 'thread-' + thread.id, ->
    
    a href: "/#{@board}/#{thread.id}/", class: "threadLink"

    text @partial "partials/post", object: thread.firstPost
  
    if thread.replyCount > 1
      p class: "omitted", -> thread.replyCount-1 + " messages omitted."

    if thread.lastPost
      text @partial "partials/post", object: thread.lastPost