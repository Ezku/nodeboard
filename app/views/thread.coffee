div class: 'columnHeader', ->
  h1 @title

div class: 'columnContent', ->
  section class: 'thread', id: 'thread-' + @thread.id, ->
    if @thread.posts?.length
      for post in @thread.posts
        post.board = @thread.board
        post.thread = @thread.id
        text @partial "partials/post", object: post

div class: 'columnFooter', ->
  if @thread.posts?.length || @jQtemplate
    text @partial "partials/post-form", as: 'form', object:
      action: "/#{@board}/#{@thread.id}/"
      submit: 'Reply to thread'
      id: "reply"
      title: "Reply to thread"
