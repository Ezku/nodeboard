# Partial: One thread in board view

section class: 'thread thread-#{@thread.id}', ->

  a href: "/#{@board}/#{@thread.id}/", class: "threadLink", ->

    text @partial "partials/post", object: @thread.firstPost

    if @thread.replyCount > 1
      p class: "omitted", -> @thread.replyCount-1 + " messages omitted."

    if @thread.lastPost
      text @partial "partials/post", object: @thread.lastPost
