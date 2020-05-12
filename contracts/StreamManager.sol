pragma solidity >= 0.5 .0;

/**
@dev Stream Manager Contract Definition
@notice Responsible for managing all user sablier streams
 */

contract StreamManager {

    /**=========================================================== struct definition start/**=========================================================== */
    struct Streamer {
        address streamAddress;
        uint256[] streams;
    }
    /**=========================================================== contract variables definition start/**=========================================================== */
    mapping(address => Streamer) streams;

    constructor() public {

    }
    /**
    *@dev adds streamID to the global streamer storage
    @param streamID the stream ID returned by the sablier contract
     */
    function addToStreamersStreams(uint256 streamID) public returns(bool) {
        require(msg.sender != address(0), "Invalid sender address");
        require(streamID > 0, "Invalid stream id");
        streams[msg.sender].streamAddress = msg.sender;
        streams[msg.sender].streams.push(streamID);
        return true;
    }
    /**
    *@dev gets all streamer streams from the global streamer storage
     @return all streamer id
     */
    function getStreams() public view returns(uint256[] memory) {
        return streams[msg.sender].streams;
    }

}