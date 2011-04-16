h1 @title

for label, properties of @config.boards.guilds

  article class: "board", ->
    a href: "/#{label}/", title: properties.name, -> 
      h2 label.toUpperCase() 
      p properties.name
