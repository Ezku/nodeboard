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
    h4 'Thread ' + thread.id
    console.log thread.firstPost
    
    text @partial "partials/post", object: thread.firstPost
    
    p thread.replyCount + " messages omitted."

    text @partial "partials/post", object: thread.lastPost