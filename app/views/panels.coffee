console.log @overview

div id: "high-level", ->
  
  if @overview
    h1 @overview.title
    div ->
      text @partial @overview.view, object: @overview
###
div id: "detail", ->
  if @detail
    h1 @detail.title if @detail.title
    div ->
      text @partial @detail.view, object: @detail
###