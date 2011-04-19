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
  
    replyCount = thread.posts.length-1
  
    if replyCount > 1
      p class: "omitted", -> replyCount-1 + " messages omitted."

    if replyCount > 0
      text @partial "partials/post", object: thread.lastPost
