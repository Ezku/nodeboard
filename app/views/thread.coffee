section class: 'thread', id: 'thread-' + @thread.id, ->
    h4 'Thread ' + @thread.id
    
    for post in @thread.posts
      text @partial "partials/post", object: post

section class: 'form', ->
  form method: 'post', action: "/#{@board}/#{@thread.id}/", ->
    dl ->
      dt -> label for: "content", -> "Content"
      dd -> textarea name: 'content', id: 'content'
    
      dt -> label for: "password", -> "Password"
      dd -> input name: 'password', id: 'password', type: 'password'
    
      dt ->
      dd -> input name: 'submit', type: 'submit', value: 'Submit'