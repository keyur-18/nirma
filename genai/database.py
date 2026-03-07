import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

\
MONGO_URI = "mongodb+srv://panchalfalgun3:june2006@cluster0.0bz86ka.mongodb.net/"

class MongoDBClient:
    """
    A simple singleton-like class to manage MongoDB connections.
    """
    _instance = None
    _client = None

    def __new__(cls, uri=MONGO_URI):
        if cls._instance is None:
            cls._instance = super(MongoDBClient, cls).__new__(cls)
            try:
                # Initialize the single MongoClient instance
                cls._instance._client = MongoClient(uri)
                # Send a ping to confirm a successful connection
                cls._instance._client.admin.command('ping')
                print("Successfully connected to MongoDB!")
            except ConnectionFailure as e:
                print(f"Failed to connect to MongoDB: {e}")
                cls._instance._client = None
        return cls._instance

    @property
    def client(self):
        """
        Returns the active MongoClient instance.
        """
        return self._client
    
    def get_database(self, db_name="solar_ml"):
        """
        Returns a specific database by name.
        """
        if self._client:
            return self._client[db_name]
        return None

# Export a default instance for easy imports across the project
# e.g., from genai.database import mongo_db
# collection = mongo_db.get_database()["my_collection"]
mongo_db = MongoDBClient()
