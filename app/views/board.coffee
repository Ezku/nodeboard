
text @partial "partials/post-form", as: 'form', object:
  action: "/#{@board}/"
  submit: 'Create thread'


for thread in @threads
  section class: 'thread', id: 'thread-' + thread.id, ->
    h4 ->
      a href: "/#{@board}/#{thread.id}/", ->
        "Thread #{thread.id}"
    
    text @partial "partials/post", object: thread.firstPost
    
    if thread.replyCount > 1
      p (thread.replyCount - 1) + " messages omitted."

    if thread.lastPost
      text @partial "partials/post", object: thread.lastPost