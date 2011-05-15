# Partial: One thread in board view

section class: 'thread', id: 'thread-' + @thread.id, ->

  if @thread.firstPost
    text @partial "partials/post", object: @thread.firstPost
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
    text @partial "partials/post", object: @thread.lastPost
  if @jQtemplate
    text '{{if lastPost }}{{tmpl(lastPost) "#postTemplate"}}{{/if}}'
    
  a href: "/#{@board}/#{@thread.id}/", class: "threadLink", -> "Open thread"