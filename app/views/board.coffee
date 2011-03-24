h1 -> "Count: #{@counter}"

form method: 'post', action: "/#{@board}/", ->
  dl ->
    dt -> "Topic"
    dd -> input name: 'topic', type: 'text'
    
    dt -> "Content"
    dd -> textarea name: 'content'
    
    dt -> "Password"
    dd -> input name: 'password', type: 'password'
    
    dt ->
    dd -> input name: 'submit', type: 'submit', value: 'Submit'