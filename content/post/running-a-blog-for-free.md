+++
author = "Mendel Greenberg"
cover = ""
date = "2019-10-02T1:14:27"
draft = true
project = ""
summary = "Yes, you read correctly! But it takes some effort..."
tags = ["Setup", "Blog"]
title = "Running a blog for free!"

+++
# Free!?

Um, yes, for the most part...

#### Liar!

Well, the only thing you actually pay for is the domain name (unless you want to use [commento](https://commento.io) instead of [disqus](https://disqus.com), but I'll get to that later).

Now that I've got your attention, let's get on with the process.

### Setup

#### 1. The Hardware

The first thing you'll need is a computer (ok, you _can_ use a phone, but it's a pain to work with).

#### 2. GitHub

Next you'll need an account with [GitHub](https://github.com) and you'll want to sign up for the [GitHub Actions Beta](https://github.com/features/actions).

#### 3. Get a Domain

You'll need to have a domain, you can get one at a great price from [Namecheap](https://namecheap.com). Finally, you'll also want an account with [Cloudflare](https://cloudflare.com), now would be a good time to setup your site with cloudflare too.

### Let's setup our site!

The first thing you'll want to do is create a [new repository](https://github.com/new) on github with the name `<your username here>.github.io`.
Once your done with that, you'll need to clone that repository. To do that we are going to use [GitPod](gitpod.io), an free* online code editor with a user interface very similar to Visual Studio Code
(Note for developers: The reason why I'm doing this way, is becuase it's simply eaiser to setup (for most people), and you'll have less tools to install (again, for most people).).

To use GitPod, make sure the you have the repository open in your browser and change the URL from

    https://github.com/username/username.github.io

to

    gitpod.io/#https://github.com/username/username.github.io

adding `gitpod.io/#` to the begining of the URL, and hit <kbd>Enter</kbd>. You'll be asked to sign in with GitHub, go ahead and do that. Now you'll just have to wait a min for Gitpod to startup and then you'll be greeted by a nice code editor!

![The Gitpod Theia Interface](/uploads/terminal.png)

Now you'll want to click your mouse on big box on the bottom, thats a terminal! 
In this terminal, copy and paste the following, then hit <kbd>Enter</kbd>:

```bash
git branch site
git checkout site
cd ..
wget https://github.com/gohugoio/hugo/releases/download/v0.58.3/hugo_extended_0.58.3_Linux-64bit.tar.gz
tar zxf hugo*
```

Great! Now you've installed Installed hugo!

The next thing to do, is run `hugo new site <your username here>.github.io` (remember, always hit <kbd>Enter</kbd>).
The next step is to run `cd <your username here>.github.io`.

Perfect! Your site is now done!  
.
.
.
.

##### Not Really... 

Now you've got to add a theme!

First, start of by picking one of the many [Hugo Themes Available](https://themes.gohugo.io/) (and while your at it I would suggest looking for one that has a `Resposive` tag, they will load fast and look great on mobile). Once you've setteled on the on you like, click on the download button, it will take you to the github page for that theme. For this example, I'm gonna be using the 