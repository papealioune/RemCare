pragma solidity >= 0.5 .0;
import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";

//@dev contract not optimised for gas its just a POC most of the data stored here could easily be centralised but meh
contract RemCare is Initializable {
    using SafeMath
    for uint256;
    /**==================================== Structs ==================================== */
    struct Donation {
        address receipient;
        address donor;
        bytes32 id;
        bool stopped;
        uint256 streamId;
        uint256 amount;
        uint256 owing;
        address tokenAddress;
        uint256 parcelCount;
        bytes32[] parcelUids;
        bool exists;
    }
    struct Donor {
        address id;
        uint256 totalDonated;
        bytes32[] dontaionKeys;
        uint256[] streamKeys;
        bool exists;
    }

    struct Receipient {
        address id;
        uint256 totalDonations;
        address[] donors;
        bool banned;
        bool exists;
    }
    /**==================================== Modifiers ==================================== */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    modifier onlyDonar(bytes32 id) {
        require(donations[id].exists && donations[id].donor == msg.sender, "Only donor can make call");
        _;
    }
    /**==================================== Events ==================================== */
    event NewDonation(bytes32 indexed id);
    /**====================================Contract Variables ==================================== */
    address payable private owner;
    bytes32[] dontaionKeys;
    mapping(bytes32 => Donation) donations;
    mapping(address => Donor) donors;
    mapping(address => Receipient) donationReceipients;
    address[] receipientKeys;
    address[] donorKeys;

    /**==================================== Contract Functions ==================================== */
    function initialize() public initializer {
        require(msg.sender != address(0), "invalid sender address");
        owner = msg.sender;
    }

    function donate(address receipient, address tokenAddress, uint256 amount, uint256 streamId, uint256 parcelCount) public returns(bool) {
        require(msg.sender != address(0), "Invalid sender address");
        require(receipient != address(0), "Invalid receipient address");
        require(tokenAddress != address(0) && tokenAddress != msg.sender && tokenAddress != receipient, "Invalid token address");
        require(amount > 0, "Invalid amount");
        require(parcelCount > 0, "Invalid parcelCount");
        require(!donationReceipients[receipient].banned, "cannot donate receipient banned");
        bytes32 id = keccak256(abi.encodePacked(receipient, tokenAddress, block.number, msg.sender));
        require(!donations[id].exists, "Dontaion already exists");
        donations[id].streamId = streamId;
        donations[id].donor = msg.sender;
        donations[id].amount = 0;
        donations[id].id = id;
        donations[id].exists = true;
        donations[id].tokenAddress = tokenAddress;
        donations[id].receipient = receipient;
        donations[id].owing = 0;
        donations[id].parcelCount = parcelCount;
        donations[id].amount = donations[id].amount.add(amount);
        dontaionKeys.push(id);
        donorKeys.push(msg.sender);
        donors[msg.sender].id = msg.sender;
        donors[msg.sender].totalDonated = donors[msg.sender].totalDonated.add(amount);
        donors[msg.sender].dontaionKeys.push(id);
        donors[msg.sender].streamKeys.push(streamId);
        donors[msg.sender].exists = true;
        donations[id].stopped = false;
        donationReceipients[receipient].id = receipient;
        donationReceipients[receipient].totalDonations = donationReceipients[receipient].totalDonations.add(amount);
        donationReceipients[receipient].donors.push(msg.sender);
        donationReceipients[receipient].banned = false;
        donationReceipients[receipient].exists = true;
        receipientKeys.push(receipient);
        emit NewDonation(id);
    }


    function stopDonationStream(bytes32 donationId, uint256 amount) onlyDonar(donationId) public returns(bool) {
        require(donations[donationId].exists, "donation not found");
        donations[donationId].stopped = true;
        donations[donationId].owing = amount;
        donationReceipients[donations[donationId].receipient].banned = true;
        return donations[donationId].stopped;
    }

    function getDonationKeys() public view returns(bytes32[] memory) {
        return dontaionKeys;
    }

    function getDonation(bytes32 donationId) public view returns(address, address, uint256, uint256, uint256, bytes32[] memory) {
        return (donations[donationId].donor, donations[donationId].receipient, donations[donationId].amount, donations[donationId].streamId, donations[donationId].owing, donations[donationId].parcelUids);
    }

    function getReceipientKeys() public view returns(address[] memory) {
        return receipientKeys;
    }

    function getReceipient(address user) public view returns(uint256, address[] memory, bool) {
        return (donationReceipients[user].totalDonations, donationReceipients[user].donors, donationReceipients[user].banned);
    }

    function getDonorStreamKeys() public view returns(uint256[] memory) {
        return donors[msg.sender].streamKeys;
    }

    function redeemParcel(bytes32 donationId, bytes32 parcelId) public returns(bool) {
        require(donations[donationId].exists, "donation not found");
        donations[donationId].parcelUids.push(parcelId);
        donations[donationId].parcelCount = donations[donationId].parcelCount.sub(1);
        return true;
    }
}