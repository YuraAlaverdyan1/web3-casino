<template>
  <div class="faq">
    <ResolveRouter />
    <h1>What is Ridotto</h1>
    <p>
      Ridotto is the very first cross-chain gambling and lottery protocol based on
      complete transparency, anonymity, security, and fairness. Our approach is to provide
      an open protocol driven by the community, where users can play, build, and even
      bankroll casino games, thus earning generous liquidity. Ridotto’s overarching goal
      is to elevate the user to the role of “house,” thereby offering a fully scalable
      alternative to centralized online gambling.Beyond our vibrant flagship casino, we
      will unleash retail ingenuity by giving users the decentralized infrastructure to
      experiment and evolve the gambling ecosystem, much like the App Store did for mobile
      gaming.
    </p>
    <div>
      <h3>What blockchain is Ridotto on?</h3>
      <p>
        As a multi-chain protocol, the Ridotto protocol will be deployed across all major
        blockchains, to include Binance Smart Chain, Avalanche, Fantom, Matic, Cardano,
        and many more as the war of the blockchains separates the wheat from the chaff.
      </p>
      <a href="">
        Check Ridotto Audit
        <img src="/migration/link.svg" alt="link">
      </a>
    </div>
    <div>
      <h3>What is NFT Farming?</h3>
      <p>
        NFT Farming is Ridotto’s solution to decentralized casino ownership. It is the
        infrastructure through which the community earns tradable proof of ownership NFTs,
        which entitles them to own, customize, and profit from Ridotto’s coming catalog of
        games.
      </p>
    </div>
    <div>
      <h3>How does NFT Farming work?</h3>
      <p>
        Community members can stake the $RDT native token to farm and progressively earn
        fractionalized Ownership NFTs. Only whole NFTs are claimable; the progressive
        fractional earning system simply exists as a mechanism to slowly give out NFTs to
        individuals, rather than giving them out all at once. However, the more an
        investor stakes, the quicker he or she will earn a whole NFT.
      </p>
    </div>
    <div>
      <h3>What are proof of ownership NFT’s?</h3>
      <p>
        Proof of Ownership NFTs are the assets earned through NFT farming. Owners can
        choose to deploy them or sell them on the secondary market. Categorized by game
        type, they entitle owners to lotteries, slot machines, specific table games, and
        more and will give its owner the ability to customize their casino product’s
        design, as well as its internal rule structure - house win rate, jackpot size, and
        to what degree the particular casino product will be open source bankrollable.
      </p>
    </div>
    <div class="faq_transactions">
      <h1>Transactions</h1>
      <BridgeTransactions :data="transactionsMock" />
    </div>
  </div>
</template>

<script setup lang="ts">
import transactionsMock from '~/data/bridge/transactions.json'
</script>

<style lang="scss" scoped>
.faq {
  padding-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  color: #f5f5f7;
  @screen xs {
    width: 90%;
  }
  @screen md {
    width: 100%;
  }
  p {
    line-height: 24px;
  }
  h1 {
    font-size: 24px;
    font-weight: 700;
  }
  h3 {
    font-size: 16px;
    font-weight: 700;
    padding-bottom: 8px;
  }
  a {
    display: flex;
    gap: 15px;
    color: #9e68ff;
    font-size: 14px;
    font-weight: 700;
    padding-top: 20px;
  }

  &_transactions {
    @screen xs {
      margin: 24px 0;
    }
    @screen sm {
      margin: 48px 0;
    }
    color: #f5f5f7;
    font-family: Exo 2;
    font-size: 24px;
    font-weight: 700;
    width: 100%;
  }
}
</style>
