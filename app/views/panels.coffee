
div id: "high-level", class: "column", ->
  if @overview?.view
    div ->
      text @partial @overview.view, @overview

div id: "detail-level", class: "column",->
  if @detail?.view
    div ->
      text @partial @detail.view, @detail
