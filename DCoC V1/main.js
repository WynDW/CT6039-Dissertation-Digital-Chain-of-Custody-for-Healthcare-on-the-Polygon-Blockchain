web3 = new Web3(web3.currentProvider);

//JS needs to understand how to link to the smart contract
var DCoC_Link;
var contract_Address = "INSERTADDRESS"; //Past Wyn again here, if deployment isnt working check this contract address matches Remix IDE
var contract_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_StaffWallet",
				"type": "address"
			},
			{
				"internalType": "int256",
				"name": "_PID",
				"type": "int256"
			},
			{
				"internalType": "string",
				"name": "_HospitalName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_DrugName",
				"type": "string"
			},
			{
				"internalType": "int256",
				"name": "_DrugDosage",
				"type": "int256"
			},
			{
				"internalType": "string",
				"name": "_Location",
				"type": "string"
			}
		],
		"name": "insert",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "count",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"name": "dataInputs",
		"outputs": [
			{
				"internalType": "address",
				"name": "StaffWallet",
				"type": "address"
			},
			{
				"internalType": "int256",
				"name": "PID",
				"type": "int256"
			},
			{
				"internalType": "string",
				"name": "HospitalName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "DrugName",
				"type": "string"
			},
			{
				"internalType": "int256",
				"name": "DrugDosage",
				"type": "int256"
			},
			{
				"internalType": "string",
				"name": "Location",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "stamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "_count",
				"type": "int256"
			}
		],
		"name": "read",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

DCoC_Link = new web3.eth.Contract(contract_ABI, contract_Address) //Creates a new instance of the smart contract - how to connect to it (where do I go)

//Autofill the Staff ID by grabbing the connected account from the wallet 
async function autoFill() {
	const accounts = await web3.eth.getAccounts(); //which wallet am I connecting with?
	const account = accounts[0];
	document.getElementById("ID").value = account;
}

async function upload() {
	let sending;
	try {
		const accounts = await web3.eth.getAccounts(); //which wallet am I connecting with?
		const account = accounts[0];
		//Tell the Javascript what the elements from the forms are
		var ID = document.getElementById("ID").value;
		var PID = document.getElementById("PID").value;
		var hosp = document.getElementById("hosp").value;
		var DrugN = document.getElementById("DrugN").value;
		var DrugD = document.getElementById("DrugD").value;
		var loc = document.getElementById("loc").value;



		//send data from DCoC_Link to the insert function on the smart contract
		//let txHash = sending.transactionHash;

		sending = await DCoC_Link.methods.insert(ID, PID, hosp, DrugN, DrugD, loc).send({ from: account });
		//let receipt = await web3.eth.getTransactionReceipt(sending.transactionHash);
		//console.log("Transaction sent with hash:", sending.transactionHash);
		sending = sending.transactionHash;
		




	}
	// error handling:
	catch (error) { //Links to the try within the loging (This is for faied log ins)
		if (error.code == 4001) { //The wallet denied the transaction (User done)
			alert("You have rejected the trasnsaction within your wallet");
		}
		else if (error.code == -32002) { //32002 is click out of the window when openeded
			alert("It appears you have clicked out of your crypto wallet - Please go to your browser extension at the top of your screen and log in");
		}

	}
	reading(sending); //Call the reading function at the end of the upload so that teh table of entries automatically refreshers without the user needing to 
}

var hashes = [];
//Call the Data written to the chain 
async function reading(transactionHash) {
	const accounts = await web3.eth.getAccounts(); //which wallet am I connecting with?
	const account = accounts[0];
	var entryArray = [];
	var entries = [];
	

	//console.log(sending)

	//take the hash value from the object - then push that vallue into the hashes array
	if (transactionHash !== undefined){
		hashes.push(transactionHash);
		alert("Your Transaction Hash is " + transactionHash + " Please keep note of this to view the block data on Polyscan :)")
		//Unable to add the transaction Hash into the table as it is currently unsupported - Print it by an alert
	}


	let count = await DCoC_Link.methods.count().call();
	count = count - 1 //As mapping has no value it will show an empty value at the end - I don't want this displyed - so minus 1
	for (let x = 0; x <= count; x++) {
		entries = await DCoC_Link.methods.read(x).call();
		//console.log("all entries", entries);

		entryArray.push(entries);
		//console.log(entryArray); //debug feature

	}

	var table = document.getElementById("entries"); //entries is the ID within the HTML
	//Provide the table with static headers - so the table is shown all the time 
	table.innerHTML = "<tr><th>Staff ID</th><th>Patient ID</th><th>Hospital</th><th>Drug Name</th><th>Drug Dose</th><th>Room</th><th>Transaction Time (epoch)</th></tr>"; //empty table to prevent duplication of records when getting transaction details

	//Filter the shown entries so that in the table the only data shows is the data matching the logged in user
	entryArray.filter((arrayRecord) => (
		arrayRecord[0] == account
	)).forEach((entry) => {
		var newRow = table.insertRow(table.length);
		for (let y = 0; y < 7; y++) {
			var cell = newRow.insertCell();
			cell.innerHTML = entry[y]; //innerHTML so that the table of entries does not get printed twice
		}
	});

}

//calls the functions when the page refreshes
$(document).ready(function () {
	autoFill();
	reading();

});
