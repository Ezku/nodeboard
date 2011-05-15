module.exports = (dependencies) ->
  {config} = dependencies
  
  # Checks for existence of board by its short name
  exists = (board) ->
    for group, boards of config.boards
      return true if boards[board]?
    return false
  
  # Get board name from configuration by its short name
  getName = (board) ->
    for group, boards of config.boards
      return boards[board].name if boards[board]?
    return false
  
  { exists, getName }