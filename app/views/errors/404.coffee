h1 @error?.message ? "Looking for something?"

section class: "error", -> h2 @error?.description ? "Well, it's not here."