
div id: "high-level", class: "column", ->
  if @overview?.view
      text @partial @overview.view, @overview

div id: "detail-level", class: "column",->
  if @detail?.view
      text @partial @detail.view, @detail
