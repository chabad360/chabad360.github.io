---
author: "Mendel Greenberg"
cover: "/uploads/project/making-an-arm-cluster/armcluster.jpg"
date: 2019-11-28T08:39:58Z
draft: true
project: "MAC"
summary: "No, that's not a Pi..."
tags: ["cluster", "hardware"]
title: "MAC: The Hardware"

---
## No it's not a Pi

It's an [ODroid MC1](https://www.hardkernel.com/shop/odroid-mc1-my-cluster-one-with-32-cpu-cores-and-8gb-dram/), 
a board based on the [ODroid XU4](https://www.hardkernel.com/shop/odroid-xu4-special-price/), 
an SBC that is multiple times more powerful than the Pi.

### An ODroid What?

The ODroid XU4, which has (to quote the landing page):

> * Samsung Exynos 5422 Cortex™-A15 2Ghz and Cortex™-A7 Octa core CPUs
> * Mali-T628 MP6(OpenGL ES 3.1/2.0/1.1 and OpenCL 1.2 Full profile)
> * 2Gbyte LPDDR3 RAM PoP stacked

Now, sure there is a 2GB model of the Pi,  but nothing the Pi has compares to an overpowered 8 core processor, plus a GPU featuring OpenGL (ES) and OpenCL support.

If you still don't think that's good enough, you can check that landing page for some benchmarks.

## What I Got

So this is a nice table with prices of what I got, a BOM (a Bill of Materials):

> Note: This is not exactly what I purchased, as some of the items I bought are bad quality or no-longer available.  
> Also, This list and all the other parts of this project will be updated over time, so stay tuned.

| Name | Qty | Price | Price (ea.) |
| :--- | --: | ----: | ----------: |
| [ODroid MC1 Solo](https://ameridroid.com/products/odroid-mc1-solo) | 3x | $149.85 | $49.95 |
| [ODroid HC1](https://ameridroid.com/products/odroid-hc1) | 1x | $49.95 | $49.95 |
| [TP-Link AC1200](https://www.amazon.com/dp/B07N1L5HX1) | 1x | $49.99 | $49.99 |
| [Cat6 Cable](https://www.amazon.com/dp/B00C4U030G) | 1x | $9.99 | $9.99 |
| [32GB MicroSD card](https://www.amazon.com/dp/B073JWXGNT) | 4x | $33.12 | $8.28 |
| [128GB SATA SSD](https://www.amazon.com/dp/B00D4AVPZC) | 1x | $22.06 | $22.06 |
| [PSU Unit](https://www.amazon.com/dp/B06XK3X3PW) | 1x | $24.99 | $24.99 |
| [18awg 2.1x5.5mm Barrel Plugs](https://www.amazon.com/dp/B072BXB2Y8) | 1x | $9.89 | $9.89 |
| Total | | $349.80 (approx) | | 

You'll also need a few tools:

| Name | Why? |
| :--- | :--- |
| Wire Strippers | You'll have to do some stripping to setup the PSU |
| Screw Driver | Needed to Screw some things together |

## Hardware Setup

> Unfortunately I don't have any pictures to attach at this time, but they're coming...

* Start by unpacking the ODroid Boards, and the SSD, screw the SSD onto the ODroid HC1 and then stack the SBCs onto each other.  
* Next, take the Barrel Plugs, and strip the loose ends of the male plugs, screw the red wires onto one of the `V+` screw terminals, and screw the black wires onto one of the `V-` terminals.
You'll also need to strip at **Grounded (three prong)** power cable and screw the white wire to the `L` terminal, the green wire to the `N` terminal and the black wire to the `(⏚)` terminal.  

    > ⚠️ Warning: This will be the connections that are going straight into the wall outlet (i.e. 120V), make sure you screw the wires in tightly. Otherwise you may get very hurt.

* Plug everything in, but not the SD Cards, and the not the cables that go into the wall, those will go in later.

