h1 @error?.message ? "Looks like we messed up"

section class: "error", -> h2 @error?.description ? "Sorry about that. It's probably nothing fatal. If you were doing something, please try again."