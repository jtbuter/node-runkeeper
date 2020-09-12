import { MongoClient, Db } from 'mongodb';

async function initMongo(): Promise<Db> {
	const mongo = new MongoClient("mongodb://localhost:27017", { useUnifiedTopology: true });
	await mongo.connect();
	
	return mongo.db("my_runkeeper");
}

let db: Db = null;

export default {
	init: async (): Promise<void> => {
		db = await initMongo();
	}
};

export { db };