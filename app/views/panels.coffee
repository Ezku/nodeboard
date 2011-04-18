div id: "high-level", ->
  if @overview.view
    h1 @overview.title if @overview.title
    div ->
      text @partial @overview.view, @overview

div id: "detail", ->
  if @detail.view
    h1 @detail.title if @detail.title
    div ->
      text @partial @detail.view, @detail
