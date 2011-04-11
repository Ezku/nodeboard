section class: 'form', ->
  form method: 'post', action: "/#{@board}/", ->
    dl ->
      dt -> label for: "content", -> "Content"
      dd -> textarea name: 'content', id: 'content'
    
      dt -> label for: "password", -> "Password"
      dd -> input name: 'password', id: 'password', type: 'password'
    
      dt ->
      dd -> input name: 'submit', type: 'submit', value: 'Submit'

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