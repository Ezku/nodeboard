div id: 'boardHeader', ->
  h1 "Aaltoboard overview"

div id: 'boardContent', ->
  div id: 'threads', ->
    if @threads.length
      for thread in @threads
        text @partial "partials/thread", object: thread
    else
      h2 "Wow! There's absolutely nothing to see here!"
