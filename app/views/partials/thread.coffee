# Partial: One thread in board view

section class: 'thread-preview', id: "thread-preview-#{@thread.id}", ->

  if @thread.firstPost
    @thread.firstPost.board = @thread.board
    @thread.firstPost.thread = @thread.id;
    text @partial "partials/post", object: @thread.firstPost, preview: true
  if @jQtemplate
    text '{{tmpl(firstPost) "#postTemplate"}}'

  if @thread.replyCount > 1 || @jQtemplate
    if @jQtemplate
      text '{{if replyCount > 1 }}'
    p class: "omitted", -> 
      if @jQtemplate
        text @thread.replyCount
      else
        text @thread.replyCount-1
      text " messages omitted."
    if @jQtemplate
      text '{{/if}}'

  if @thread.lastPost
    @thread.lastPost.board = @thread.board
    @thread.lastPost.thread = @thread.id
    text @partial "partials/post", object: @thread.lastPost, preview: true
  if @jQtemplate
    text '{{if lastPost }}{{tmpl(lastPost) "#postTemplate"}}{{/if}}'
    
  a href: "/#{@thread.board}/#{@thread.id}/", class: "threadLink", -> "Open thread"
