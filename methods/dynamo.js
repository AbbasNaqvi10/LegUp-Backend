const AWS = require('aws-sdk');

AWS.config.update({
	region: process.env.AWS_DEFAULT_REGION,
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const DocumentClient = new AWS.DynamoDB.DocumentClient();

const getAllItems = async (TABLE_NAME) => {
	const params = {
		TableName: TABLE_NAME,
	};
	return await DocumentClient.scan(params).promise();
};

const getItemsByEmailAndPass = async (TABLE_NAME, p_email) => {
	var params = {
		TableName : TABLE_NAME,
		Key: {
		  email: p_email
		}
	  };
	   const data= await DocumentClient.get(params, function(err, data) {
		 if (err) console.log(err, err.stack); 
		//  else     console.log(data);           
	   }).promise()
	   return data;
};

const getSingleItemById = async (TABLE_NAME, id) => {
	const params = {
		TableName: TABLE_NAME,
		Key: {
			id,
		},
	};
	return await DocumentClient.get(params).promise();
};

const insertItem = async (TABLE_NAME, itemObject) => {
	const params = {
		TableName: TABLE_NAME,
		Item: itemObject,
	};
	return await DocumentClient.put(params).promise();
};

const generateUpdateQuery = (fields) => {
	let exp = {
		UpdateExpression: 'set',
		ExpressionAttributeNames: {},
		ExpressionAttributeValues: {},
	};
	Object.entries(fields).forEach(([key, item]) => {
		exp.UpdateExpression += ` #${key} = :${key},`;
		exp.ExpressionAttributeNames[`#${key}`] = key;
		exp.ExpressionAttributeValues[`:${key}`] = item;
	});
	exp.UpdateExpression = exp.UpdateExpression.slice(0, -1);
	return exp;
};

const updateItem = async (TABLE_NAME, id, itemObject) => {
	const expression = generateUpdateQuery(itemObject);
	const params = {
		TableName: TABLE_NAME,
		Key: {
			id,
		},
		ConditionExpression: 'attribute_exists(id)',
		...expression,
		ReturnValues: 'UPDATED_NEW',
	};
	return await DocumentClient.update(params).promise();
};

const deleteSingleItemById = async (TABLE_NAME, id) => {
	const params = {
		TableName: TABLE_NAME,
		Key: {
			id,
		},
	};
	return await DocumentClient.delete(params).promise();
};

// const StoredFileLocation= async(files,nameAndLocation,)=>{
// 	for(let i =0;i<files.length;i++){
// 		  var params = {
// 			TableName : 's3_file_storage_location' ,
// 			Item:{
// 		  		random:`xxx${i}`,
// 				user_id:'0',
// 				// nameOfFile: forFileLocationOnlyValue[i],
// 			  nameOfFile:nameAndLocation[0][i].f,
// 			  locate:nameAndLocation[0][i].l
// 			}
// 	  	};
// 		var documentClient = new AWS.DynamoDB.DocumentClient();
// 		documentClient.put(params, function(err,data) {
// 	  		if (err) console.log(err);
// 	  		else {console.log(data)}
// 		});
// 	}
//}

const StoredFileLocation= async(files,forFileLocationOnlyValue)=>{
	var documentClient = new AWS.DynamoDB.DocumentClient();

	var params = {
		TableName : 's3_file_storage_location' ,
		Item:{
		  		random:'0',
				user_id:'0',
				APPLE_FILE_1: forFileLocationOnlyValue[0],
			  
		}
  	};
	documentClient.put(params, function(err,data) {
	  		if (err) console.log(err);
	  		else {console.log(data)}
	});
// -------------------------------------file no 2-------------------------------------------------
	var params = {
		TableName : 's3_file_storage_location' ,
		Item:{
				random:`1`,
				user_id:'0',
				APPLE_FILE_2: forFileLocationOnlyValue[1],
			}
	};
	documentClient.put(params, function(err,data) {
			if (err) console.log(err);
			else {console.log(data)}
	});

}

module.exports = {
	DocumentClient,
	getAllItems,
	getSingleItemById,
	insertItem,
	updateItem,
	deleteSingleItemById,
	getItemsByEmailAndPass,
	StoredFileLocation,
};
