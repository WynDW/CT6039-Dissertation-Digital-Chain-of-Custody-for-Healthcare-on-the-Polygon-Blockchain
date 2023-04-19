web3 = new Web3(web3.currentProvider);



async function login() {
    try{
    if(typeof window.ethereum == "undefined"){ //Looks to see if metamask is installed
        alert("Metamask is not currently installed");
    }

    await window.ethereum.enable(); // Open Metmask window 
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    if(account > 0){
    alert("Redirecting please remember to log out of the crypto wallet to return to homepage");
    window.location.href = "main.html";
    }
}

catch(error){ //Links to the try within the loging (This is for faied log ins)
    if(error.code == 4001){ //The wallet denied the transaction (User done)
        alert("You have rejected the trasnsaction within your wallet");
    }
    else if(error.code == -32002){ //32002 is click out of the window when openeded
        alert("It appears you have clicked out of your crypto wallet - Please go to your browser extension at the top of your screen and log in");
    }
}


}

