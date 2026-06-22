# Git Cheat Sheet

## Saving Your Work
| Command | What it does |
|---|---|
| `git add .` | Stage all changed files |
| `git commit -m "description"` | Permanently save staged files |
| `git add . && git commit -m "description"` | Do both at once (most common) |

## Checking What's Going On
| Command | What it does |
|---|---|
| `git status` | See what files have changed |
| `git log --oneline` | See all your saved commits |
| `git tag` | See all your named versions |

## Versions & Tags
| Command | What it does |
|---|---|
| `git tag demo-v1` | Save current commit as a named version |
| `git checkout demo-v1` | Go back to that version |
| `git checkout master` | Return to your latest work |

## Stash (Temporary Holding Area)
| Command | What it does |
|---|---|
| `git stash` | Temporarily hide unsaved changes |
| `git stash pop` | Bring hidden changes back |

## Looking at Old Versions
| Command | What it does |
|---|---|
| `git show d5634e4:src/app/(teacher)/teacher/dashboard/page.tsx` | View a file as it was at a specific commit |

## Pushing to GitHub
| Command | What it does |
|---|---|
| `git push` | Upload your commits to GitHub |

---
**Golden rule:** Edit files → `git add .` → `git commit -m "..."` → done.
