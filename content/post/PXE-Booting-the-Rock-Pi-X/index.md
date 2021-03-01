---
title: "PXE Booting the Rock Pi X"
# cover: "images/caab_logo.png"
tags:
  - "Rock Pi X"
  - "PXE"
summary: "It's not *that* hard."
date: 2021-02-05T08:57:59-05:00

draft: true
---

# The Rock Pi X

I have a [Rock Pi X]. For that matter I have quite a few of them thanks to a client project. 
Part of this project required me to PXE boot the Rock Pi X. Now while at first it seemed like this would be simple, 
it became quickly evident that this would not be very straight forward for a two reasons:

1. The UEFI drivers for the networking stack are missing from the BIOS image.
2. Despite appearances to the contrary, there is no actual PXE stack in the BIOS.

So how does one do PXE on the Rock Pi X? Well, I'll be glad to tell you.

## iPXE

The first thing you'll need to do is get to a point where we can download a boot image from the network and run it. 
To do this we'll be using [iPXE](https://ipxe.org/), an "open source boot firmware" that implements a full network booting stack (it's kinda in the name) including support for the RealTek 8168 network card that the Rock Pi X uses.

So, open up your local terminal, and lets clone and build iPXE:

```shell
$ git clone git://git.ipxe.org/ipxe.git
$ cd ipxe/src
$ make bin-x86_64-efi-sb/rtl8168.efi
```

Once `make` is done, you should now have a ready to go iPXE binary that you can boot on the Rock Pi X. Congrats, yer all done!

### Really?

Ha, **No**!

But before I go any further, I wanna break down that last line:

```shell
$ make bin-x86_64-efi-sb/rtl8168.efi
```

More specifically:

```shell
bin-x86_64-efi-sb/rtl8168.efi
```

This command has multiple parts to it:

```shell
bin-x86_64-efi-sb/rtl8168.efi
 ^    ^     ^   ^    ^  
 |    |     |   |  Build the binary with just the `rtl8168` driver
 |    |     |  Allow it to be signed for Secure Boot
 |    |   Build it as an ELF (for booting with UEFI)
 |   For x86_64
 Produce a binary
```

<!-- - `bin`: Produce a binary
- `x86_64`: For x86_64
- `efi`: as a ELF (for booting with UEFI)
- `sb`: and make allow it to be signed for Secure Boot.
- `/`: Build the binary in the folder `bin-x86_64-efi-sb`
- `rtl8168.efi`: Build the binary with just the `rtl8168` driver. -->

See, the `make` command in iPXE is smart, based on how you want to use the binary, that's what it's going to build.
But there is one more thing that we really need to do before we can actually try and boot this.
We need a way to tell iPXE what to do, and to do that we are going to utilize scripts.

Here's an example of one (taken straight from [the website](https://ipxe.org/howto/chainloading#breaking_the_loop_with_an_embedded_script)):

```shell
#!ipxe
  
dhcp
chain http://boot.ipxe.org/demo/boot.php
```

This script does two things:

1. It tells iPXE to start up the network stack and get an IP address (through DHCP).
2. It fetches another iPXE script from [`http://boot.ipxe.org/demo/boot.php`](http://boot.ipxe.org/demo/boot.php), which contains:
   
    ```shell
    #!ipxe

    kernel vmlinuz-3.16.0-rc4 bootfile=http://boot.ipxe.org/demo/boot.php fastboot initrd=initrd.img
    initrd initrd.img
    boot
    ```

    This script downloads a kernel and an initramfs and then boots the system (I'll go into more detail later).

Let`s make our own boot script:

```shell
$ cat <<EOF
#!ipxe

:retry
ifconf --configurator dhcp net0 || goto retry
chain http://192.168.1.20/boot.ipxe
EOF > boot.ipxe
```

Now I want to go through each line here:

- ```shell
  :retry
  ```
  
  This creates a label called retry.

- ```shell
  ifconf --configurator dhcp net0 || goto retry
  ```
  
  This line tells iPXE to setup the interface `net0` or if it fails, go back to the label `retry`.

- ```shell
  chain http://192.168.1.20/boot.ipxe
  ```
  
  Once iPXE gets the network working, download and run a script from `192.168.1.20` called `boot.ipxe`.

Feel free to change the IP address to what ever you want it to be, even a domain name.

Now let's add this script to out iPXE boot image:

```shell
$ make bin-x86_64-efi-sb/rtl8168.efi EMBED=boot.ipxe
```

TADA!

That's it, now you're almost ready to get a perpetual `404`.  
Yes, a `404` because we haven't actualy created a `boot.ipxe` that can be downloaded from `192.168.1.20`, and almost because I still haven't told you how to get this running on a Rock Pi X.

<!-- ### Booting - Part 2

Now we need to write the `boot.ipxe` that lives on our server -->

At this point, if you want to use Secure Boot, this is the time to set it up. I'm not going to include how to create secure boot keys, as that's a rather [well](http://jk.ozlabs.org/docs/sbkeysync-maintaing-uefi-key-databases/) [documented](https://wiki.archlinux.org/index.php/Unified_Extensible_Firmware_Interface/Secure_Boot#Creating_keys) [process](https://github.com/Foxboron/sbctl).

> Note: However you end up going about creating your keys and signing iPXE, don't follow the methods that use shim/mokmanager, as this is not compatible with how we are going to set up the Rock Pi X.  
> Also, make sure to sign the iPXE image.

## X-PXE

I'm going to detour from the iPXE setup to talk about the iPXE bootup.

There are a few steps involved in setting up the Rock Pi X to boot with iPXE:

1. Partition the Drive.
2. Format the UEFI partition.
3. Add the iPXE binary to the UEFI partition.
4. Load secure boot keys. (optional)

If you're setting up PXE booting, you're probably planning to do it on multiple devices, if so, you'll probably want to have a script that does everything (or most of it) in one shot.

Currently I've been using a UEFI Shell script plus some manual work, it's rather inconvenient but it works.
