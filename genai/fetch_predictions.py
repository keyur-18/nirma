import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from genai.database import mongo_db

def get_high_risk_predictions(limit=20000):
    """
    Fetches documents from the 'predictions' collection in the 'solar_ml' database.
    """
    try:
        # Get the solar_ml database (which is now the default)
        db = mongo_db.get_database()
        
        if db is not None:
            # Access the 'predictions' collection
            predictions_col = db["predictions"]
            
            # Fetch data where risk_score >= 0.70 and get unique inverter_id
            print(f"Fetching up to {limit} predictions from solar_ml.predictions where risk_score >= 0.70 (unique inverters)...")
            
            # Use an aggregation pipeline to filter, group by inverter_id, and limit
            pipeline = [
                {"$match": {"risk_score": {"$gte": 0.6}}},
                {"$group": {
                    "_id": "$inverter_id",
                    "doc": {"$first": "$$ROOT"}  # Keep the first matching document for each inverter
                }},
                {"$replaceRoot": {"newRoot": "$doc"}},
                {"$limit": limit}
            ]
            
            results = list(predictions_col.aggregate(pipeline))
            
            if not results:
                print("No predictions found in the collection.")
            else:
                for idx, pred in enumerate(results, 1):
                    # Clean up output for console (convert ObjectId to string for printing if needed)
                    pred['_id'] = str(pred['_id'])
                    print(f"[{idx}] {pred}")
            return results
        else:
            print("Failed to access database. Connection might be down.")
            return []
            
    except Exception as e:
        print(f"Error fetching predictions: {e}")
        return []

if __name__ == "__main__":
    # When run directly, test fetching 15 records
    get_high_risk_predictions(limit=200000)
