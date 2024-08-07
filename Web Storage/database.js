let worlds = ["players", "common", "regions"];
let version = 5;

let deleteKeys = [];
let addValues = [];

let storages = {};

function OpenDB(storageName) {
	return new Promise(function(resolve, reject){
		if(storages[storageName] !== undefined){
			resolve(storages[storageName]);
			return;
		}

		let openRequest = indexedDB.open(storageName, version);

		openRequest.onupgradeneeded = function() {
			// срабатывает, если на клиенте нет базы данных
			// ...выполнить инициализацию...

			storages[storageName] = openRequest.result;
		
			for (var i = worlds.length - 1; i >= 0; i--) {
				let worldKey = worlds[i]; 

				if(storages[storageName].objectStoreNames.contains(worldKey) === false){
					storages[storageName].createObjectStore(worldKey);
				};
			}
		};

		openRequest.onsuccess = function(){
			storages[storageName] = openRequest.result;

			console.log("opened db: " + storageName);
			resolve(storages[storageName]);
		};
	});
}

function Init(callback) {
	console.log("database init");

	callback();
};

function OpenStorage(storageName, success, error) {
	OpenDB(storageName).then(function(storage){
		success();
	})};

function Save(storageName, baseName, key, value) {
	console.log("database save: " + key);

	let db = storages[storageName];
	let transaction = db.transaction(baseName, "readwrite");

	let worlds = transaction.objectStore(baseName);

	let request = worlds.put(value, key);

	request.onsuccess = function() {
		console.log("world saved");
	};

	request.onerror = function() {
		console.log("world error save");
	};

};

function Apply() {
	console.log("database apply");

	deleteKeys.forEach(function (item, index, array) {
  		console.log(item, index);
	});

	deleteKeys.length = 0;
};

function GetData(storageName, baseName, key, success, error) {
	let db = storages[storageName];
	let transaction = db.transaction(baseName, "readonly");

	let store = transaction.objectStore(baseName);

	let request = store.get(key);

	console.log(request);

	request.onsuccess = function() {
		if(request.result === undefined){
			error();
		}
		else{
			success(request.result);

			console.log("success: " + request.result);
		}

	};

	request.onerror = function() {
		console.log("erorr: " + key);
		error();
	};
};

function Delete(storageName, baseName, key) {
	deleteKeys.push(key);

	let db = storages[storageName];
	let transaction = db.transaction(baseName, "readwrite");

	let store = transaction.objectStore(baseName);

	let request = store.delete(key);

	request.onsuccess = function() {

	};
};

function HasKeyData(storageName, baseName, key){
	return false;
};

function DeleteDatabase(databaseName) {

	indexedDB.deleteDatabase(databaseName);
};


async function GetWorlds(callback) {
	let levelsData = [];
	let prewiewsData = [];

	let data = {};

	try{
		let list = await indexedDB.databases();

		for (var i = 0; i < list.length; i++) {
			let worldName = list[i].name;
			
			if(worldName.indexOf("pw_") > -1){
				console.log(worldName);

				try {
					let db = await OpenDB(worldName);

					try {
						let level = await GetLevelData(db);
						let preview = await GetWorldPreviewa(db);
		
						levelsData[levelsData.length] = level;
						prewiewsData[prewiewsData.length] = preview;
					} catch (error) {
						console.log("get level data errror");
					}
				} catch (error) {
					
				}
			}
		}
	}
	catch (error) {
		console.error("world not get");
	}
	
	data.Worlds = levelsData;
	data.Previews = prewiewsData;

	console.log("---------------")
	console.log(data);

	if(callback !== undefined){
		callback(JSON.stringify(data));
	}
};

function GetLevelData(storage) {
	return GetDataFromStorage(storage, "common", "level");
}

function GetWorldPreviewa(storage) {
	return GetDataFromStorage(storage, "common", "preview");
}

function GetDataFromStorage(storage, nameDatabase, key) {
	return new Promise(function(resolve, reject){
		let transaction = storage.transaction(nameDatabase, "readonly");

		let store = transaction.objectStore(nameDatabase);

		let request = store.get(key);

		request.onsuccess = function() {
			if(request.result === undefined){
				console.log(key + " not found");
				reject();
			}
			else{
				console.log("success: " + request.result);
				resolve(request.result);
			}
		};

		request.onerror = function() {
			console.log("erorr");
			reject();
		};
	});
}
