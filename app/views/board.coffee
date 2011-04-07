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
    for post in thread.posts
      console.log post
      article class: 'post', id: 'post-' + post.id, ->
        div class: 'meta', ->
          span post.id, class: 'post-id'
          span post.author, class: 'author'
          time post.time, datetime: post.time
        if post.image
          div class: 'post-image', ->
            img src: '', alt: ''
        div class: 'post-content', ->
          p post.content