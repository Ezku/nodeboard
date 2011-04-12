section class: 'thread', id: 'thread-' + @thread.id, ->    
    for post in @thread.posts
      text @partial "partials/post", object: post

h3 "Reply to thread"

text @partial "partials/post-form", as: 'form', object:
  action: "/#{@board}/#{@thread.id}/"
  submit: 'Reply to thread'
