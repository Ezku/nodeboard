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
    
    text @partial "partials/post", object: thread.posts[0]
    
    replyCount = thread.posts.length-1
    
    if replyCount > 1
      p replyCount-1 + " messages omitted."

    if replyCount > 0
      text @partial "partials/post", object: thread.posts[replyCount]