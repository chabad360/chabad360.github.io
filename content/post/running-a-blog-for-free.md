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

```
https://github.com/username/username.github.io
``` 
to 

```
gitpod.io/#https://github.com/username/username.github.io
```

adding `gitpod.io/#` to the begining of the URL, and hit <kbd>Enter</kbd>.