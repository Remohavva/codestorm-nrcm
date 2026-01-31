# Git – Step-by-step instructions to push

Follow these steps to commit your project and push to GitHub (or another Git host).

---

## Step 1: Open terminal in project folder

- In VS Code / Cursor: **Terminal → New Terminal** (or `` Ctrl+` `` / `` Cmd+` ``).
- Or open Terminal / Command Prompt and run:
  ```bash
  cd /Users/logan69/12344
  ```

---

## Step 2: Check if Git is installed

```bash
git --version
```

If you see a version number (e.g. `git version 2.x.x`), Git is installed. If not, install from https://git-scm.com/

---

## Step 3: Initialize Git (only if this is not already a repo)

Run this only if you have **not** run `git init` before:

```bash
git init
```

If you see “Reinitialized existing Git repository”, the repo already exists; you can skip to Step 4.

---

## Step 4: Create a repository on GitHub

1. Go to **https://github.com** and sign in.
2. Click the **+** (top right) → **New repository**.
3. **Repository name:** e.g. `campushub` or `12344`.
4. Choose **Public**.
5. Do **not** check “Add a README” (you already have one).
6. Click **Create repository**.

---

## Step 5: Add the remote (first time only)

Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repo name:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

Example:

```bash
git remote add origin https://github.com/golivignesh/campushub.git
```

If you get “remote origin already exists”, either skip this or change the URL:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

---

## Step 6: Stage all files

```bash
git add .
```

To see what will be committed:

```bash
git status
```

---

## Step 7: Commit

```bash
git commit -m "Initial commit: CampusHub - College Event & Club Management Platform"
```

Use any message you like; the one above is an example.

---

## Step 8: Set default branch to main (if needed)

If your branch is still `master` and you want `main`:

```bash
git branch -M main
```

---

## Step 9: Push to GitHub

First time (and you created the repo empty):

```bash
git push -u origin main
```

Later pushes:

```bash
git push
```

If GitHub asks for login, use **Personal Access Token** as password (not your GitHub password). Create one: GitHub → **Settings → Developer settings → Personal access tokens**.

---

## Step 10: Verify

- Open your repo on GitHub in the browser.
- You should see all project files (e.g. `src/`, `package.json`, `README.md`), and **no** `node_modules/` or `dist/` (they are in `.gitignore`).

---

## Quick reference – later workflow

After you change code:

```bash
git add .
git commit -m "Describe your change"
git push
```

---

## Troubleshooting

| Issue | What to do |
|-------|------------|
| `git: command not found` | Install Git from https://git-scm.com/ |
| `Permission denied (publickey)` | Use HTTPS remote (as above) or set up SSH keys. |
| `failed to push` / `rejected` | Run `git pull origin main --rebase` then `git push`. |
| Wrong files committed | Check `.gitignore`; remove from tracking with `git rm -r --cached <file>` then commit again. |
