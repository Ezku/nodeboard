form method: 'post', action: "/#{@board}/", ->
  dl ->
    dt -> label for: "content", -> "Content"
    dd -> textarea name: 'content', id: 'content'
    
    dt -> label for: "password", -> "Password"
    dd -> input name: 'password', id: 'password', type: 'password'
    
    dt ->
    dd -> input name: 'submit', type: 'submit', value: 'Submit'
    
section class: 'thread', id: 'thread-123123', ->
  article class: 'post', id: 'post-1231123', ->
    div class: 'meta', ->
      span class: 'post-id', -> '123123'
      span class: 'author', -> 'Anonymous'
      time datetime: '2011-11-11 0:00:00+00:00', -> '13 minutes ago'
    div class: 'post-image', ->
      img src: '', alt: ''
    div class: 'post-content', ->
      p ->
        'text'
  article class: 'post', id: 'post-1231123', ->
    div class: 'meta', ->
      span class: 'post-id', -> '123123'
      span class: 'author', -> 'Anonymous'
      time datetime: '2011-11-11 0:00:00+00:00', -> '13 minutes ago'
    div class: 'post-image', ->
      img src: '', alt: ''
    div class: 'post-content', ->
      p ->
        'text'
