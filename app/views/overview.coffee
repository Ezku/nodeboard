div class: 'columnHeader', ->
  h1 "What's new in all boards"

div class: 'columnContent', ->
  div class: 'threads', id: 'overview', ->
    if @threads.length
      for thread in @threads
        text @partial "partials/thread", overview: true, object: thread
    else
      h2 "Wow! There's absolutely nothing to see here!"
