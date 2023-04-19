//SPDX-License-Identifier: GPL-3-0
pragma solidity ^0.8.0; //Use any version 8 or higher 
pragma experimental ABIEncoderV2;

contract DCoC {
    struct userInput{ //Input Types - based off form in main.html
        address StaffWallet;
        int PID;
        string HospitalName;
        string DrugName;
        int DrugDosage;
        string Location;
        uint stamp;
    }

    int public count;

    mapping(int => userInput) public dataInputs; //Put all strucutre data into a mapping (where it stores and recieves similar to an array)
    function insert(address _StaffWallet, 
    int _PID,
    string memory _HospitalName, 
    string memory _DrugName,                        //memory stores the input
    int _DrugDosage, 
    string memory _Location
    ) external {

        uint _stamp = block.timestamp;
        dataInputs[count].StaffWallet = _StaffWallet;   //Matches the structure to the mapping
        dataInputs[count].PID = _PID;                       //takes 5 user inputs and 1 from the Smrt contract (time)
        dataInputs[count].HospitalName = _HospitalName;
        dataInputs[count].DrugName = _DrugName;
        dataInputs[count].DrugDosage = _DrugDosage;
        dataInputs[count].Location = _Location;
        dataInputs[count].stamp = _stamp;

        count++;

    } 
    //Pulls fromt the memory that is above within function insert
    function read(int _count) public view returns(address, int, string memory, string memory, int, string memory, uint){
            return(dataInputs[_count].StaffWallet,
            dataInputs[_count].PID,
            dataInputs[_count].HospitalName,
            dataInputs[_count].DrugName,
            dataInputs[_count].DrugDosage,
            dataInputs[_count].Location,
            dataInputs[_count].stamp
            );
    }
}