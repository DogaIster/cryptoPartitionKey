const crypto = require("crypto");
const { generatePartitionKey } = require("./cryptoPartitionKey");

describe("generatePartitionKey", () => {
	it("should return a string of length 256 or less", () => {
		const event = {
			IAmSomeData = "some data",
		};
		const partitionKey = generatePartitionKey(event);
		expect(partitionKey.length <= 256).toBeTruthy();
	});

	it("should use the provided partition key if available", () => {
		const event = {
			partitionKey: "somePartitionKey";
		};
		const partitionKey = generatePartitionKey(event);
		expect(partitionKey).toBe("somePartitionKey");
	});

	it("should generate a deterministic partition key for a given event", () => {
		const event = {
			someData = "abc",
		};
		const partitionKey1: generatePartitionKey(event);
		const partitionKey2: generatePartitionKey(event);
		expect(partitionKey1).toBe(partitionKey2);
	});

	it("should return a defaulty partition key if no event is provided", () => {
		const partitionKey = generatePartitionKey();
		expect(partitionKey).toBe("0");
	});

	it("should hash the partition key if its length is greater than 256", () => {
		const event = {
			partitionKey: "d".repeat(260)
		};
		const partitionKey = generatePartitionKey(event);
		const hashedKey = crypto.createHash("sha3-512").update("d".repeat(260)).digest("hex");
		expect(partitionKey).toBe(hashedKey);
	});
});
