import casual from "casual"; //allows to get random data

const mocks = {
	Election: () => ({
		_id: casual.uuid,
		title: casual.title
	}),
	String: () => "Hello Derek" //this overwrites what the default for String is
};

export default mocks;
