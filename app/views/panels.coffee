div id: "high-level", ->
  if @overview.view
    div ->
      text @partial @overview.view, @overview

div id: "detail-level", ->
  if @detail.view
    div ->
      text @partial @detail.view, @detail
