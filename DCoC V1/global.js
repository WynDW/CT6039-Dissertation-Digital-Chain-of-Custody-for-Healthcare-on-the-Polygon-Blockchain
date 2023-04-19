window.ethereum.on('accountsChanged', (account) => { //When User logs out of their crypto wallet - display message and go back to the loging page.
    if (!account.length) {
      alert("You have logged out of Metamask, returning to homepage");
      window.location.href = "index.html";
    }
});
// Says etherum - because Polygon is a subchain of Etherum - Does not run on Etherum :) 