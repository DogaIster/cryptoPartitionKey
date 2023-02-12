const crypto = require("crypto");
const DEFAULT_PARTITION_KEY = "0";
const MAX_KEY_LENGTH = 256;   

exports.generatePartitionKey = (event) => {
  let partitionKeyCandidate = DEFAULT_PARTITION_KEY;

  if(event) {
    partitionKeyCandidate = event.partitionKey || JSON.stringify(event);

    if(typeof partitionKeyCandidate !== "string") {
      partitionKeyCandidate = JSON.stringify(partitionKeyCandidate);
    }

    if(partitionKeyCandidate.length > MAX_KEY_LENGTH) {
      partitionKeyCandidate = crypto
        .createHash("sha3-512")
        .update(partitionKeyCandidate)
        .digest("hex");
    }
  }

  return partitionKeyCandidate
};
