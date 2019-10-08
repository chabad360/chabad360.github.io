---
author: "Mendel Greenberg"
date: "2019-10-02T1:14:27"
draft: true
summary: "Yes, you read correctly! But it takes some effort..."
tags: ["Setup", "Blog"]
title: "Running a blog for free!"

---

### Free!?

Um, yes, to "Run" it.

#### To "Run" it?

Well, the only thing you actually pay for is the domain name, and thats only a (usually) small and yearly fee.

But now that I've got your attention, let's get on with the process.

### Setup

#### 1. The Hardware

The first thing you'll need is a computer (ok, you _can_ use a phone, but it's a pain to work with).

#### 2. GitHub

Next you'll need an account with [GitHub](https://github.com) and you'll want to sign up for the [GitHub Actions Beta](https://github.com/features/actions).

#### 3. Get a Domain

You'll need to have a domain, you can get one at a great price from [Namecheap](https://namecheap.com). Finally, you'll also want an account with [Cloudflare](https://cloudflare.com), now would be a good time to setup your site with cloudflare (hopfully the process is pretty self-explanatory) too.

### Let's setup our site!

The first thing you'll want to do is create a [new repository](https://github.com/new) on github with the name `<your username here>.github.io`.
Once your done with that, you'll need to clone that repository. To do that we are going to use [GitPod](gitpod.io), an free* online code editor with a user interface very similar to Visual Studio Code
(Note for developers: The reason why I'm doing this way, is becuase it's simply eaiser to setup (for most people), and you'll have less tools to install (again, for most people).).

To use GitPod, make sure the you have the repository open in your browser and change the URL from

```text
https://github.com/username/username.github.io
```

to

```text
gitpod.io/#https://github.com/username/username.github.io
```

adding `gitpod.io/#` to the begining of the URL, and hit <kbd>Enter</kbd>. You'll be asked to sign in with GitHub, go ahead and do that. Now you'll just have to wait a min for Gitpod to startup and then you'll be greeted by a nice code editor!

<img src="/uploads/terminal.png" width="100%"></img>

Now you'll want to click your mouse on big box on the bottom, thats a terminal!
In this terminal, copy and paste the following, then hit <kbd>Enter</kbd>:

```bash
git branch site && git checkout site \
  && cd .. && wget "https://github.com/gohugoio/hugo/releases/download/v0.58.3/hugo_extended_0.58.3_Linux-64bit.tar.gz" \
  && tar zxf hugo*
```

Great! Now you've installed Installed hugo!

The next thing to do, is run `hugo new site <your username here>.github.io` (remember, always hit <kbd>Enter</kbd>).
The next step is to run `cd <your username here>.github.io`.

Perfect! Your site is now done!
.
.
.
.

#### Not Really...

Now you've got to add a theme!

First, start of by picking one of the many [Hugo Themes Available](https://themes.gohugo.io/) (and while your at it I would suggest looking for one that has a `Resposive` tag, they will load fast and look great on mobile). Once you've setteled on the on you like, click on the download button, it will take you to the github page for that theme. For this example, I'm gonna be using the [Raphael Riegger's Minimalistic Ghost theme](https://github.com/digitalcraftsman/hugo-minimalist-theme) which was ported to Hugo.

Now you need to install your theme, to do that run:

```bash
git submodule add "<the URL for your theme>" themes/<theme-name>
```

In my case that would surmount to:

```bash
git submodule add "https://github.com/digitalcraftsman/hugo-minimalist-theme" themes/minimalist
```

Now we need to configure our site, so right click on the File Explorer bar on the left of your screen, and click New File in the menu that comes up, and when prompted name the file `config.toml`.
In the center of your screen, where the editor window just opened paste the following:

```toml
title = "<Your Name, or some other title for your site>"
DefaultContentLanguage = "en"
baseURL = "<The full URL your site will be reachable at>"
theme = "<The theme name>"
```

For me, that would look like:

```toml
title = "Mendel Greenberg"
DefaultContentLanguage = "en"
baseURL = "https://chabad360.me/"
theme = "minimalist"
```

Now you'll want to commit that. So click on this Icon:      ![](/uploads/vcs.png)

And where it says message, type `First commit`. Mouse-over the the word `Changes` and click on the plus icon when it shows up.
Next, press the check button to commit. But you still need to push your changes. So click on the blue footer bar where you see a little _"Upload to the cloud"_ icon. You'll now be prompted about publishing your changes, click ok.

Your site is almost live!

### Publishing

Now you need to navigate your repositories homepage on github (i.e. `https://github.com/username/username.github.io`) and click on where it says "Actions":

![](/uploads/actions.png)

Then press <kbd>Set up a workflow yourself</kbd>.

Replace all the text in the text editor with this:

```yaml
name: Hugo Build

on:
  push:
    branches:
    - build

jobs:
  build-deploy:
    runs-on: ubuntu-18.04

    steps:
    - name: Checkout Repo
      uses: actions/checkout@master
      with:
        submodules: true

    - name: Publish Site
      uses: chabad360/hugo-gh-pages@master
      with:
        args: --gc --minify --cleanDestinationDir
      env:
        BRANCH: master
        CNAME: "<Your site name>"
        GITHUB_TOKEN: ${{ secrets.PERSONAL_TOKEN }}

    - name: Purge Cloudflare Cache
      uses: jakejarvis/cloudflare-purge-action@master
      env:
        CLOUDFLARE_ZONE: ${{ secrets.CLOUDFLARE_ZONE }}
        CLOUDFLARE_EMAIL: ${{ secrets.CLOUDFLARE_EMAIL }}
        CLOUDFLARE_KEY: ${{ secrets.CLOUDFLARE_KEY }}
```

Make sure to set the value of `CNAME` to that of your website (i.e. just `chabad360.me`, no `https://` or that stuff).

#### Secrets
