section class: 'thread', id: 'thread-' + @thread.id, ->
    h4 'Thread ' + @thread.id
    
    for post in @thread.posts
      text @partial "partials/post", object: post

text @partial "partials/post-form", as: 'form', object:
  action: "/#{@board}/#{@thread.id}/"
  submit: 'Reply to thread'
