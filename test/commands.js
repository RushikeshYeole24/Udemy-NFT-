const instance = await NftMarket.deployed();

instance.mintToken("https://green-manual-starfish-285.mypinata.cloud/ipfs/Qmf3pXp7hUNia9uGRUgfysejwZmvTd19aXKsBqTxJKfYGG","500000000000000000", {value: "25000000000000000",from: accounts[0]})
instance.mintToken("https://green-manual-starfish-285.mypinata.cloud/ipfs/QmdAEJESUkPSqfUWz61Xdow9L5FdU62d3KA24EmPnkBidx","300000000000000000", {value: "25000000000000000",from: accounts[0]})