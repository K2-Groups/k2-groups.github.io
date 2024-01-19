---
layout: default
title: OMS Shape
parent: OMS
grand_parent: Shapes
---

# Order Management System Skeleton Shape
{: .no_toc }

<details open markdown="block">
  <summary>Table of content</summary>
  - TOC
  {:toc}
</details>
---

## Problem Statement

### Problem brief
Currently, we have a trading bot that can submit an order to one broker and we can't handle multiple brokers for order submission.
Also, we cannot handle multiple users at the same time.


### Why should we care?
* We want to trade in other markets.
* We want to handle more users.

### Root Causes
We didn't consider the requirement to submit orders to another broker therefore, we cannot handle large amounts of money.
We didn't consider the requirement to trade with other bots.


## Solution
We want to implement an OMS service to handle one bot and one broker with one user.

## Boundaries

### Key questions
1. How should we want to handle a user?  
   We don't want to design the user management system and a user only contains their API key
2. How should we handle the amount of buy?  
   All information to submit a buy order is given by the bot, and we have to create an order based on the given information.
3. How should we handle the selling process?  
   Each order is unique by the `symbol` and the `timeframe` and `strategy name` we sell all the bought orders with that unique information.
4. How should we keep the log of an order?  
   The order should have a lifecycle with certain stages.

### User Stories/Requirement
As a user, I want to buy an order through the OMS.
As a user, I want to sell an order through the OMS.

### No Goes
1. We don't want to solve the "multiple users" problem.
2. We don't want to handle the large amounts of money.
3. We don't want to solve the "recovery mode" problem.
4. We don't want to handle the "multiple brokers" problem.
5. We don't want to solve the "risk management" problem.
6. We don't want to calculate the price and quantity of an order.
7. We don't need the live market data at this step.

### Let me see it
> TODO


## Project Management

### Appetite/Timeline
1 month from now (December 17th, 2023) A.K.A end of Dey.

### Team
Siri, Farzin, Parmida, Meyti, Mohammad.

### Documentations
List all the proceeding pages here.
