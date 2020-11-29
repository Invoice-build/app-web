---
title: The Ethereum Invoice Builder
description: This post is an introduction to Invoice.build, what it is and what it might become.
published: true
publishedAt: 27 Nov 2020
publishedTimestamp: 2020-11-27
modifiedTimestamp: 2020-11-27
author_name: Gareth Fuller
author_twitter: garethafuller
---

# The Ethereum Invoice Builder
This post is an introduction to Invoice.build (IB), what it is and what it might become.

## What it is
*tl;dr here's a demo of the complete flow:* https://youtu.be/fzqy800piNk

Invoice.build is as self-explanatory as possible, it is an invoice builder that creates payment pages for Ethereum tokens such as DAI and USDC.

A select list of tokens are currently supported:

- ETH
- DAI
- USDC
- USDT

![Token selection](/images/blog/posts/the-ethereum-invoice-builder/token-selection.png)

Invoice data is not currently stored on-chain, it is stored in a regular SQL database. Considering that IB is built for Ethereum tokens you might ask why that is?

It makes a lot of sense to store invoice data on-chain and perhaps even tokenize invoices in some way via smart contracts on Ethereum. 

However, IB is not built in this way yet because I wanted to first and foremost provide a nice user experience. I also wanted to get something useful built and public quickly so that I could get user feedback and iterate. A more Ethereum native experience can come later with appropriate planning and design.

The current point of the app is simply to provide context to Ethereum transactions. The context here is business to business transactions in the form of a traditional invoice, for example, an invoice from a freelance software engineer to their client for work on a crypto project.

Once an invoice has been created through IB, invoice payments can be made with Web3 enabled browsers and wallets supported by WalletConnect.

![Payment dialog](/images/blog/posts/the-ethereum-invoice-builder/payment-dialog.png)

The crypto community and in particular the Ethereum community are naturally concerned about privacy and decentralization of applications built for their network. That is partly why it makes sense to move invoices completely on-chain at some point.

In the meantime, I have added a couple of settings as a stop-gap for these concerns. Invoices can be password protected and if a password is provided the invoice can be E2E encrypted. This ensures that any identifiable information provided to create an invoice is private and only accessible to users who know the password.

![Payment dialog](/images/blog/posts/the-ethereum-invoice-builder/invoice-settings.png)

In addition to these privacy settings, I have made everything possible about how the app is built and run public. This includes the [code](https://github.com/Invoice-build), [roadmap](https://trello.com/b/RKj2K6Hz/product-roadmap), [analytics](https://app.usefathom.com/share/qktowsha/invoice.build#/?range=last_7_days&site=27918), basically everything except the data stored in the database.

## What it might become
As discussed already, the primary goal is to move the entire invoice creation and data storage on-chain. 

What does this look like? Nothing has been decided yet but here is how I plan to make it work.

When creating an invoice, instead of saving the invoice information to an SQL database, a hash of the invoice data will be stored in [IPFS](https://ipfs.io/) and a reference to that hash will be stored as part of the invoice creation transaction.

The creation transaction itself will probably initiate the storage of a smart contract Struct that represents the invoice in someway. I would then like to represent the value of the invoice as a tradeable token. Why?

Invoices have value before they are paid off, if they have been formally accepted by the client. This is known as factoring and allows a business sell its accounts receivable (i.e., invoices) to a third party (called a factor) at a discount.

I can imagine marketplaces in the future where invoices created via these smart contracts can be opennly traded, given that the invoices have been accepted with a cryptographic signature from a known to be reputable address, e.g. maker.eth.

Another potential future feature is payment streaming. That is, streaming payment of the invoice to the recipient over time. This could be done via a protocol like [Sablier](https://sablier.finance/).

---

This is my current state of thinking about invoice.build. It will probably change over time. If you have any questions or would like to suggest a feature or direction to build in please reach out to hello@invoice.build.
