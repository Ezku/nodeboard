h1 @title

for category, boards of @config.boards
  for label, properties of boards

    article class: "board #{category}", ->
      a href: "/#{label}/", title: properties.name, -> 
        h2 label.toUpperCase() 
        p properties.name
