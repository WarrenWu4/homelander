import json
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Input
import sys
import os


def get_recommendation_reason(product, user_info, num_connections):
    reasons = {
        "Whole Home WIFI": "Based on your high number of wireless devices",
        "Wi-Fi Security": "Recommended for basic network protection",
        "Wi-Fi Security Plus": "Enhanced security for your growing network",
        "My Premium Tech Pro": "For expert technical support",
        "Identity Protection": "To protect your personal information",
        "Total Shield": "Complete device and network protection",
        "Youtube TV": "Enhanced entertainment package",
        "Additional Extender": "To improve WiFi coverage",
        "Fiber 500": "Entry-level high-speed internet",
        "Fiber 1 G": "Better speed for your usage",
        "Fiber 2 G": "Recommended for your high bandwidth usage",
        "Fiber 5 G": "Ultimate speed for power users",
        "Fiber 7 G": "Maximum performance for your needs",
        "Unbreakable Wi-Fi": "For reliable connectivity",
        "Battery Backup": "For uninterrupted service"
    }
    return reasons.get(product, "Recommended based on your usage patterns")

try:
    # Read and process customer data
    with open("./data/example_networks.csv", "r") as f:
        names = f.readline().split(',')
        values = f.read().split('\n')[:-1]
        locations = list(set([",".join(i.split(',')[15:17]) for i in values]))
    
    loc_to_index = {loc: idx for idx, loc in enumerate(locations)}
    index_to_loc = {idx: loc for idx, loc in enumerate(locations)}

    # Read additional data files
    with open("./data/county_to_city.json", "r") as f:
        county_to_city = json.load(f)
        county_to_city = {int(k): v for k, v in county_to_city.items()}

    with open("./data/outage_risk.json", "r") as f:
        outage_risk = json.load(f)

    # Get input data
    input_data = input().strip()
    
    # Check if input is a direct data string or customer ID
    if ',' in input_data:  # Direct data string
        user_info = input_data.split(',')
        # Convert data to correct formats
        user_info[0:13] = np.array(user_info[0:13]).astype(float)
        user_info[13] = float(user_info[13][:-1])  # Remove 'M' from speed
        user_info[14] = loc_to_index[",".join(user_info[14:16])]
        user_info.pop()
    else:  # Customer ID
        with open("./data/example_networks.csv", "r") as f:
            names2 = f.readline().split(',')
            values = f.read().split('\n')[:-1]
            customers = [i.split(',') for i in values]
        
        id_to_info = {customer[0]: customer[1:] for customer in customers}
        user_info = id_to_info[input_data]
        user_info[0:13] = np.array(user_info[0:13]).astype(float)
        user_info[13] = float(user_info[13][:-1])
        user_info[14] = loc_to_index[",".join(user_info[14:16])]
        user_info.pop()

    user_info = np.array([user_info], dtype=float)
    X_test = user_info

    # Define and load model
    model = Sequential([
        Input(shape=(15,)),
        Dense(256, activation='relu'),
        Dense(128, activation='relu'),
        Dense(64, activation='relu'),
        Dense(32, activation='relu'),
        Dense(8)
    ])

    model.load_weights('model.weights.h5')

    # Define products list
    results_list = [
        "Whole Home WIFI", "Wi-Fi Security", "Wi-Fi Security Plus", 
        "My Premium Tech Pro", "Identity Protection", "family_identity_protection", 
        "Total Shield", "youtube_tv", "Fiber 500", "Fiber 1 G", "Fiber 2 G", 
        "Additional Extender", "Fiber 5 G", "Fiber 7 G", "Unbreakable Wi-Fi", "Battery Backup"
    ]

    # Get predictions
    predictions = (model.predict(X_test, verbose=0) > 0.5).astype(int)
    other_products = np.zeros((len(predictions), 8))
    all_products = np.array([list(a) + list(b) for a,b in zip(predictions, other_products)])[0]

    # Process user info
    user_info = user_info[0]
    num_connections = user_info[1] + user_info[2]
    current_network = 1000000 * user_info[13]

    # Apply business rules
    if num_connections * user_info[5] > current_network or num_connections * user_info[6] > current_network:
        if current_network == 200000000:
            all_products[8] = 1
        elif current_network == 500000000:
            all_products[9] = 1
        elif current_network == 1000000000:
            all_products[10] = 1
        elif current_network == 2000000000:
            all_products[12] = 1
        elif current_network == 5000000000:
            all_products[13] = 1

    if user_info[0] == 0:
        if user_info[9] < -60 or user_info[12] < -85:
            all_products[11] = 1

    if num_connections > 10:
        all_products[6] = 1

    if user_info[1] > 25:
        all_products[0] = 1

    if num_connections > 25:
        all_products[4] = 1
        all_products[7] = 1

    # Check outage risk
    if index_to_loc[int(user_info[14])] in outage_risk:
        all_products[14] = 1
        all_products[15] = 1

    recommendations = len([j for j in all_products if j == 1])

    if recommendations < 3:
        all_products[1] = 1
        all_products[15] = 1

    # Format recommendations with reasons
    recommended_products = [
        {
            "name": results_list[i],
            "reason": get_recommendation_reason(results_list[i], user_info, num_connections)
        }
        for i, val in enumerate(all_products) if val == 1
    ]

    # Output JSON response
    print(json.dumps({
        "recommendations": recommended_products,
        "metrics": {
            "num_connections": int(num_connections),
            "current_speed": float(user_info[13]),
            "signal_strength": float(user_info[9])
        }
    }))

except Exception as e:
    print(json.dumps({"error": str(e)}), file=sys.stderr)
    sys.exit(1)